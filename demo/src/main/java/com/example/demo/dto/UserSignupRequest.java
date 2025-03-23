package com.example.demo.dto;

public class UserSignupRequest {
    private String username;
    private String email;
    private String fullName;
    private String password;
    private String confirmPassword;
    private String dateOfBirth;
    private String dtype; 

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getDtype() { return dtype; } // Changed method name
    public void setDtype(String dtype) { this.dtype = dtype; } // Changed method name
}
