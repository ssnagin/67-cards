package com.cards.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * В проекте два хранилища: Postgres для пользователей и Mongo для колод и карточек.
 * Явно разводим репозитории по пакетам, чтобы Spring Data не угадывал хранилище по типу.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.cards.user")
@EnableMongoRepositories(basePackages = "com.cards.content")
public class RepositoryConfig {
}
