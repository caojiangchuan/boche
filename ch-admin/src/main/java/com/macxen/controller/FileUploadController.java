package com.macxen.controller;

import com.alibaba.fastjson.JSONObject;
import com.macxen.file.client.FileClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 图片文件处理
 * @author fhx
 * @date 2018年10月20日
 */
@RestController
public class FileUploadController {

	@Autowired
	private FileClientService fileClientService;


    @PostMapping("/file")
    public JSONObject handleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        String filepath = "";
    	JSONObject result = new JSONObject();
        result.put("path",filepath);
//        fileClientService.switchFileGroup(ChConstant.USER_FILE_GROUP)
        return result;
    }
    
}
