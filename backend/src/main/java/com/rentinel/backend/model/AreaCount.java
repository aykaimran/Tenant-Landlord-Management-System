package com.rentinel.backend.model;

public class AreaCount {
    private String area;
    private int count;

    public AreaCount() {}

    public AreaCount(String area, int count) {
        this.area = area;
        this.count = count;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}

