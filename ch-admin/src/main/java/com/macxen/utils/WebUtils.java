package com.macxen.utils;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.util.Date;
import java.util.UUID;

/**
 * get client ip address
 * @author fuhongxing
 */
public abstract class WebUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebUtils.class);

    //private
    private WebUtils() {

    }

    private static ThreadLocal<String> ipThreadLocal = new ThreadLocal<>();
    
    public static void setIp(String ip) {
        ipThreadLocal.set(ip);
    }

    public static String getIp() {
        return ipThreadLocal.get();
    }

    /**
     * Retrieve client ip address
     *
     * @param request HttpServletRequest
     * @return IP
     */
    public static String retrieveClientIp(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (isUnAvailableIp(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (isUnAvailableIp(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (isUnAvailableIp(ip)) {
            ip = request.getRemoteAddr();
        }
        setIp(ip);
        return ip;
    }

    /**
     * 获取本地ip地址
     * @author wulinjie
     * @return
     */
    public static String getLocalIpAddress() {
        String ip = null;
        try {
            ip = InetAddress.getLocalHost().getHostAddress();
        } catch (Exception e) {
            throw new RuntimeException("获取本地ip地址错误!");
        }
        return ip;
    }

    private static boolean isUnAvailableIp(String ip) {
        return StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip);
    }
    
    /**
     * 判断ajax请求
     * @param request
     * @return
     */
    public static boolean isAjax(HttpServletRequest request){
        return  (request.getHeader("X-Requested-With") != null  && "XMLHttpRequest".equals( request.getHeader("X-Requested-With").toString())) ;
    }

    /**
     * generate batch number
     * @return
     */
    public static String generateBatchNumber(){
        return "CH" + DateUtils.dateToString(new Date(), "yyyyMMddHHmmss") + (int)(Math.random() * 1000000);
    }

    /**
     * generate UUID
     * @return
     */
    public static String generateUUID(){
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}