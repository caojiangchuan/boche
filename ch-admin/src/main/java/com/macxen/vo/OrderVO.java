package com.macxen.vo;

import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

/**
 * 订单VO信息
 * Created by Alan Fu on 2018/1/18.
 */
@Data
@ToString
public class OrderVO{

    private static final long serialVersionUID = -745297708564472598L;
    /**
     * 关联用户
     */
    private Long customerId;
    /**
     * 车牌号
     */
    private String carNo;
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
     * 当前页
     */
    private Integer pageNum;

    /**
     * 每页显示数量
     */
    private Integer pageSize;
}
