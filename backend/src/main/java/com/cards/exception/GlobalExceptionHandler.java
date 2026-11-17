package com.cards.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.core.AuthenticationException;

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
  
  public record ErrorResponse(String message) {}
}
