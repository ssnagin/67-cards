package com.cards.content.deck;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "decks")
@Getter
@Setter
@NoArgsConstructor
public class Deck {
    @Id
    private String id;              // Mongo ObjectId как строка
    @Indexed
    private Long ownerId;           // ← users.id из Postgres
    private String title;
    private String description;
    private boolean isPublic;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * Jackson по умолчанию назвал бы свойство "public"; контракт API использует "isPublic".
     * Lombok не генерирует дубль, потому что геттер уже объявлен.
     */
    @JsonProperty("isPublic")
    public boolean isPublic() {
        return isPublic;
    }
}
