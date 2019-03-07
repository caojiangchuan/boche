package com.macxen.vo;

import com.macxen.domain.AbstractAuditingEntity;

import lombok.Data;

/**
 * 客户vo
 * Created by Alan Fu on 2017/12/31.
 */
@Data
public class CustomerVO extends AbstractAuditingEntity{

    private static final long serialVersionUID = 1055782582264741885L;
    private String name;//客户真实名称
    private String idCard;//身份证
    private Long bank;//银行卡号
    private String wxAccount;//微信账号
    private String wxName;//微信名称
    private String openId;//微信用户唯一标识openId
    private String password;//新密码
    private String oldPassword;//旧密码
    private String verifyCode;//验证码
}
