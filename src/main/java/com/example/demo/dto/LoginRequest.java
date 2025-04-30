package com.example.demo.dto;

public class LoginRequest {
    private String username;
    private String password;
    private String role;
    private String registrationNumber; // used for students

    public LoginRequest() {}

    public LoginRequest(String username, String password, String role, String registrationNumber) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.registrationNumber = registrationNumber;
    }

    // Getters
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
}