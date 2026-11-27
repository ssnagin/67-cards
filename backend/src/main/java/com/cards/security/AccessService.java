package com.cards.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.cards.content.deck.Deck;
import com.cards.content.deck.DeckRepository;
import com.cards.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccessService {
    private final DeckRepository deckRepository;

    public Deck getDeckOrThrow(String deckId) {
        return deckRepository.findById(deckId)
            .orElseThrow(() -> new NotFoundException("Колода не найдена: " + deckId));
    }

    public Deck getDeckForRead(String deckId, Long userId) {
        Deck deck = getDeckOrThrow(deckId);
        if (!deck.isPublic() && !deck.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Нет доступа к колоде");
        }
        return deck;
    }

    public Deck getDeckForWrite(String deckId, Long userId) {
        Deck deck = getDeckOrThrow(deckId);
        if (!deck.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Только владелец может изменять колоду");
        }
        return deck;
    }
}
