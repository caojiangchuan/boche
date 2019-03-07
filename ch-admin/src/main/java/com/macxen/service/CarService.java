package com.macxen.service;

import com.macxen.dao.CarDao;
import com.macxen.dao.CustomerDao;
import com.macxen.domain.Car;
import com.macxen.domain.OrderInfo;
import com.macxen.vo.CarVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tk.mybatis.mapper.entity.Example;

import java.util.List;

/**
 * 车辆
 * Created by Alan Fu on 2018/10/6.
 */
@Slf4j
@Transactional
@Service
public class CarService {
    @Autowired
    private CarDao carDao;
    @Autowired
    private CustomerDao customerDao;
    
    /**
     * 添加车辆
     * @return
     */
    public int save(Car car){
        //如果用户当前新增车辆为默认车辆，需将原有默认车辆变为否
        if(!StringUtils.isEmpty(car.getIsDefault()) && car.getIsDefault().equals("0")){
            carDao.updateByCustomer(car.getCustomerId());
        }
        return carDao.insert(car);
    }

    /**
     * 更新车辆信息
     * @param car
     * @return
     */
    public int update(Car car){
        //如果用户当前新增车辆为默认车辆，需将原有默认车辆变为否
        if(!StringUtils.isEmpty(car.getIsDefault()) && car.getIsDefault().equals("0")){
            carDao.updateByCustomer(car.getCustomerId());
        }
        return carDao.updateByPrimaryKey(car);
    }

    /**
     * 根据用户id查询车辆
     * @param customerId
     * @return
     */
    public List<Car> findByCustomerId(Long customerId){
        return carDao.findByCustomerId(customerId);
    }

    /**
     * 根据用户查询车辆信息
     * @param vo
     * @return
     */
    public List<Car> findByCustomerId(CarVo vo){
        Example example = new Example(Car.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("customerId", vo.getCustomerId());

        if(!StringUtils.isEmpty(vo.getCarNo())){
            criteria.andEqualTo("carNo", vo.getCarNo());
        }

        if(!StringUtils.isEmpty(vo.getIsDefault())){
            criteria.andEqualTo("isDefault", vo.getIsDefault());
        }
        criteria.andEqualTo("status", "0");
        example.orderBy("id").desc();
        return carDao.selectByExample(example);
    }

    /**
     * 根据id查询车辆
     * @param id
     * @return
     */
    public Car findById(Long id){
        return carDao.selectByPrimaryKey(id);
    }

}
