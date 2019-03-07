package com.macxen.utils;

import lombok.Data;

import java.io.Serializable;

/**
 * 分页工具类
 * Created by Alan Fu on 2018/10/6.
 */
@Data
public class PageUtil implements Serializable {
	private static final long serialVersionUID = 9021540362771448413L;
	/**当前页*/
	private int pageNum;
	/**每页显示数量*/
	private int pageSize;

	private String order = "desc";
	private String sort;

}
