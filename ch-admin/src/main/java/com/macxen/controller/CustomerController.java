package com.macxen.controller;

import com.macxen.domain.Car;
import com.macxen.domain.Customer;
import com.macxen.domain.OrderInfo;
import com.macxen.service.*;
import com.macxen.utils.JwtUtils;
import com.macxen.utils.ResponseEnum;
import com.macxen.utils.Result;
import com.macxen.vo.CarVo;
import com.macxen.vo.FeedBackInfoVO;
import com.macxen.vo.OrderVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mobile.device.Device;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 用户个人中心相关入口
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@RestController
@RequestMapping("customer")
public class CustomerController {

    @Autowired
    private AuthService authService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private OrderInfoService orderInfoService;
    @Autowired
    private CarService carService;
    @Autowired
    private FeedBackInfoService feedBackInfoService;
    @Autowired
    private JwtUtils jwtUtils;
    @Value("${token.header}")
    private String tokenHeader;
    
    /**
     * 车辆管理
     * @param device
     * @return
     */
    @RequestMapping("/myCar")
    public Result<Car> myCar(HttpServletRequest request, Device device){
        log.info("=============车辆管理查询=============");
        Result<Car> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                CarVo vo = new CarVo();
                vo.setCustomerId(customer.getId());
                List<Car> list = carService.findByCustomerId(vo);
                result.setList(list);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("车辆列表信息异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 车辆详细信息
     * @param device
     * @return
     */
    @RequestMapping("/carDetail/{carId}")
    public Result<Car> carDetail(@PathVariable Long carId, HttpServletRequest request, Device device){
        log.info("=============车辆详细信息查询=============");
        Result<Car> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                Car car = carService.findById(carId);
                result.setData(car);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("车辆详细信息查询异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 车辆添加
     * @param device
     * @return
     */
    @RequestMapping(value = "/addCar", method = RequestMethod.POST)
    public Result<Boolean> addCar(@RequestBody Car car, HttpServletRequest request, Device device){
        log.info("=============车辆添加=============");
        Result<Boolean> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                //验证车牌是否绑定
                CarVo vo = new CarVo();
                vo.setCustomerId(customer.getId());
                vo.setCarNo(car.getCarNo());
                List<Car> list = carService.findByCustomerId(vo);
                if(!CollectionUtils.isEmpty(list)){
                    result.setData(CollectionUtils.isEmpty(list) ? false : true);
                    result.setCode(ResponseEnum.SYS_SAVE_FAIL.getCode());
                    result.setMessages(car.getCarNo()+"该车牌号当前已存在绑定信息，请更换车牌号");
                    return result;
                }
                car.setCustomerId(customer.getId());
                car.setStatus("0");
                carService.save(car);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("车辆添加信息异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 车辆修改
     * @param device
     * @return
     */
    @RequestMapping(value = "/updateCar/{carId}")
    public Result<Car> updateCar(@PathVariable Long carId, @RequestBody CarVo carVo, HttpServletRequest request, Device device){
        log.info("=============车辆修改信息查询=============");
        Result<Car> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                Car car = carService.findById(carId);
                BeanUtils.copyProperties(carVo, car);
                car.setCustomerId(customer.getId());
                carService.update(car);
                result.setData(car);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (BeansException e) {
            log.error("车辆信息修改异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 查询是否存在默认车辆
     * @param device
     * @return
     */
    @RequestMapping(value = "/existDefaultCar")
    public Result<Boolean> existDefaultCar(HttpServletRequest request, Device device){
        log.info("=============查询用户是否存在默认车辆=============");
        Result<Boolean> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                CarVo vo = new CarVo();
                vo.setCustomerId(customer.getId());
                vo.setIsDefault("0");
                List<Car> list = carService.findByCustomerId(vo);
                result.setData(CollectionUtils.isEmpty(list) ? false : true);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (BeansException e) {
            log.error("车辆信息修改异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 车辆删除
     * @param carId
     * @return
     */
    @RequestMapping("/removeCar/{carId}")
    public Result<Car> removeCar(@PathVariable Long carId, HttpServletRequest request) {
        log.info("=============车辆删除信息查询=============");
        Result<Car> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                Car car = carService.findById(carId);
                car.setStatus("1");
                carService.update(car);
                result.setData(car);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("车辆解绑信息异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }


    /**
     * 订单管理
     * @param device
     * @return
     */
    @RequestMapping("/myOrder")
    public Result<OrderInfo> myOrder(@RequestBody OrderVO orderVO, HttpServletRequest request, Device device){
        log.info("=============订单管理=============");
        Result<OrderInfo> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                orderVO.setCustomerId(customer.getId());
                List<OrderInfo> list = orderInfoService.findByCustomer(orderVO);
                result.setList(list);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("订单列表信息查询异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 根据车牌号和用户获取用户最新的一笔待支付订单
     * @param device
     * @return
     */
    @RequestMapping("/myLastOrder")
    public Result<OrderInfo> myLastOrder(@RequestBody OrderVO orderVO, HttpServletRequest request, Device device){
        log.info("=============订单管理=============");
        Result<OrderInfo> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                orderVO.setCustomerId(customer.getId());
                List<OrderInfo> list = orderInfoService.findByCustomer(customer.getId(), orderVO.getCarNo());
                result.setData(CollectionUtils.isEmpty(list) ? null : list.get(0));
                result.setList(list);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("订单列表信息查询异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 订单详细信息查询
     * @param device
     * @return
     */
    @RequestMapping("/orderDetail/{orderId}")
    public Result<OrderInfo> myOrder(@PathVariable Long orderId, HttpServletRequest request, Device device){
        log.info("=============订单详细信息查询:{}=============",orderId);
        Result<OrderInfo> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                OrderInfo order = orderInfoService.findById(orderId);
                result.setData(order);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("订单详细信息查询异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

    /**
     * 意见反馈
     * @param device
     * @return
     */
    @RequestMapping("/feedback")
    public Result<String> feedback(@RequestBody FeedBackInfoVO feedBackInfo, HttpServletRequest request, Device device){
    	log.info("=============意见反馈管理=============");
        Result<String> result = null;
        try {
            result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
            Customer cs = customerService.getCurrentCustomer(request);
            if(cs != null){
                feedBackInfo.setCustomerId(cs.getId());
                feedBackInfoService.save(feedBackInfo);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
            log.error("意见反馈异常", e);
        }
        return result;
    }
    
    /**
     * 查询个人信息
     * @param request
     * @return
     */
    @RequestMapping("/getCustomer")
    public Result<Customer> getCustomer(HttpServletRequest request){
    	log.info("=============查询用户个人信息=============");
        Result<Customer> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null) {
//                customer.setPassword("");
                result.setData(customer);
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
            log.error("查询个人信息异常", e);
        }
        return result;
    }
}
