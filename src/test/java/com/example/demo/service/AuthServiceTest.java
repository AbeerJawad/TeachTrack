package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;
    
    private User testUser;
    private LoginRequest validRequest;

    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = new User();
        testUser.setUser_id(1L);
        testUser.setUsername("testuser");
        testUser.setPassword_hash("password123");
        testUser.setRole("STUDENT");
        
        // Set up valid login request
        validRequest = new LoginRequest();
        validRequest.setUsername("testuser");
        validRequest.setPassword("password123");
        validRequest.setRole("STUDENT");
    }

    @Test
    void login_WithValidCredentials_ReturnsLoginResponse() {
        // Arrange
        when(userRepository.findByUsername(validRequest.getUsername())).thenReturn(Optional.of(testUser));
        
        // Act
        LoginResponse response = authService.login(validRequest);
        
        // Assert
        assertNotNull(response);
        assertEquals("logged-in-as-STUDENT", response.getToken());
        assertEquals(testUser.getUser_id(), response.getUserId());
        assertEquals(testUser, response.getUser());
    }
    
    @Test
    void login_WithNonExistentUser_ThrowsRuntimeException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password123");
        request.setRole("STUDENT");
        
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("User not found", exception.getMessage());
    }
    
    @Test
    void login_WithInvalidPassword_ThrowsRuntimeException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");
        request.setRole("STUDENT");
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("Invalid password", exception.getMessage());
    }
    
    @Test
    void login_WithInvalidRole_ThrowsRuntimeException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setRole("ADMIN"); // Different role than the user's actual role
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("Role mismatch", exception.getMessage());
    }
    
    
    @Test
    void login_WithEmptyUsername_ReturnsEmptyOptional() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("");
        request.setPassword("password123");
        request.setRole("STUDENT");
        
        when(userRepository.findByUsername("")).thenReturn(Optional.empty());
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("User not found", exception.getMessage());
    }
}