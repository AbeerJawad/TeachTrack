package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserSignupRequest;
import com.example.demo.model.*;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody UserSignupRequest request) {
        // Debugging: Log received dtype
        System.out.println("Received dtype: " + request.getDtype());

        // Convert date string to LocalDate
        LocalDate dob;
        try {
            dob = LocalDate.parse(request.getDateOfBirth());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format! Use YYYY-MM-DD."));
        }

        // Determine user role
        User user;
        switch (request.getDtype().toUpperCase()) {
            case "STUDENT":
                user = new Student();
                break;
            case "FACULTY":
                user = new Faculty();
                break;
            case "ADMIN":
                user = new Admin();
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid dtype: " + request.getDtype()));
        }

        // Set common fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setDateOfBirth(dob);
        user.setPasswordHash(request.getPassword());

        // Save user
        String response = userService.registerUser(user);
        if (response.equals("User registered successfully!")) {
            return ResponseEntity.ok(Map.of("message", response));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", response));
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Debug 1: Log incoming request
    System.out.println("\n=== LOGIN REQUEST RECEIVED ===");
    System.out.println("Email: " + request.getEmail());
    System.out.println("Password: " + "[PROTECTED]"); // Don't log actual passwords in production
    
    Map<String, String> authData = authService.authenticate(request);
    
    // Debug 2: Log authentication result
    if (authData != null) {
        System.out.println("=== AUTHENTICATION SUCCESS ===");
        System.out.println("User Type: " + authData.get("dtype"));
        System.out.println("Full Name: " + authData.get("fullName"));
        
        // Log role-specific ID if present
        if (authData.containsKey("facultyId")) {
            System.out.println("Faculty ID: " + authData.get("facultyId"));
        } else if (authData.containsKey("studentId")) {
            System.out.println("Student ID: " + authData.get("studentId"));
        } else if (authData.containsKey("adminId")) {
            System.out.println("Admin ID: " + authData.get("adminId"));
        }
        
        return ResponseEntity.ok(authData);
    } else {
        System.out.println("=== AUTHENTICATION FAILED ===");
        System.out.println("Reason: Invalid credentials for email: " + request.getEmail());
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
}
