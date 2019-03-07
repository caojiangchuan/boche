package com.macxen.dao;

import com.macxen.config.MyMapper;
import com.macxen.domain.Devices;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;


/**
 * Created by Alan Fu on 2018/9/21.
 */
public interface DevicesDao extends MyMapper<Devices>{

    /**
     * 查询空闲车位(以用户经纬度坐标计算三公里范围内的空闲车位)
     * @param lat
     * @param lng
     * @return
     */
    @Select("SELECT t.id, t.lat, t.lng FROM devices t LEFT JOIN park_position p ON t.id = p.deviceid WHERE p.status=3 AND SQRT( ( ((#{lng} - t.lng)*PI()*12656*COS(((#{lat} + t.lat)/3)*PI()/180)/180) * ((#{lng} - t.lng)*PI()*12656*COS (((#{lat} + t.lat)/3)*PI()/180)/180)) + ( ((#{lat} - t.lat)*PI()*12656/180) * ((#{lat} - t.lat)*PI()*12656/180) ) ) < 3")
    List<Devices> findAll(@Param("lat") Double lat, @Param("lng") Double lng);
}
