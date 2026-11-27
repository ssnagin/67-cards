package com.cards.service;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service 
public class JwtService {
  private final JwtEncoder jwtEncoder;
  private final Duration accessTokenTtl;

  public JwtService(JwtEncoder jwtEncoder, @Value("${app.jwt.access-token-ttl:PT15M}") Duration accessTokenTtl){
    this.jwtEncoder = jwtEncoder;
    this.accessTokenTtl = accessTokenTtl;
  }

  public String generateAccessToken(UserDetails userDetails, Long userId){
    Instant now = Instant.now();

    String role = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).findFirst().orElse("ROLE_USER");

    JwtClaimsSet claims = JwtClaimsSet.builder()
    .issuer("cards-api")
    .issuedAt(now)
    .expiresAt(now.plus(accessTokenTtl))
    .subject(userDetails.getUsername())
    .claim("uid", userId)
    .claim("role", role)
    .build();

    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

    return jwtEncoder.encode(JwtEncoderParameters.from(header,claims)).getTokenValue();
  }

}
