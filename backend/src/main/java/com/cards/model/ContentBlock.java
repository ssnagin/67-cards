package com.cards.model;



public class ContentBlock {
    private String type;          // "text", "image", "table", ...
    private String content;       // для text
    private String fileId;        // для image/file (GridFS ObjectId или S3 key)
    private String url;           // альтернатива fileId
    private Object data;          // для table и прочих структур
}