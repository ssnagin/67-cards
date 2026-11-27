package com.cards.user;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cards.content.card.CardRepository;
import com.cards.content.deck.Deck;
import com.cards.content.deck.DeckRepository;
import com.cards.dto.user.UpdateProfileRequest;
import com.cards.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Users getById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Пользователь не найден: " + userId));
    }

    @Transactional
    public Users updateProfile(Long userId, UpdateProfileRequest request) {
        Users user = getById(userId);

        String newEmail = request.email();
        // @Email считает пустую строку корректной, поэтому "не передано" и "пусто" обрабатываем одинаково.
        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Этот адрес уже зарегистрирован");
            }
            user.changeEmail(newEmail);
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.changePasswordHash(passwordEncoder.encode(request.password()));
        }
        return userRepository.save(user);
    }

    /**
     * Удаляет аккаунт и его материалы. Токены устройств при этом не отзываются:
     * хранилище токенов ещё не реализовано.
     */
    @Transactional
    public void deleteAccount(Long userId) {
        Users user = getById(userId);

        List<String> deckIds = deckRepository.findByOwnerId(userId).stream()
            .map(Deck::getId)
            .toList();
        if (!deckIds.isEmpty()) {
            cardRepository.deleteByDeckIdIn(deckIds);
            deckRepository.deleteAllById(deckIds);
        }
        userRepository.delete(user);
    }
}
