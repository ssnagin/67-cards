package com.cards.content.card;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ContentBlock {
    private String type;          // "text", "image", "table", ...
    private String content;       // для text
    private String fileId;        // для image/file (GridFS ObjectId или S3 key)
    private String url;           // альтернатива fileId
    private Object data;          // для table и прочих структур
}
