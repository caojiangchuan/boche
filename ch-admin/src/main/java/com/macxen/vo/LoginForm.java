package com.macxen.vo;

import lombok.Data;

@Data
public class LoginForm {
    private String username;
    private String password;
    private String client;//后台管理 ADMIN
}
