package com.cards.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.cards.dto.auth.AuthResponse;
import com.cards.dto.auth.LoginRequest;
import com.cards.dto.auth.LoginResponse;
import com.cards.dto.auth.RegisterRequest;
import com.cards.service.AuthService;

@RestController 
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService){
    this.authService=authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
    AuthResponse  response = authService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
  
  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
    return ResponseEntity.ok(authService.login(request));
  }
  
  
}