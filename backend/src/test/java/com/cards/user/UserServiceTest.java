package com.cards.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cards.content.card.CardRepository;
import com.cards.content.deck.DeckRepository;
import com.cards.dto.user.UpdateProfileRequest;

/**
 * Проверки обновления профиля без запуска БД.
 * Пустые строки должны означать "поле не передано", а не затирать данные.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DeckRepository deckRepository;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void blankEmailAndPasswordAreIgnored() {
        Users user = user("user@example.com", "old-hash");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(1L, new UpdateProfileRequest("   ", "  "));

        assertEquals("user@example.com", user.getEmail());
        assertEquals("old-hash", user.getPasswordHash());
        verify(userRepository, never()).existsByEmail(anyString());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void validEmailIsChangedAfterUniquenessCheck() {
        Users user = user("old@example.com", "hash");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(1L, new UpdateProfileRequest("new@example.com", null));

        assertEquals("new@example.com", user.getEmail());
        verify(userRepository).existsByEmail("new@example.com");
    }

    @Test
    void duplicateEmailIsRejected() {
        Users user = user("old@example.com", "hash");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfile(1L, new UpdateProfileRequest("taken@example.com", null)));

        assertEquals("old@example.com", user.getEmail());
        verify(userRepository, never()).save(any());
    }

    @Test
    void passwordIsHashedBeforeSaving() {
        Users user = user("user@example.com", "old-hash");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("password123")).thenReturn("new-hash");
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(1L, new UpdateProfileRequest(null, "password123"));

        assertEquals("new-hash", user.getPasswordHash());
    }

    private static Users user(String email, String passwordHash) {
        // После появления username в модели конструктор требует и его.
        return new Users(email, "testuser", passwordHash, Role.USER);
    }
}
