package com.macxen.domain;

import lombok.Data;

/**
 * 车辆信息
 * Created by Alan Fu on 2018/10/1.
 */
@Data
public class Car extends AbstractAuditingEntity {

    private static final long serialVersionUID = -1034751647703679299L;
    /**
     * 关联用户
     */
    private Long customerId;
    /**
     * 车牌号
     */
    private String carNo;

    /**
     * 品牌
     */
    private String brand;

    /**
     * 颜色
     */
    private String color;

    /**
     * 型号
     */
    private String type;

    /**
     * 状态
     */
    private String status;

    /**
     * 是否默认支付车辆（0是，1否）
     */
    private String isDefault;

    /**
     * 图片信息
     */
    private String pic;

    /**
     * 是否新能源（0是，1否）
     */
    private String energyCar;

    /**
     * 车架号
     */
    private String vin;

    /**
     * 所有人
     */
    private String owner;

    /**
     * 联系电话
     */
    private String tel;

    /**
     * 全景图
     */
    private String image;
}
