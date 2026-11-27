package com.cards.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Поля необязательные: обновляется только то, что передано.
 */
public record UpdateProfileRequest(
  @Email
  @Size(max = 254)
  String email,

  @Size(min = 8, max = 72)
  String password
) {}
