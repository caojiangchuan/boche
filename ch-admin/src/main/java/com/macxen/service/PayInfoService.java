package com.macxen.service;

import com.macxen.dao.CarDao;
import com.macxen.dao.CustomerDao;
import com.macxen.dao.PayInfoDao;
import com.macxen.domain.Car;
import com.macxen.domain.PayInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alan Fu on 2018/10/6.
 */
@Slf4j
@Transactional
@Service
public class PayInfoService {
    @Autowired
    private PayInfoDao payInfoDao;

    /**
     * 添加付款信息
     * @param payInfo
     * @return
     */
    public int save(PayInfo payInfo){
        return payInfoDao.insert(payInfo);
    }

    /**
     * 更新付款信息
     * @param payInfo
     * @return
     */
    public int update(PayInfo payInfo){
        return payInfoDao.updateByPrimaryKey(payInfo);
    }

    /**
     * 根据交易流水查询
     * @param orderNo
     * @return
     */
    public PayInfo findByTradeNo(String orderNo){
        return payInfoDao.findByTradeNo(orderNo);
    }

    /**
     * 根据id查询车辆
     * @param id
     * @return
     */
    public PayInfo findById(Long id){
        return payInfoDao.selectByPrimaryKey(id);
    }

}
