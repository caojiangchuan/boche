package com.macxen.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 阿里云短信配置 properties
 *
 * @author Alan
 */
@Data
@ConfigurationProperties(prefix = "aliyun")
public class SmsProperties {
  /**
   * appid
   */
  private String accessKeyID;

  /**
   * 密钥
   */
  private String accessKeySecret;

  /**
   * 密钥
   */
  private String signName;

  /**
   * 模板ID
   */
  private String templateCode;
  /**
   * 产品名称
   */
  private String product;
  /**
   * 产品域名
   */
  private String domain;
}
