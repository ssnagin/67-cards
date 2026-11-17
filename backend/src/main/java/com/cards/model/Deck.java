package com.cards.model;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "decks")
public class Deck {
    @Id
    private String id;              // Mongo ObjectId как строка
    private Long ownerId;           // ← users.id из Postgres
    private String title;
    private String description;
    private boolean isPublic;
    private Instant createdAt;
}