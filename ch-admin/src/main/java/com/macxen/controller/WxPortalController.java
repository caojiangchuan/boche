package com.macxen.controller;

import com.alibaba.fastjson.JSONObject;
import com.macxen.config.WxMpConfiguration;
import com.macxen.config.WxMpProperties;
import com.macxen.config.sercurity.WxAuthenticationToken;
import com.macxen.domain.Customer;
import com.macxen.service.CustomerService;
import com.macxen.service.userDetails.CustomerUserDetailsServiceImpl;
import com.macxen.utils.JwtUtils;
import com.macxen.utils.ResponseEnum;
import com.macxen.utils.Result;
import com.macxen.vo.WeChatVo;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.util.RandomUtils;
import me.chanjar.weixin.common.util.crypto.SHA1;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.result.WxMpOAuth2AccessToken;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 微信认证入口
 */
@Slf4j
@RestController
@RequestMapping("/wx/portal")
@Configuration
@EnableConfigurationProperties(WxMpProperties.class)
public class WxPortalController {
	@Autowired
	private WxMpProperties wxMpProperties;
	@Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private AuthenticationManager authenticationManager;
	
    /**
     * 微信认证
     * @param appid 应用id
     * @param signature 微信加密签名
     * @param timestamp 生成签名的时间戳
     * @param nonce 随机数
     * @param echostr 生成签名的随机串
     * @return
     */
    @GetMapping(produces = "text/plain;charset=utf-8")
    public String authGet(@RequestParam(name = "signature", required = false) String signature,
                          @RequestParam(name = "timestamp", required = false) String timestamp,
                          @RequestParam(name = "nonce", required = false) String nonce,
                          @RequestParam(name = "echostr", required = false) String echostr) {

        log.info("\n接收到来自微信服务器的认证消息：[{}, {}, {}, {}]", signature, timestamp, nonce, echostr);
        if (StringUtils.isAnyBlank(signature, timestamp, nonce, echostr)) {
            throw new IllegalArgumentException("请求参数非法，请核实!");
        }
        
        final WxMpService wxService = WxMpConfiguration.getMpServices().get(wxMpProperties.getConfigs().get(0).getAppId());
        if (wxService == null) {
            throw new IllegalArgumentException(String.format("未找到对应appid=[%d]的配置，请核实！", wxMpProperties.getConfigs().get(0).getAppId()));
        }

        if (wxService.checkSignature(timestamp, nonce, signature)) {
            return echostr;
        }

        return "非法请求";
    }
    
    /**
     * 微信请求入口
     * @param appid
     * @param requestBody
     * @param signature
     * @param timestamp
     * @param nonce
     * @param openid
     * @param encType
     * @param msgSignature
     * @return
     */
    @PostMapping(produces = "application/xml; charset=UTF-8")
    public String post(@RequestBody String requestBody,
                       @RequestParam("signature") String signature,
                       @RequestParam("timestamp") String timestamp,
                       @RequestParam("nonce") String nonce,
                       @RequestParam("openid") String openid,
                       @RequestParam(name = "encrypt_type", required = false) String encType,
                       @RequestParam(name = "msg_signature", required = false) String msgSignature) {
        final WxMpService wxService = WxMpConfiguration.getMpServices().get(wxMpProperties.getConfigs().get(0).getAppId());
        log.info("\n接收微信请求：[openid=[{}], [signature=[{}], encType=[{}], msgSignature=[{}],"
                + " timestamp=[{}], nonce=[{}], requestBody=[\n{}\n] ",
            openid, signature, encType, msgSignature, timestamp, nonce, requestBody);
        
        if (!wxService.checkSignature(timestamp, nonce, signature)) {
            throw new IllegalArgumentException("非法请求，可能属于伪造的请求！");
        }

        String out = null;
        if (encType == null) {
            // 明文传输的消息
            WxMpXmlMessage inMessage = WxMpXmlMessage.fromXml(requestBody);
            WxMpXmlOutMessage outMessage = this.route(inMessage, wxMpProperties.getConfigs().get(0).getAppId());
            if (outMessage == null) {
                return "";
            }

            out = outMessage.toXml();
        } else if ("aes".equalsIgnoreCase(encType)) {
            // aes加密的消息
            WxMpXmlMessage inMessage = WxMpXmlMessage.fromEncryptedXml(requestBody, wxService.getWxMpConfigStorage(),
                timestamp, nonce, msgSignature);
            log.debug("\n消息解密后内容为：\n{} ", inMessage.toString());
            WxMpXmlOutMessage outMessage = this.route(inMessage, wxMpProperties.getConfigs().get(0).getAppId());
            if (outMessage == null) {
                return "";
            }

            out = outMessage.toEncryptedXml(wxService.getWxMpConfigStorage());
        }

        log.debug("\n组装回复信息：{}", out);
        return out;
    }

