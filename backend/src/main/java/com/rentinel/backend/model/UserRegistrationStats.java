package com.rentinel.backend.model;

public class UserRegistrationStats {
    private String month;
    private Integer userCount;

    // Constructor
    public UserRegistrationStats(String month, Integer userCount) {
        this.month = month;
        this.userCount = userCount;
    }

    // Getters and setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }
}