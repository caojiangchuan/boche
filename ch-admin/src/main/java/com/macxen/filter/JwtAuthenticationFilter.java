package com.macxen.filter;

import com.macxen.config.sercurity.WxAuthenticationToken;
import com.macxen.service.userDetails.CustomerUserDetailsServiceImpl;
import com.macxen.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * 过滤器验证客户端Token
 * 通过JwtAuthenticationFilter作为处理用户登录Token的Filter
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
//@Component
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    @Autowired
    private CustomerUserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtUtils jwtUtils;
    @Value("${token.header}")
    private String tokenHeader;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        //获取token
        String token = httpServletRequest.getHeader(tokenHeader);
        //验证token
        if (StringUtils.hasText(token)) {
            String username = jwtUtils.getUsernameFromToken(token);
            String openId = jwtUtils.getOpenIdFromToken(token);
            if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = null;
                try {
                    userDetails = userDetailsService.loadUserByUsername(username);
                }catch (UsernameNotFoundException e){
                	
                }
                //验证用户
                if (jwtUtils.isTokenValid(token, userDetails)) {
                    if(null != openId){
                        WxAuthenticationToken weChatAuthenticationToken = new WxAuthenticationToken(openId,null);
                        weChatAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                        SecurityContextHolder.getContext().setAuthentication(weChatAuthenticationToken);
                    }else{
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                        log.info("authenticated user " + username + ", setting security context");
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}