    private WxMpXmlOutMessage route(WxMpXmlMessage message, String appid) {
        try {
            return WxMpConfiguration.getRouters().get(appid).route(message);
        } catch (Exception e) {
            log.error("路由消息时出现异常！", e);
        }

        return null;
    }
    
    /**
     * 
     * @param weChatVo
     */
    @PostMapping(path="/getJssdk")
    public Result<JSONObject> getJssdk(@RequestBody WeChatVo weChatVo) {
    	log.info("获取微信公众号jssdk信息,APPID:{}", wxMpProperties.getConfigs().get(0).getAppId());
    	Result<JSONObject> result = new Result<JSONObject>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
    	try {
    		long timestamp = System.currentTimeMillis() / 1000;
    	    String nonceStr = RandomUtils.getRandomStr();
    	    String jsapiTicket = WxMpConfiguration.getMpServices().get(wxMpProperties.getConfigs().get(0).getAppId()).getJsapiTicket(false);
    	    String signature = SHA1.genWithAmple("jsapi_ticket=" + jsapiTicket, "noncestr=" + nonceStr, "timestamp=" + timestamp, "url=" + weChatVo.getUrl());
    	    JSONObject json = new JSONObject();
    	    json.put("timestamp", timestamp);
    	    json.put("nonceStr", nonceStr);
    	    json.put("jsapiTicket", jsapiTicket);
    	    json.put("signature", signature);
            json.put("appId", wxMpProperties.getConfigs().get(0).getAppId());
    	    result.setData(json);
		} catch (WxErrorException e) {
			log.error("获取微信公众号jssdk相关信息异常", e);
			result.setCode(ResponseEnum.SYS_FAILD.getCode());
			result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
		}
        return result;
    }
    
    /**
     * 通过code获取用户openId并生成token
     * @param code  微信token
     * @param state 微信state
     */
    @GetMapping(path="/getToken")
    public Result<JSONObject> getToken(@RequestParam(name = "code") String code, @RequestParam(name = "state") String state) {
    	log.info("通过微信公众号code获取openid信息,code:{}, state:{}", code, state);
    	Result<JSONObject> result = new Result<JSONObject>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
    	try {
    		WxMpService mpService = WxMpConfiguration.getMpServices().get(wxMpProperties.getConfigs().get(0).getAppId());
    	    WxMpOAuth2AccessToken accessToken = mpService.oauth2getAccessToken(code);
            log.info("accesstoken: {}, openId：{}", accessToken.getAccessToken(), accessToken.getOpenId());
            //生成接口请求token
    	    Authentication authentication = authenticationManager.authenticate(new WxAuthenticationToken(accessToken.getOpenId(), accessToken.getAccessToken()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Customer customer = customerService.getCustomerByOpenId(accessToken.getOpenId());
            //生成token
            String token = jwtUtils.generateWeChatToken(accessToken.getOpenId());
            log.info("====>生成用户token:{}", token);
            if(customer != null) {
                log.info(""+StringUtils.isEmpty(customer.getFace())+state);
                if(StringUtils.isEmpty(customer.getFace()) && state.equals("person")){
                    WxMpUser user = mpService.oauth2getUserInfo(accessToken, null);
                    customer.setWxName(user.getNickname());
                    customer.setFace(user.getHeadImgUrl());
                    customerService.update(customer);
                }
            	JSONObject json = new JSONObject();
            	json.put("token", token);
        	    json.put("wxName", customer.getWxName());
        	    json.put("mobile", customer.getMobile());
                json.put("face",customer.getFace());
        	    json.put("status", customer.getStatus());
        	    result.setData(json);
            }
		} catch (WxErrorException e) {
			log.error("通过code获取openId信息异常", e);
			result.setCode(ResponseEnum.SYS_AUTHORIZED_FAIL.getCode());
			result.setMessages(ResponseEnum.SYS_AUTHORIZED_FAIL.getDesc());
		} catch (Exception e1) {
            log.error("未查询到微信用户信息", e1);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }
}
