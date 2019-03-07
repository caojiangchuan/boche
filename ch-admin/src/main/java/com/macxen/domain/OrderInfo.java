package com.macxen.domain;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 订单信息
 * Created by Alan Fu on 2018/10/10.
 */
@Data
public class OrderInfo extends AbstractAuditingEntity {

    private static final long serialVersionUID = -745297708564472598L;
    /**
     * 关联用户
     */
    private Long customerId;
    /**
     * 订单编号
     */
    private String OrderNo;
    /**
     * 订单状态
     */
    private String status;
    /**
     * 订单实际交易金额
     */
    private BigDecimal amount;
    /**
     * 停车桩
     */
    private Long deviceId;
    /**
     * 交易类型
     */
    private String type;

    /**
     * 车牌号
     */
    private String carNo;
    /**
     * 停车场
     */
    private String parkName;

    /**
     * 片区编码
     */
    private String parkArea;
    /**
     * 泊车地点
     */
    private String parkPosition;

    /**
     * 泊车编号
     */
    private String parkNo;
    /**
     * 订单支付成功是否推送消息
     */
    private String orderNotify;

    /**
     * 车辆离开是否短信消息推送
     */
    private String orderMsgNotify;

}
