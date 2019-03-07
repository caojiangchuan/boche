package com.macxen.dao;

import com.macxen.config.MyMapper;
import com.macxen.domain.Customer;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * Created by Alan Fu on 2018/9/21.
 */
public interface CustomerDao extends MyMapper<Customer>{

    Customer findByNameOrMobile(String name, String mobile);
    @Select("select * from customer where mobile=#{mobile}")
    Customer findByMobile(String mobile);
    @Select("select * from customer where open_id=#{openId}")
    Customer findByOpenId(String openId);
    
    @Select("select * from customer where mobile=#{mobile} or open_id=#{openId}")
    Customer findByMobileOrOpenId(@Param("mobile") String mobile, @Param("openId")String openId);
    
    List<Customer> findAll(Map<String, Object> map);
    
}
