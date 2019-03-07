package com.macxen.domain;

import lombok.Data;

/**
 * 订单付款信息
 * Created by Alan Fu on 2018/10/10.
 */
@Data
public class PayInfo extends AbstractAuditingEntity {

    /**
     * 订单id
     */
    private Long orderId;
    /**
     * 微信请求参数
     */
    private String req;
    /**
     * 微信响应结果
     */
    private String res;
    /**
     * 微信通知
     */
    private String payResultNotify;
    /**
     * 订单状态
     */
    private String status;
    /**
     * 交易流水号
     */
    private String tradeNo;


}