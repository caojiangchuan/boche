package com.macxen.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.macxen.config.SmsProperties;
import com.macxen.dao.CustomerDao;
import com.macxen.domain.Customer;
import com.macxen.service.userDetails.CustomerUserDetails;
import com.macxen.utils.ChConstant;
import com.macxen.utils.JwtUtils;
import com.macxen.utils.ResponseEnum;
import com.macxen.utils.Result;
import com.macxen.vo.MessageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Transactional
@EnableConfigurationProperties(SmsProperties.class)
@Service
public class CustomerService {

    @Autowired
    private CustomerDao customerDao;
    @Autowired
    public PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;
    @Value("${token.header}")
    private String tokenHeader;
    @Autowired
    private SmsProperties smsProperties;
    /**
     * 注册
     * @param customer
     * @return
     */
    public Result<Customer> register(Customer customer){
        Result<Customer> result = new Result<Customer>(Boolean.TRUE, ResponseEnum.SYS_SUCCESS.getCode());
        Customer cs = customerDao.findByMobile(customer.getMobile());
        if(cs == null){
            result.setCode(ResponseEnum.SYS_NOT_FOUND_USER.getCode());
            result.setMessages("未找到客户相关信息");
            return result;
        }
        if(!customer.getMobile().equals(cs.getMobile())){
            result.setCode(ResponseEnum.SYS_AUTHORIZED_FAIL.getCode());
            result.setMessages("注册手机号和当前填写手机不一致");
            return result;
        }
        //验证注册码
        if(!StringUtils.isEmpty(cs.getCode()) && cs.getCode().equals(customer.getCode())){
//            cs.setPassword(passwordEncoder.encode(customer.getPassword()));
            cs.setStatus(ChConstant.CustomerStatus.注册.name());
            customer.setLastModifiedDate(new Date());
            customerDao.updateByPrimaryKey(cs);
            result.setMessages("用户注册成功");
            result.setData(cs);
            log.info("用户注册成功{}", customer.getMobile());
        }else{
            result.setCode(ResponseEnum.SYS_MESSAGE_EXPIRED.getCode());
            result.setMessages("验证码错误");
            log.info("验证码错误，当前手机号：{}，已发送验证码：{}，当前输入验证码：{}", customer.getMobile(), cs.getCode(), customer.getCode());
        }
        return result;
    }
    
    /**
     * 短信发送
     * @param messageVo
     * @param customer
     * @return
     */
    public Boolean sendMessage(MessageVO messageVo, Customer customer) throws ClientException{
        boolean falg = true;
        SendSmsResponse sendSmsResponse = this.sendSms(messageVo);
        if(!StringUtils.isEmpty(sendSmsResponse.getCode()) && ChConstant.ALIYUN.OK.name().equals(sendSmsResponse.getCode())){
            //保存验证码到数据库
            customer.setCode(messageVo.getCode());
            customer.setMobile(messageVo.getMobile());
            customer.setVerifyCodeDate(new Date());
            this.update(customer);
        }else{
            falg = false;
        }
        return falg;
    }

    public SendSmsResponse sendSms(MessageVO messageVo) throws ClientException {
        log.info("=========阿里云短信发送，手机号码：{},验证码：{}=======",messageVo.getMobile(), messageVo.getCode());
        //可自助调整超时时间
        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
        System.setProperty("sun.net.client.defaultReadTimeout", "10000");

        //初始化acsClient,暂不支持region化
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", smsProperties.getAccessKeyID(), smsProperties.getAccessKeySecret());
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", smsProperties.getProduct(), smsProperties.getDomain());
        IAcsClient acsClient = new DefaultAcsClient(profile);

        //组装请求对象-具体描述见控制台-文档部分内容
        SendSmsRequest request = new SendSmsRequest();
        //必填:待发送手机号
        request.setPhoneNumbers(messageVo.getMobile());
        //必填:短信签名-可在短信控制台中找到
        request.setSignName(smsProperties.getSignName());
        //必填:短信模板-可在短信控制台中找到
        request.setTemplateCode(smsProperties.getTemplateCode());
        //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
        JSONObject json = new JSONObject();
        json.put("code", messageVo.getCode());
        request.setTemplateParam(json.toJSONString());

        //选填-上行短信扩展码(无特殊需求用户请忽略此字段)
        //request.setSmsUpExtendCode("90997");

        //可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
        request.setOutId("ch1");

        //hint 此处可能会抛出异常，注意catch
        SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);
        log.info("阿里云短信发送响应结果:{}", JSON.toJSONString(sendSmsResponse));
        return sendSmsResponse;
    }

    public int save(Customer customer){
    	return customerDao.insert(customer);
    }

    public int update(Customer customer){
        return customerDao.updateByPrimaryKey(customer);
    }

    public Customer getCustomer(String mobile){
        Customer customer = customerDao.findByMobile(mobile);
        return customer;
    }

    public Customer getById(Long id){
        Customer customer = customerDao.selectByPrimaryKey(id);
        return customer;
    }

    public Customer getCustomerByOpenId(String openId){
        Customer customer = customerDao.findByOpenId(openId);
        return customer;
    }
    
    /**
     * 返回当前客户信息
     * @return
     */
    public Customer getCurrentCustomer(){
        Customer customer = null;
        try {
            CustomerUserDetails userDetails = (CustomerUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            customer = userDetails;
        } catch (Exception e) {
            log.error("security get user exception", e);
        }
        return customer;
    }

    /**
     * 根据openid返回当前客户信息
     * @return
     */
    public Customer getCurrentCustomer(HttpServletRequest request){
        String token = request.getHeader(tokenHeader);
        String openId = jwtUtils.getUsernameFromToken(token);
        Customer customer = customerDao.findByOpenId(openId);
        return customer;
    }


    public String passwordEncode(String password){
        return passwordEncoder.encode(password);
    }
    

}
