package com.macxen.utils;

/**
 * 公共变量
 * Created by fuhongxing on 2018/1/11.
 */
public class ChConstant {

    /**
     * 用户状态
     */
    public enum CustomerStatus {
        关注, 注册, 认证, 注销
    }

    public enum RegisterType {
        APP,微信
    }

    /**
     * 订单状态
     */
    public enum OrderStatus {
        计费中, 待支付, 已支付
    }

    /**
     * 短信模板类型
     */
    public enum MsgType {
        register, reset, other
    }
    
    /**
     * 文件组别类型
     */
    public enum FileGroup {
        wx, feedBack, other
    }
    /**
     * ALIYUN
     */
    public enum ALIYUN {
        OK, FAIL
    }
    
    public static final String DEFAULT_ERROR_MESSAGE = "系统忙，请稍后再试";

    public static final String DEFAULT_STATUS = "0";
    public static final String Y = "Y";
    public static final String N = "N";
    public static final String USER_FILE_GROUP = "users";
}