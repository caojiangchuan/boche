package com.macxen.domain;

import lombok.Data;

import javax.persistence.Transient;
import java.util.Date;

/**
 * 客户基本信息
 * Created by Alan Fu on 2018/9/21.
 */
@Data
public class Customer extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1055782582264741885L;
    /**
     * 客户真实名称、后台登录名称
     */
    private String name;
    /**
     * 昵称（预留）
     */
    @Transient
    private String nickname;
    /**
     * 身份证
     */
    private String idCard;
    /**
     * 手机号
     */
    private String mobile;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 登录密码
     */
    private String password;
    
    /**
     * 用户状态
     */
    private String status;
    /**
     * 短信验证码
     */
    private String code;
    /**
     * 验证码生成时间
     */
    private Date verifyCodeDate;
    /**
     * 来源(手机APP、微信)
     */
    private String source;
    /**
     * 微信账号
     */
    private String wxAccount;
    /**
     * 微信名称
     */
    private String wxName;
    /**
     * 微信用户唯一标识openId
     */
    private String openId;
    
    /**
     * 微信头像
     */
    private String face;


}
