package com.macxen.dao;

import com.macxen.config.MyMapper;
import com.macxen.domain.Car;
import org.apache.ibatis.annotations.Select;

import java.util.List;


/**
 * Created by Alan Fu on 2018/9/21.
 */
public interface CarDao extends MyMapper<Car>{

    @Select("select * from car where customer_id=#{customerId} and status=0 order by id desc")
    List<Car> findByCustomerId(Long customerId);

    @Select("update car set is_default = 1 where customer_id=#{customerId} and status=0")
    List<Car> updateByCustomer(Long customerId);
}
