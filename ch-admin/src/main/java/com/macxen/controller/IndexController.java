package com.macxen.controller;

import com.macxen.domain.Customer;
import com.macxen.domain.Devices;
import com.macxen.domain.OrderInfo;
import com.macxen.service.AuthService;
import com.macxen.service.CustomerService;
import com.macxen.service.DeviceService;
import com.macxen.service.OrderInfoService;
import com.macxen.utils.JwtUtils;
import com.macxen.utils.ResponseEnum;
import com.macxen.utils.Result;
import com.macxen.vo.LoginForm;
import com.macxen.vo.MessageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mobile.device.Device;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@RestController
public class IndexController {

    @Autowired
    private AuthService authService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private OrderInfoService orderInfoService;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private JwtUtils jwtUtils;
    @Value("${token.header}")
    private String tokenHeader;
    /**
     * 登陆 json提交
     * @param loginForm
     * @param device
     * @return
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody LoginForm loginForm, Device device){
        log.info("=============customer login:{}=============", loginForm.getUsername());
        Result<String> result = authService.createToken(loginForm, device);
//        UserDetails userDetails = (CustomerUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return result;
    }
    
    /**
     * 我要停车
     * @param devices
     * @return
     */
    @RequestMapping("/park")
    public Result<Devices> park(@RequestBody Devices devices){
    	log.info("=============我要停车=============");
        Result<Devices> result = new Result<Devices>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            List<Devices> list = deviceService.findAll(devices);
            result.setList(list);
        } catch (Exception e) {
            log.error("查询停车位信息异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }
    
    /**
     * 自助结费
     * @param
     * @param device
     * @return
     */
    @RequestMapping("/autoSettlement")
    public Result<OrderInfo> settlement(HttpServletRequest request, Device device){
    	log.info("=============自助结费=============");
        Result<OrderInfo> result = new Result<OrderInfo>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        Customer cs = customerService.getCurrentCustomer(request);
        try {
            if(cs != null){
                List<OrderInfo> list = orderInfoService.findByCustomer(cs.getId());
                result.setList(list);
                //如果只有一个车牌下有待支付订单,查询有几条待支付订单
                if(!CollectionUtils.isEmpty(list) && list.size() ==1){
                    List<OrderInfo> orderInfoList = orderInfoService.findByCustomer(cs.getId(),list.get(0).getCarNo());
                    result.setData(!CollectionUtils.isEmpty(orderInfoList) && list.size() ==1 ? orderInfoList.get(0) : null);
                }
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("自助结费信息查询异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }
    
    /**
     * 登录form提交
     * @param username
     * @param password
     * @param device
     * @return
     */
    @RequestMapping("/form/login")
    public Result<?> formLogin(@RequestParam String username, @RequestParam String password, Device device){
        LoginForm loginForm = new LoginForm();
        loginForm.setPassword(password);
        loginForm.setUsername(username);
        log.info("=============customer login:{}=============", username);
        Result<String> result = authService.createToken(loginForm, device);
//        UserDetails userDetails = (CustomerUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return result;
    }

    /**
     *
     * @param request
     */
    @RequestMapping("/index")
    public String index(HttpServletRequest request){
        log.info("=====logout====");
        return "ch1 success";
    }

    /**
     * 登出
     * @param request
     */
    @RequestMapping("/logout")
    public void logout(HttpServletRequest request){
        log.info("=====logout====");
        //TODO 设置token过期
    }

    /**
     * 用户手机号注册提交
     * @param customer 用户
     * @param device 设备类型
     * @return
     */
    @RequestMapping("/register")
    public Result<?> register(@RequestBody Customer customer, Device device){
        log.info("============用户注册提交:{},请求设备类型===========",device.getDevicePlatform());
        Result<Customer> result = customerService.register(customer);
        return result;
    }
    
    /**
     * 短信发送
     * @param messageVo 手机
     * @param device 设备类型
     * @return
     */
    @RequestMapping("/sendMessage")
    public Result<?> sendMessage(@RequestBody MessageVO messageVo, HttpServletRequest request, Device device){
        Result<String> result = new Result<>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            if(StringUtils.isEmpty(messageVo.getMobile())){
                result.setSuccess(Boolean.FALSE);
                result.setCode(ResponseEnum.SYS_PARAM_ERROR.getCode());
                result.setMessages("电话号码不能为空！");
                return result;
            }

            Customer customer = customerService.getCurrentCustomer(request);
            if(customer != null){
                //调用第三方发送短信
                //随机验证码
                int validateCode = (int) (Math.random() * 9000 + 1000);
                messageVo.setCode(validateCode+"");
                boolean res = customerService.sendMessage(messageVo, customer);
                if(res){
                    result.setMessages("短信发成功");
                    result.setData(validateCode + "");
                }else{
                    result.setMessages("短信发送失败");
                    result.setSuccess(Boolean.FALSE);
                    result.setCode(ResponseEnum.SYS_MESSAGE_FAIL.getCode());
                }
            }else{
                result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
                result.setMessages(ResponseEnum.SYS_NOT_FOUND_USER.getDesc());
            }
        } catch (Exception e) {
            log.error("短信发送异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }
    
    /**
     * 验证手机号是否已注册
     * @param mobile 手机号
     * @return
     */
    @RequestMapping("/verifyMobile/{mobile}")
    public Result<String> verifyMobile(@PathVariable String mobile) {
        Result<String> result = new Result<String>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        try {
            Customer customer = customerService.getCustomer(mobile);
            if (customer != null) {
                result.setCode(ResponseEnum.SYS_EXIST.getCode());
                result.setMessages(ResponseEnum.SYS_EXIST.getDesc());
                log.info("该手机号{}已经注册......", mobile);
            }
        } catch (Exception e) {
            log.error("验证手机号是否已注册异常", e);
            result.setCode(ResponseEnum.SYS_FAILD.getCode());
            result.setMessages(ResponseEnum.SYS_FAILD.getDesc());
        }
        return result;
    }

}
