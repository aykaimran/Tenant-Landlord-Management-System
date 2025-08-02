package com.rentinel.backend.model;

public class MonthlyRentStats {
    private String month;
    private Integer totalAmount;

    public MonthlyRentStats(String month, Integer totalAmount) {
        this.month = month;
        this.totalAmount = totalAmount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }
}
