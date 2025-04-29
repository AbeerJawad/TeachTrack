package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);

            System.out.println("Login successful for user: " + request.getUsername());
            System.out.println("Generated Token: " + response.getToken());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Login failed for user: " + request.getUsername());
            System.out.println("Reason: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", e.getMessage()));
        }
    }
}
