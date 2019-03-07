package com.macxen.vo;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class MessageVO {
    private String mobile;
    private String type;
    private String code;
}
