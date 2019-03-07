package com.macxen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mobile.device.Device;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.macxen.service.userDetails.CustomerUserDetails;
import com.macxen.service.userDetails.CustomerUserDetailsServiceImpl;
import com.macxen.utils.JwtUtils;
import com.macxen.utils.ResponseEnum;
import com.macxen.utils.Result;
import com.macxen.vo.LoginForm;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

/**
 * token 认证生成
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Service
public class AuthServiceImpl implements AuthService{

    @Value("${token.header}")
    private String tokenHeader;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private CustomerUserDetailsServiceImpl userDetailsService;

    /**
     *
     * @param loginForm
     * @param device
     * @return
     */
    @Override
    public Result<String> createToken(LoginForm loginForm, @NonNull Device device) {
        String username = loginForm.getUsername();
        String password = loginForm.getPassword();
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = null;
        userDetails = userDetailsService.loadUserByUsername(username);

        String token = jwtUtils.generateToken(userDetails, device);
        log.info("用户认证username:{}  token:{}",username, token);
        Result<String> result = new Result<>(Boolean.TRUE);
        result.setCode(ResponseEnum.SYS_SUCCESS.getCode());
        if (token == null) {
            result.setCode(ResponseEnum.SYS_UNAUTHORIZED.getCode());
            result.setSuccess(Boolean.FALSE);
            result.setMessages("用户登录认证失败");
        }else {
            result.setData(token);
            result.setMessages("登录成功");
        }

        return result;
    }

    @Override
    public String createToken(@NonNull String username, @NonNull String password) {
        /*Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);*/
        /*Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);*/
        UserDetails userDetails = (CustomerUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = jwtUtils.generateToken(userDetails);
        log.info("用户认证username:{}  token:{}",username, token);
        return token;
    }
}
