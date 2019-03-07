package com.macxen.service;

import com.macxen.dao.DevicesDao;
import com.macxen.dao.PayInfoDao;
import com.macxen.domain.Devices;
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
public class DeviceService {
    @Autowired
    private DevicesDao devicesDao;

    /**
     * 添加付款信息
     * @param devices
     * @return
     */
    public int save(Devices devices){
        return devicesDao.insert(devices);
    }

    /**
     * 更新付款信息
     * @param devices
     * @return
     */
    public int update(Devices devices){
        return devicesDao.updateByPrimaryKey(devices);
    }

    /**
     * 根据用户id查询车辆
     * @param
     * @return
     */
    public List<Devices> findAll(Devices devices){
        return devicesDao.findAll(devices.getLat(), devices.getLng());
    }

    /**
     * 根据id查询车辆
     * @param id
     * @return
     */
    public Devices findById(Long id){
        return devicesDao.selectByPrimaryKey(id);
    }

}
