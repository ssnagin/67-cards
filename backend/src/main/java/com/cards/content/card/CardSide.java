package com.cards.content.card;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CardSide {
    private List<ContentBlock> blocks;
}
