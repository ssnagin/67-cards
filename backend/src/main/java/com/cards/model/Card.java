import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cards")
public class Card {
    @Id
    private String id;
    private String deckId;
    private CardSide front;
    private CardSide back;
    // ...
}


