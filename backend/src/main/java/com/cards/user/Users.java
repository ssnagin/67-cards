package com.cards.user;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 100)
    private String username;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Instant createdAt;

    public Users(String email, String username, String passwordHash, Role role) {
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    /**
     * Меняет почту учётной записи.
     * Отдельный метод вместо сеттера, чтобы смена email шла только через сервис с проверкой уникальности.
     */
    public void changeEmail(String email) {
        this.email = email;
    }

    /**
     * Меняет хеш пароля. Хеширование выполняет сервис, сущность хранит только готовый хеш.
     */
    public void changePasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
