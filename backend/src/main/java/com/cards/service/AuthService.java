package com.cards.service;

import com.cards.dto.auth.LoginRequest;
import com.cards.dto.auth.LoginResponse;
import com.cards.dto.auth.RegisterRequest;
import com.cards.dto.auth.Status;
import com.cards.dto.auth.StatusResponse;
import com.cards.user.Role;
import com.cards.user.UserRepository;
import com.cards.user.Users;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AllArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  @Transactional 
  public StatusResponse register(RegisterRequest request){
    if (userRepository.existsByEmail(request.email())){
      throw new IllegalArgumentException("Этот адрес уже зарегистрирован");
    }
    String passwordHash = passwordEncoder.encode(request.password());

    Users user = new Users(request.email(), request.username().strip(), passwordHash, Role.USER);
    userRepository.save(user);

    return new StatusResponse(Status.OK);
  }

  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request){
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    Users user = userRepository.findByEmail(userDetails.getUsername())
      .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден: " + userDetails.getUsername()));
    String token = jwtService.generateAccessToken(userDetails, user.getId());
    return new LoginResponse(token,"Bearer");
  }
}
