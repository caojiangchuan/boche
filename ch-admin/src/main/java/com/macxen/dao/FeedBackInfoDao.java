package com.macxen.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Select;

import com.macxen.config.MyMapper;
import com.macxen.domain.FeedBackInfo;


/**
 * Created by Alan Fu on 2018/9/21.
 */
public interface FeedBackInfoDao extends MyMapper<FeedBackInfo>{

    @Select("select * from feed_back_info where customer_id=#{customerId}")
    List<FeedBackInfo> findByCustomerId(Long customerId);
    
    List<FeedBackInfo> findAll(Map<String, Object> map);
}
