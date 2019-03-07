package com.macxen.config.sercurity;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

public class WxAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            WxAuthenticationToken token = (WxAuthenticationToken) authentication;
            token.getAccessToken();
            token.getOpenId();
            //验证 accessToken 有效性

        return token;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (WxAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
