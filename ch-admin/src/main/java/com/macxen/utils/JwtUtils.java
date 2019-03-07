package com.macxen.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mobile.device.Device;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 *  生成Token和验证Token
 *  JWT是由三段组成的，分别是header（头）、payload（负载）和signature（签名）：
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Component
public class JwtUtils {

    @Value("${token.secret}")
    private String secret;
    @Value("${token.expiration}")
    private Long expiration;

    /**
     * 根据token获取jwt数据声明信息
     * 数据声明（Claim）其实就是一个Map
     * @param token
     * @return
     */
    private Claims getClaimsFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
            String username = claims.getSubject();
        } catch (Exception e) {
            claims = null;
            log.debug("根据token获取jwt数据声明信息异常");
        }
        return claims;
    }

    /**
     * 根据token获取用户
     * @param token
     * @return
     */
    public String getUsernameFromToken(String token) {
        String username;
        try {
            final Claims claims = getClaimsFromToken(token);
            username = claims.get("username", String.class);
            if(null == username){
                username = claims.get("openId",String.class);
            }
        } catch (Exception e) {
            username = null;
            log.debug("根据token获取用户信息异常");
        }
        return username;
    }

    public String getOpenIdFromToken(String token){
        String openId;
        try {
            final Claims claims = getClaimsFromToken(token);
            openId = claims.get("openId",String.class);
        } catch (Exception e) {
            openId = null;
            log.debug("根据token获取用户信息异常");
        }
        return openId;
    }

    public Date getExpirationDateFromToken(String token) {
        Date expiration;
        try {
            final Claims claims = getClaimsFromToken(token);
            expiration = claims.getExpiration();
        } catch (Exception e) {
            expiration = null;
        }
        return expiration;
    }

    /**
     * 根据token获取设备类型
     * @param token
     * @return
     */
    public String getDeviceFromToken(String token) {
        String device;
        try {
            final Claims claims = getClaimsFromToken(token);
            device = claims.get("device", String.class);
        } catch (Exception e) {
            device = null;
        }
        return device;
    }

    private Date generateCurrentDate() {
        return new Date(System.currentTimeMillis());
    }

    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + expiration * 1000);
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     *
     * @param token
     * @return
     */
    private Boolean ignoreTokenExpiration(String token) {
        String device = getDeviceFromToken(token);
        return (DeviceType.MOBILE.toString().equals(device) || DeviceType.TABLET.toString().equals(device));
    }

    /**
     * 获取请求设备类型
     * @param device
     * @return
     */
    private String generateDevice(Device device) {
        String deviceType = DeviceType.UNKNOWN.name();
        if(device.isNormal()){
            deviceType = DeviceType.NORMAL.name();
        } else if (device.isMobile()){
            deviceType = DeviceType.MOBILE.name();
        } else if(device.isTablet()){
            deviceType = DeviceType.TABLET.name();
        }
        return deviceType;
    }

    /**
     * 生成token
     * @param userDetails
     * @param device
     * @return
     */
    public String generateToken(UserDetails userDetails, Device device) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("device", generateDevice(device));
        return generateClaims(claims);
    }

    /**
     * 生成token
     * @param userDetails
     * @return
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        return generateClaims(claims);
    }
    
    /**
     * 生成微信token
     * @param openId
     * @return
     */
    public String generateWeChatToken(String openId){
        Map<String, Object> claims = new HashMap<>();
        claims.put("openId", openId);
        return generateClaims(claims);
    }

    /**
     * 构建添加JWT参数信息
     * @param claims
     * @return
     */
    public String generateClaims(Map<String, Object> claims) {
        JwtBuilder jwtBuilder = Jwts.builder();
        jwtBuilder.setClaims(claims);
        jwtBuilder.setIssuedAt(generateCurrentDate());
        //设置Token过期时间
        jwtBuilder.setExpiration(generateExpirationDate());
        //签名加密
        jwtBuilder.signWith(SignatureAlgorithm.HS512, secret);
        ////生成JWT
        return jwtBuilder.compact();
    }

    /**
     * 验证token是否有效
     * @param token
     * @param userDetails
     * @return
     */
    public Boolean isTokenValid(String token, UserDetails userDetails) {
        return (
                (!isTokenExpired(token) || ignoreTokenExpiration(token))
        );
    }


}
