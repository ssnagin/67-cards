package com.cards.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import com.cards.content.deck.Deck;
import com.cards.content.deck.DeckService;
import com.cards.dto.CreateDeckRequest;
import com.cards.dto.UpdateDeckRequest;
import com.cards.security.CurrentUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
public class DeckController {
    private final DeckService deckService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ResponseEntity<Deck> create(@Valid @RequestBody CreateDeckRequest request) {
        Deck deck = deckService.create(currentUserService.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(deck);
    }

    @GetMapping
    public Page<Deck> listMine(Pageable pageable) {
        return deckService.listMine(currentUserService.getCurrentUserId(), pageable);
    }

    @GetMapping("/{deckId}")
    public Deck get(@PathVariable String deckId) {
        return deckService.get(deckId, currentUserService.getCurrentUserId());
    }

    @PutMapping("/{deckId}")
    public Deck update(@PathVariable String deckId, @Valid @RequestBody UpdateDeckRequest request) {
        return deckService.update(deckId, currentUserService.getCurrentUserId(), request);
    }

    @DeleteMapping("/{deckId}")
    public ResponseEntity<Void> delete(@PathVariable String deckId) {
        deckService.delete(deckId, currentUserService.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
