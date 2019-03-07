package com.macxen.wx.handler;

import com.macxen.domain.Customer;
import com.macxen.service.CustomerService;
import com.macxen.utils.ChConstant;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;

/**
 * 取消关注
 */
@Transactional
@Service
public class UnsubscribeHandler extends AbstractHandler {
	
	@Autowired
    private CustomerService customerService;
	
    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMessage,
                                    Map<String, Object> context, WxMpService wxMpService,
                                    WxSessionManager sessionManager) {
        String openId = wxMessage.getFromUser();
        this.logger.info("取消关注用户 OPENID: " + openId);
        //更新本地数据库为取消关注状态
        Customer customer = customerService.getCustomerByOpenId(openId);
        if(customer != null) {
        	customer.setStatus(ChConstant.CustomerStatus.注销.name());
        	customer.setLastModifiedDate(new Date());
        	customerService.update(customer);
        }
        return null;
    }

}
