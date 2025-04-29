package com.example.demo.dto;

import com.example.demo.model.User;

public class LoginResponse {
    private String token;
    private Long userId;
    private User user;

    public LoginResponse(String token, Long userId, User user) {
        this.token = token;
        this.userId = userId;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public User getUser() {
        return user;
    }
}
