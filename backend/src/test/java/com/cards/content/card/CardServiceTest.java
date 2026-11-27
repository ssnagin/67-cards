package com.cards.content.card;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import com.cards.exception.NotFoundException;
import com.cards.security.AccessService;

/**
 * Проверки базового сценария обновления карточки без запуска MongoDB.
 */
@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private AccessService accessService;

    @InjectMocks
    private CardService cardService;

    @Test
    void updateReplacesSidesAndKeepsServerIdentity() {
        Card existing = card("deck-1", "card-1");
        when(cardRepository.findById("card-1")).thenReturn(Optional.of(existing));
        when(cardRepository.save(existing)).thenReturn(existing);

        Card changes = new Card();
        // Клиент не должен уметь переписать id и deckId через тело запроса.
        changes.setId("card-from-request");
        changes.setDeckId("deck-from-request");
        changes.setFront(side("Новый вопрос"));
        changes.setBack(side("Новый ответ"));

        Card updated = cardService.update("deck-1", "card-1", 42L, changes);

        assertSame(existing, updated);
        assertEquals("card-1", updated.getId());
        assertEquals("deck-1", updated.getDeckId());
        assertEquals("Новый вопрос", updated.getFront().getBlocks().get(0).getContent());
        assertEquals("Новый ответ", updated.getBack().getBlocks().get(0).getContent());
        verify(accessService).getDeckForWrite("deck-1", 42L);
        verify(cardRepository).save(existing);
    }

    @Test
    void updateRejectsCardFromAnotherDeck() {
        when(cardRepository.findById("card-1")).thenReturn(Optional.of(card("deck-2", "card-1")));

        assertThrows(NotFoundException.class,
            () -> cardService.update("deck-1", "card-1", 42L, new Card()));

        verify(cardRepository, never()).save(any());
    }

    @Test
    void updateStopsWhenUserCannotWriteDeck() {
        doThrow(new AccessDeniedException("Только владелец может изменять колоду"))
            .when(accessService).getDeckForWrite("deck-1", 42L);

        assertThrows(AccessDeniedException.class,
            () -> cardService.update("deck-1", "card-1", 42L, new Card()));

        verifyNoInteractions(cardRepository);
    }

    private static Card card(String deckId, String id) {
        Card card = new Card();
        card.setId(id);
        card.setDeckId(deckId);
        card.setFront(side("Вопрос"));
        card.setBack(side("Ответ"));
        return card;
    }

    private static CardSide side(String text) {
        ContentBlock block = new ContentBlock();
        block.setType("text");
        block.setContent(text);

        CardSide side = new CardSide();
        side.setBlocks(List.of(block));
        return side;
    }
}
