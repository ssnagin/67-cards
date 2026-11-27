package com.cards.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cards.content.card.Card;
import com.cards.content.card.CardService;
import com.cards.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/decks/{deckId}/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ResponseEntity<Card> create(@PathVariable String deckId, @RequestBody Card card) {
        Card saved = cardService.create(deckId, currentUserService.getCurrentUserId(), card);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Card> list(@PathVariable String deckId) {
        return cardService.list(deckId, currentUserService.getCurrentUserId());
    }

    @GetMapping("/{cardId}")
    public Card get(@PathVariable String deckId, @PathVariable String cardId) {
        return cardService.get(deckId, cardId, currentUserService.getCurrentUserId());
    }

    @PutMapping("/{cardId}")
    public Card update(@PathVariable String deckId, @PathVariable String cardId, @RequestBody Card changes) {
        return cardService.update(deckId, cardId, currentUserService.getCurrentUserId(), changes);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> delete(@PathVariable String deckId, @PathVariable String cardId) {
        cardService.delete(deckId, cardId, currentUserService.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
