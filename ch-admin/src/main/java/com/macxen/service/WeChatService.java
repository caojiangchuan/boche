package com.macxen.service;

import com.macxen.config.WxMpConfiguration;
import com.macxen.config.WxMpProperties;
import com.macxen.config.WxPayProperties;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.api.WxMpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

/**
 *
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Service
@Configuration
@EnableConfigurationProperties({WxMpProperties.class, WxPayProperties.class})
public class WeChatService {

    @Autowired
    private WxMpProperties wxMpProperties;
    @Autowired
    private WxPayProperties wxPayProperties;

    public WxMpService getWxMpService() {
       return WxMpConfiguration.getMpServices().get(wxMpProperties.getConfigs().get(0).getAppId());
    }

    public WxPayProperties getWxPayProperties() {
        return this.wxPayProperties;
    }
}
