package com.rentinel.backend.model;

public class LoginResponse {
    private boolean success;
    private String userType;
    private Integer userId;
    private String message;

    public LoginResponse(boolean success, String userType, Integer userId, String message) {
        this.success = success;
        this.userType = userType;
        this.userId = userId;
        this.message = message;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getUserType() {
        return userType;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }
}