package com.macxen.vo;

import com.macxen.common.request.in.FileInfo;
import com.macxen.common.request.in.merge.FileField;
import lombok.Data;

/**
 * 意见反馈信息
 * Created by Alan Fu on 2018/10/1.
 */
@Data
public class FeedBackInfoVO {

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

    @FileField(fileName = "pic", orgName = "", updateTime = "")
    private FileInfo pic;
}
