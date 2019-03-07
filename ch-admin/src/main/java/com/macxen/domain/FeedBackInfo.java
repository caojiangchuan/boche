package com.macxen.domain;

import lombok.Data;

/**
 * 意见反馈信息
 * Created by Alan Fu on 2018/10/1.
 */
@Data
public class FeedBackInfo extends AbstractAuditingEntity {

    private static final long serialVersionUID = -5567926990869790249L;
	
	/**
     * 关联用户
     */
    private Long customerId;
    
    /**
     * 意见信息
     */
    private String content;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 图片信息
     */
    private String pic;

}
