package com.macxen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.macxen.config.WxMpConfiguration;
import com.macxen.config.sercurity.WxAuthenticationToken;
import com.macxen.service.userDetails.CustomerUserDetailsServiceImpl;
import com.macxen.utils.JwtUtils;

import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.result.WxMpOAuth2AccessToken;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

/**
 * 回调、重定向
 */
@Slf4j
@Controller
@RequestMapping("/wx/redirect/{appid}")
public class WxRedirectController {
	@Value("${token.domainName}")
	private String domainName;
	@Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private CustomerUserDetailsServiceImpl userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
	
    @RequestMapping("/greet")
    public String greetUser(@PathVariable String appid, @RequestParam String code, @RequestParam String state, ModelMap map) {
    	log.info("重定向请求参数：code=" + code + ", state=" + state);
        WxMpService mpService = WxMpConfiguration.getMpServices().get(appid);
        try {
            WxMpOAuth2AccessToken accessToken = mpService.oauth2getAccessToken(code);
            log.info("accesstoken: {}, openId：{}", accessToken.getAccessToken(), accessToken.getOpenId());
            WxMpUser user = mpService.oauth2getUserInfo(accessToken, null);
            //生成接口请求token
            Authentication authentication = authenticationManager.authenticate(new WxAuthenticationToken(accessToken.getOpenId(), accessToken.getAccessToken()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = userDetailsService.loadUserByUsername(accessToken.getOpenId());
            String token = jwtUtils.generateWeChatToken(accessToken.getOpenId());
            log.info("openId：{}, token:{}", accessToken.getOpenId(), token);
            map.put("user", user);
            map.put("token", token);
        } catch (WxErrorException e) {
            log.error("微信重定向请求异常{}", state, e);
        }

        return "redirect:" + domainName + state;
    }
}
