package com.macxen.wx.handler;

import com.macxen.config.sercurity.WxAuthenticationToken;
import com.macxen.domain.Customer;
import com.macxen.service.CustomerService;
import com.macxen.service.userDetails.CustomerUserDetailsServiceImpl;
import com.macxen.utils.ChConstant;
import com.macxen.utils.JwtUtils;
import com.macxen.wx.builder.TextBuilder;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;

/**
 * 关注公众号处理
 */
@Transactional
@Service
public class SubscribeHandler extends AbstractHandler {
	
	@Autowired
    private CustomerService customerService;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private CustomerUserDetailsServiceImpl userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMessage,
                                    Map<String, Object> context, WxMpService weixinService,
                                    WxSessionManager sessionManager) throws WxErrorException {

        this.logger.info("新关注用户 OPENID: {}", wxMessage.getFromUser());

        // 获取微信用户基本信息
        try {
        	WxMpUser userWxInfo = weixinService.getUserService().userInfo(wxMessage.getFromUser(), null);
            if (userWxInfo != null) {
                //判断用户是否曾经关注过该公众号
                Customer cs = customerService.getCustomerByOpenId(userWxInfo.getOpenId());
                if(cs != null){
                    cs.setStatus(ChConstant.CustomerStatus.关注.name());
                    cs.setLastModifiedDate(new Date());
                    customerService.update(cs);
                }else{
                    //添加关注用户到本地数据库
                    Customer customer = new Customer();
                    customer.setOpenId(userWxInfo.getOpenId());
                    customer.setStatus(ChConstant.CustomerStatus.关注.name());
                    customer.setWxName(userWxInfo.getNickname());
                    customer.setSource(ChConstant.RegisterType.微信.name());
                    customerService.save(customer);
                }
            }
            Authentication authentication = authenticationManager.authenticate(new WxAuthenticationToken(userWxInfo.getOpenId(), weixinService.getAccessToken()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userWxInfo.getOpenId());
            String token = jwtUtils.generateWeChatToken(userWxInfo.getOpenId());
            
        } catch (WxErrorException e) {
            if (e.getError().getErrorCode() == 48001) {
                this.logger.info("该公众号没有获取用户信息权限！");
            }
        }


        WxMpXmlOutMessage responseResult = null;
        try {
            responseResult = this.handleSpecial(wxMessage);
        } catch (Exception e) {
            this.logger.error(e.getMessage(), e);
        }

        if (responseResult != null) {
            return responseResult;
        }

        try {
            return new TextBuilder().build("感谢关注呈享智慧泊车", wxMessage, weixinService);
        } catch (Exception e) {
            this.logger.error(e.getMessage(), e);
        }

        return null;
    }

    /**
     * 处理特殊请求，比如如果是扫码进来的，可以做相应处理
     */
    private WxMpXmlOutMessage handleSpecial(WxMpXmlMessage wxMessage)
        throws Exception {
        //TODO
        return null;
    }

}
