package com.cards.controller;

import com.cards.dto.auth.UserResponse;
import com.cards.security.CurrentUserService;
import com.cards.user.Users;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final CurrentUserService currentUserService;

  public UserController(CurrentUserService currentUserService) {
    this.currentUserService = currentUserService;
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me() {
    // Идентичность берётся из проверенного Spring Security токена (claim uid),
    // а не из запроса: CurrentUserService сам достаёт пользователя по uid.
    Users user = currentUserService.getCurrentUser();
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()));
  }
}
