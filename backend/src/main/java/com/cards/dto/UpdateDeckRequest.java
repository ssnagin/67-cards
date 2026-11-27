package com.cards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateDeckRequest(
  @NotBlank
  @Size(max = 200)
  String title,

  @Size(max = 2000)
  String description,

  boolean isPublic
) {}
