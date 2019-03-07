package com.macxen.exceptions;

import org.springframework.security.core.AuthenticationException;


/**
 * token异常定义
 * Created by Alan Fu on 2018/1/6.
 *
 */
public class JwtExpiredTokenException extends AuthenticationException {
    private static final long serialVersionUID = -5959543783324224864L;
    
    private String token;

    public JwtExpiredTokenException(String msg) {
        super(msg);
    }

    public JwtExpiredTokenException(String token, String msg, Throwable t) {
        super(msg, t);
        this.token = token;
    }

    public String token() {
        return this.token;
    }
}