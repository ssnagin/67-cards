package com.cards.content.deck;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeckRepository extends MongoRepository<Deck, String> {
    Page<Deck> findByOwnerId(Long ownerId, Pageable pageable);
    List<Deck> findByOwnerId(Long ownerId);
    List<Deck> findByOwnerIdAndIsPublicTrue(Long ownerId);
    boolean existsByIdAndOwnerId(String id, Long ownerId);
}