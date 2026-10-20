package org.ssnagin.modules.test;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssnagin.modules.test.resources.TestResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class TestController {

    private static final Logger log =
        LoggerFactory.getLogger(TestController.class);

    @RequestMapping("/")
    public String requestMethodName() {
        log.debug("test 12345");
        return "Test 1234";
    }

    @GetMapping("/Test")
    public TestResource getMethodName(@RequestParam(defaultValue = "testDefaultSolution") String param) {
        return new TestResource(123, "param", "param2");
    }
}
