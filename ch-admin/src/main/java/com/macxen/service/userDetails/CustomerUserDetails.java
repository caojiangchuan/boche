package com.macxen.service.userDetails;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.macxen.domain.Customer;

/**
 * spring security用户信息存入(后台用户)
 * Created by Alan Fu on 2018/1/6.
 */
public class CustomerUserDetails extends Customer implements UserDetails{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7442692309456432678L;
	
	private Map<String ,Object> transitData = new HashMap<String, Object>();

	public CustomerUserDetails() {
		
	}
	
	public CustomerUserDetails(Long id) {
		super.setId(id);
	}

	/**
	 * 返回分配给用户的角色列表
	 * @return
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return super.getMobile();
	}

	/**
	 * 账户是否未过期
	 * @return
	 */
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	/**
	 * 账户是否未锁定
	 * @return
	 */
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	/**
	 * 密码是否未过期
	 * @return
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	/**
	 * 账户是否激活
	 * @return
	 */
	@Override
	public boolean isEnabled() {
		return true;
	}

	public Map<String, Object> getTransitData() {
		return transitData;
	}

	public void setTransitData(Map<String, Object> transitData) {
		this.transitData = transitData;
	}

 }