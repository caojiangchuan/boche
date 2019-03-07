package com.macxen.domain;

import lombok.Data;

/**
 * 设备信息
 * Created by Alan Fu on 2018/10/21.
 */
@Data
public class Devices {

	private Integer id;
	private String deviceno;// 设备编号
	private String devicemodel;// 设备型号
	private String manufacturer;// 厂商
	private Integer assetstatus;// 资产状态
	private String deviceid;// 设备id
	private Integer price;// 采购单价
	private Integer upkeepcost;// 维修费用
	private String sosnum;// sos号码
	private Integer leftcamera;// 左摄像头
	private Integer rightcamera;// 右摄像头
	private Integer fm;// FM
	private Integer bluetooth;// 蓝牙
	private Integer wifi;// WIFI
	private Integer address;// 地址信息
	private Integer crisiscomm;// 应急通信
	private Integer callpatrol;// 呼叫巡查
	
	private Integer parkid;
	private Integer parkareaid;
	/**
	 * 纬度
	 */
	private Double lat;
	/**
	 * 经度
	 */
	private Double lng;
}
