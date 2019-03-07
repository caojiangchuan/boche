package com.macxen.vo;

import lombok.Data;

/**
 * 车辆信息
 * Created by Alan Fu on 2018/10/1.
 */
@Data
public class CarVo {

    private static final long serialVersionUID = -745297708564472598L;

    private Long id;
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
     * 是否默认支付车辆
     */
    private String isDefault;

    /**
     * 图片信息
     */
    private String pic;

    /**
     * 是否新能源
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
