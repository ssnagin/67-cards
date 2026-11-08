package com.cards.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cards.dto.auth.AuthResponse;
import com.cards.dto.auth.LoginRequest;
import com.cards.dto.auth.LoginResponse;
import com.cards.dto.auth.RegisterRequest;
import com.cards.model.Role;
import com.cards.model.Users;
import com.cards.repository.UserRepository;


@Service 
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,AuthenticationManager authenticationManager, JwtService jwtService){
    this.userRepository = userRepository;
    this.passwordEncoder=passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @Transactional 
  public AuthResponse register(RegisterRequest request){
    if (userRepository.existsByEmail(request.email())){
      throw new IllegalArgumentException("Этот адресс уже зарегистрирован");
    }
    String passwordHash = passwordEncoder.encode(request.password());

    Users user = new Users(request.email(), passwordHash, Role.USER);
    Users savedUser = userRepository.save(user);

    return new AuthResponse(savedUser.getId(),savedUser.getEmail(),savedUser.getRole().name());
  }

  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request){
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    String token = jwtService.generateAccessToken(userDetails);
    return new LoginResponse(token,"Bearer");
  }
}
