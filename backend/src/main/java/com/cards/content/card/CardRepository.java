package com.cards.content.card;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByDeckId(String deckId);
    long countByDeckId(String deckId);
    void deleteByDeckId(String deckId);
    void deleteByDeckIdIn(Collection<String> deckIds);
}
