package com.macxen.user.client;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.macxen.common.srv.out.SrvResult;

@FeignClient(value = "userService", name = "userService")
public interface OrderClientService {
	@RequestMapping(value = "/srv/parking/calulate", method = RequestMethod.GET)
	public SrvResult<?> calculateParkingFee(@RequestParam(value = "orderNo") String orderNo);
}
