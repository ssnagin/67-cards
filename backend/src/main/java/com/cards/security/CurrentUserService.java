package com.cards.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import com.cards.exception.NotFoundException;
import com.cards.user.UserRepository;
import com.cards.user.Users;

import lombok.RequiredArgsConstructor;

/**
 * Определяет текущего пользователя по JWT.
 * В токене есть стабильный uid; email в subject используется только как резерв
 * для токенов, выданных до появления uid.
 */
@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    public Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotFoundException("Пользователь не найден");
        }
        // После смены email subject устаревает, а uid остаётся прежним.
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            Object userId = jwtAuthentication.getToken().getClaim("uid");
            if (userId instanceof Number number) {
                return userRepository.findById(number.longValue())
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден: " + number));
            }
        }
        return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new NotFoundException("Пользователь не найден: " + authentication.getName()));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
