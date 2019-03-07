package com.macxen.service.userDetails;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.macxen.dao.CustomerDao;
import com.macxen.domain.Customer;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

/**
 * app登录使用
 * Created by Alan Fu on 2017/12/31.
 */
@Slf4j
@Service
@Transactional
public class CustomerUserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private CustomerDao customerDao;
    
    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        //查询用户
        Customer customer = customerDao.findByMobileOrOpenId(username,username);
        if (customer == null) {
            log.warn("未查询到用户信息{}", username);
            throw new UsernameNotFoundException(String.format("No user found with username '%s'.", username));
        }
        //将用户信息存放spring security中
        CustomerUserDetails userDetails = new CustomerUserDetails();
        BeanUtils.copyProperties(customer, userDetails);
        return userDetails;
    }
}