package com.macxen.service;

import com.github.pagehelper.PageHelper;
import com.macxen.dao.CustomerDao;
import com.macxen.dao.OrderInfoDao;
import com.macxen.domain.Customer;
import com.macxen.domain.OrderInfo;
import com.macxen.mgmt.client.ParkingStrategyClientService;
import com.macxen.service.userDetails.CustomerUserDetails;
import com.macxen.utils.ChConstant;
import com.macxen.vo.OrderVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tk.mybatis.mapper.entity.Example;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Transactional
@Service
public class OrderInfoService {
    @Autowired
    private OrderInfoDao orderInfoDao;
    @Autowired
    private CustomerDao customerDao;

    /**
     * 生成订单
     * @return
     */
    public OrderInfo save(OrderVO order){
        CustomerUserDetails userDetails = (CustomerUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setAmount(order.getAmount());
        Customer customer = customerDao.selectByPrimaryKey(userDetails.getId());
        orderInfo.setCustomerId(userDetails.getId());
        orderInfo.setStatus(ChConstant.OrderStatus.计费中.name());
        orderInfoDao.insert(orderInfo);
        return orderInfo;
    }

    /**
     * 更新订单信息
     * @param orderInfo
     * @return
     */
    public OrderInfo update(OrderInfo orderInfo){
    	orderInfoDao.updateByPrimaryKey(orderInfo);
        return orderInfo;
    }

    /**
     * 查询用户订单
     * @param orderVO
     * @return
     */
    public List<OrderInfo> findByCustomer(OrderVO orderVO){
        PageHelper.offsetPage(orderVO.getPageNum(),orderVO.getPageSize());
//        return orderInfoDao.findByCustomerId(orderVO.getCustomerId());
        Example example = new Example(OrderInfo.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("customerId",orderVO.getCustomerId());
        if(!StringUtils.isEmpty(orderVO.getStatus())){
            criteria.andEqualTo("status", orderVO.getStatus());
        }
        example.orderBy("id").desc();
        return orderInfoDao.selectByExample(example);
    }

    /**
     * 查询用户待支付订单不分页
     * @param customerId
     * @return
     */
    public List<OrderInfo> findByCustomer(Long customerId){
        List<OrderInfo> orderInfoList = orderInfoDao.findByCustomer(customerId);
        return orderInfoList;
    }

    /**
     * 根据用户和车牌号查询待支付订单不分页
     * @param customerId
     * @param carNo
     * @return
     */
    public List<OrderInfo> findByCustomer(Long customerId, String carNo){
        Example example = new Example(OrderInfo.class);
        List<String> list=new ArrayList<String>();
        list.add(ChConstant.OrderStatus.待支付.name());
        list.add(ChConstant.OrderStatus.计费中.name());
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("customerId",customerId);
        criteria.andEqualTo("carNo",carNo);
        criteria.andIn("status", list);
        example.orderBy("id").desc();
        return orderInfoDao.selectByExample(example);
    }

    /**
     * 查询单个订单
     * @param id
     * @return
     */
    public OrderInfo findById(Long id){
        return orderInfoDao.selectByPrimaryKey(id);
    }

    /**
     * 根据流水查询订单
     * @param orderNo 订单流水号
     * @return
     */
    public OrderInfo findByOrderNo(String orderNo){
        return orderInfoDao.findByOrderNo(orderNo);
    }
}
