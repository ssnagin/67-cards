package org.ssnagin.modules.test;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class TestController {
    
    @RequestMapping("/")
    public String requestMethodName() {
        return "Test 1234";
    }


}
