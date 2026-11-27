package com.cards.config;


import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http,JwtAuthenticationConverter jwtAuthenticationConverter, CorsConfigurationSource corsConfigurationSource) throws Exception{
    return http
    .cors(cors -> cors.configurationSource(corsConfigurationSource))
    .csrf(csrf -> csrf.disable())
    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**").permitAll()
    .anyRequest().authenticated()
    )
    .formLogin(formlogin -> formlogin.disable())
    .httpBasic(httpBasic -> httpBasic.disable())
    .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))
    .build();

  }

  /**
   * Список разрешённых источников берётся из app.cors.allowed-origins.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource(
    @Value("${app.cors.allowed-origins:http://localhost:3000}") String allowedOrigins
  ){
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter(){
    JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
    authoritiesConverter.setAuthoritiesClaimName("role");
    authoritiesConverter.setAuthorityPrefix("");
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
    return converter;

  }

}
