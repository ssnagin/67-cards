package com.cards.security;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import com.cards.model.Users;
import com.cards.repository.UserRepository;

@Service
public class CustomUserDetailsService  implements UserDetailsService{

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository){
    this.userRepository = userRepository;
  }

  @Override 
  public UserDetails loadUserByUsername(String email){
    Users user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Пользователь не найден: " + email));
    return org.springframework.security.core.userdetails.User
    .withUsername(user.getEmail())
    .password(user.getPasswordHash())
    .roles(user.getRole().name())
    .build();
  }

  
}
