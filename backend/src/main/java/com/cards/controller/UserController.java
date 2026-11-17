package com.cards.controller;

import com.cards.dto.auth.UserResponse;
import com.cards.service.AuthService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final AuthService authService;

  public UserController(AuthService authService) {
    this.authService = authService;
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(Authentication authentication) {
    // Имя берётся из проверенного Spring Security токена, а не из запроса.

    return ResponseEntity.ok().cacheControl(CacheControl.noStore())
        .body(authService.getCurrentUser(authentication.getName()));
  }
}
