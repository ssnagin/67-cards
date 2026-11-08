package com.cards;

import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;

@SpringBootApplication
public class App {
  public static void main(String[] args){
    SpringApplication.run(App.class, args);
  }
  @Value("${spring.datasource.url}")
    private String url;
    @Value("${spring.datasource.username}")
    private String user;
    @Value("${spring.datasource.password}")
    private String pass;

    @PostConstruct
    void print() {
        System.out.println(">>> DB URL  = " + url);
        System.out.println(">>> DB USER = " + user);
        System.out.println(">>> DB PASS = [" + pass + "] length=" + pass.length());
    }
}