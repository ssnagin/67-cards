package com.cards.content.deck;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cards.content.card.CardRepository;
import com.cards.dto.CreateDeckRequest;
import com.cards.dto.UpdateDeckRequest;
import com.cards.security.AccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeckService {
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final AccessService accessService;

    public Deck create(Long ownerId, CreateDeckRequest req) {
        Instant now = Instant.now();
        Deck deck = new Deck();
        deck.setOwnerId(ownerId);
        deck.setTitle(req.title());
        deck.setDescription(req.description());
        deck.setPublic(req.isPublic());
        deck.setCreatedAt(now);
        deck.setUpdatedAt(now);
        return deckRepository.save(deck);
    }

    public Page<Deck> listMine(Long ownerId, Pageable pageable) {
        return deckRepository.findByOwnerId(ownerId, pageable);
    }

    public Deck get(String deckId, Long userId) {
        return accessService.getDeckForRead(deckId, userId);
    }

    public Deck update(String deckId, Long userId, UpdateDeckRequest req) {
        Deck deck = accessService.getDeckForWrite(deckId, userId);
        deck.setTitle(req.title());
        deck.setDescription(req.description());
        deck.setPublic(req.isPublic());
        deck.setUpdatedAt(Instant.now());
        return deckRepository.save(deck);
    }

    public void delete(String deckId, Long userId) {
        accessService.getDeckForWrite(deckId, userId);
        cardRepository.deleteByDeckId(deckId);
        deckRepository.deleteById(deckId);
    }
}
