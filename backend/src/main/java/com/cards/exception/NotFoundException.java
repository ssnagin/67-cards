package com.cards.exception;

/**
 * Сущность не найдена. Преобразуется в ответ 404 в GlobalExceptionHandler.
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
