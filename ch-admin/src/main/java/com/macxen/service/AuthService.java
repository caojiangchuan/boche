package com.macxen.service;

import org.springframework.mobile.device.Device;

import com.macxen.utils.Result;
import com.macxen.vo.LoginForm;

/**
 * Created by Alan Fu on 2018/1/6.
 */
public interface AuthService {

    /**
     *
     * @param loginForm
     * @param device
     * @return
     */
    Result<String> createToken(LoginForm loginForm, Device device);

    public String createToken(String username, String password);
}
