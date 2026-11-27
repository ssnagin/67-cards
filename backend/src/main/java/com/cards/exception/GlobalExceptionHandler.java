package com.cards.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler (IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(
    IllegalArgumentException exception
  ){
    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(exception.getMessage()));
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException exception){
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Неправильный логин или пароль"));
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException exception){
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(exception.getMessage()));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException exception){
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception){
    String message = exception.getBindingResult().getFieldErrors().stream()
      .findFirst()
      .map(error -> error.getField() + ": " + error.getDefaultMessage())
      .orElse("Неправильные данные запроса");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(message));
  }

  public record ErrorResponse(String message) {}
}
