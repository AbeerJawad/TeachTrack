package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getPassword_hash().equals(request.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    if (!user.getRole().equalsIgnoreCase(request.getRole())) {
        throw new RuntimeException("Role mismatch");
    }

    String token = "logged-in-as-" + user.getRole();

    return new LoginResponse(token, user.getUser_id(), user);
}
}