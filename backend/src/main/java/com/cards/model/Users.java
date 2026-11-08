package com.cards.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table
public class Users {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable= false, unique = true)
  private String email;

  @Column(name = "password_hash", nullable=true)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  protected Users(){

  }

  public Users(String email, String passwordHash, Role role){
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  @PrePersist
  protected  void onCreate(){
    createdAt = Instant.now();
  }

public Long getId() {
  return id;
}
public String getEmail() {
  return email;
}
public String getPasswordHash() {
  return passwordHash;
}
public Role getRole() {
  return role;
}
public Instant getCreatedAt() {
  return createdAt;
}


}
