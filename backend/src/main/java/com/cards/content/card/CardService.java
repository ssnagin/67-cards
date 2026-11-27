package com.cards.content.card;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cards.exception.NotFoundException;
import com.cards.security.AccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final AccessService accessService;

    public Card create(String deckId, Long userId, Card card) {
        accessService.getDeckForWrite(deckId, userId);
        // id назначается Mongo, а не клиентом
        card.setId(null);
        card.setDeckId(deckId);
        return cardRepository.save(card);
    }

    public List<Card> list(String deckId, Long userId) {
        accessService.getDeckForRead(deckId, userId);
        return cardRepository.findByDeckId(deckId);
    }

    public Card get(String deckId, String cardId, Long userId) {
        accessService.getDeckForRead(deckId, userId);
        return getOwnedCard(deckId, cardId);
    }

    public Card update(String deckId, String cardId, Long userId, Card changes) {
        accessService.getDeckForWrite(deckId, userId);
        Card card = getOwnedCard(deckId, cardId);
        card.setFront(changes.getFront());
        card.setBack(changes.getBack());
        return cardRepository.save(card);
    }

    public void delete(String deckId, String cardId, Long userId) {
        accessService.getDeckForWrite(deckId, userId);
        cardRepository.delete(getOwnedCard(deckId, cardId));
    }

    /**
     * Карточка должна существовать и принадлежать указанной колоде.
     */
    private Card getOwnedCard(String deckId, String cardId) {
        return cardRepository.findById(cardId)
            .filter(card -> deckId.equals(card.getDeckId()))
            .orElseThrow(() -> new NotFoundException("Карточка не найдена: " + cardId));
    }
}
