package com.cards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateDeckRequest(
  @NotBlank
  @Size(max = 200)
  String title,

  @Size(max = 2000)
  String description,

  boolean isPublic
) {}
