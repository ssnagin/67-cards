package com.cards.content.card;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {
    @Id
    private String id;

    // Индекс нужен для выборки и удаления карточек по колоде.
    @Indexed
    private String deckId;          // ← decks.id из Mongo
    private CardSide front;
    private CardSide back;
}
