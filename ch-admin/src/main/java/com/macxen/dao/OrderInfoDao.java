package com.macxen.dao;

import com.macxen.config.MyMapper;
import com.macxen.domain.OrderInfo;
import org.apache.ibatis.annotations.Select;

import java.util.List;


/**
 * Created by Alan Fu on 2018/9/21.
 */
public interface OrderInfoDao extends MyMapper<OrderInfo>{
	
    @Select("select * from order_info where customer_id=#{customerId} order by id desc")
    List<OrderInfo> findByCustomerId(Long customerId);

    @Select("select * from order_info where order_no=#{orderNo}")
    OrderInfo findByOrderNo(String orderNo);

    @Select("SELECT car_no FROM order_info WHERE customer_id = #{customerId} AND STATUS IN ( '待支付' , '计费中' ) GROUP BY car_no")
    List<OrderInfo> findByCustomer(Long customerId);

}