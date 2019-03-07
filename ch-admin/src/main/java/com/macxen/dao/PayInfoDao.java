package com.macxen.dao;

import com.macxen.config.MyMapper;
import com.macxen.domain.PayInfo;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface PayInfoDao  extends MyMapper<PayInfo>{

    @Select("select * from pay_info where trade_no=#{tradeNo}")
    PayInfo findByTradeNo(String tradeNo);

    List<PayInfo> findAll(Map<String, Object> map);

}