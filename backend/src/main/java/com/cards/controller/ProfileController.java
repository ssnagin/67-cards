package com.cards.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cards.dto.user.ProfileResponse;
import com.cards.dto.user.UpdateProfileRequest;
import com.cards.security.CurrentUserService;
import com.cards.user.UserService;
import com.cards.user.Users;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public ProfileResponse me() {
        return toResponse(userService.getById(currentUserService.getCurrentUserId()));
    }

    @PatchMapping("/me")
    public ProfileResponse update(@Valid @RequestBody UpdateProfileRequest request) {
        Users updated = userService.updateProfile(currentUserService.getCurrentUserId(), request);
        return toResponse(updated);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> delete() {
        userService.deleteAccount(currentUserService.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    private ProfileResponse toResponse(Users user) {
        return new ProfileResponse(user.getId(), user.getEmail(), user.getRole().name());
    }
}
