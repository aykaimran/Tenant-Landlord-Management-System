package com.rentinel.backend.property;

import com.rentinel.backend.owner.Owner;
import com.rentinel.backend.tenant.Tenant;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity(name = "Property2")
@Table(name = "Property")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int propertyID;

    @Column(length = 50)
    private String propertyName;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fixedRent;

    @ManyToOne
    @JoinColumn(name = "ownerName", referencedColumnName = "userName")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "tenantName", referencedColumnName = "userName")
    private Tenant tenant;

    private int numOfBedRooms;
    private int numOfRooms;
    private int numOfBaths;

    private String area; // ✅ New field added

    public Property() {
    }

    public Property(String propertyName, String location, int rent, Owner owner) {
        this.propertyName = propertyName;
        this.location = location;
        this.fixedRent = BigDecimal.valueOf(rent);
        this.owner = owner;
        this.tenant = null;
        this.numOfBedRooms = 0;
        this.numOfRooms = 0;
        this.numOfBaths = 0;
        this.area = ""; // ✅ Default value
    }

    public Property(String propertyName, String location, BigDecimal fixedRent, Owner owner, Tenant tenant,
            int numOfBedRooms, int numOfRooms, int numOfBaths, String area) {
        this.propertyName = propertyName;
        this.location = location;
        this.fixedRent = fixedRent;
        this.owner = owner;
        this.tenant = tenant;
        this.numOfBedRooms = numOfBedRooms;
        this.numOfRooms = numOfRooms;
        this.numOfBaths = numOfBaths;
        this.area = area; // ✅ Constructor update
    }

    public int getPropertyID() {
        return propertyID;
    }

    public void setPropertyID(int propertyID) {
        this.propertyID = propertyID;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getFixedRent() {
        return fixedRent;
    }

    public void setFixedRent(BigDecimal fixedRent) {
        this.fixedRent = fixedRent;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public int getNumOfBedRooms() {
        return numOfBedRooms;
    }

    public void setNumOfBedRooms(int numOfBedRooms) {
        this.numOfBedRooms = numOfBedRooms;
    }

    public int getNumOfRooms() {
        return numOfRooms;
    }

    public void setNumOfRooms(int numOfRooms) {
        this.numOfRooms = numOfRooms;
    }

    public int getNumOfBaths() {
        return numOfBaths;
    }

    public void setNumOfBaths(int numOfBaths) {
        this.numOfBaths = numOfBaths;
    }

    public String getArea() { // ✅ Getter
        return area;
    }

    public void setArea(String area) { // ✅ Setter
        this.area = area;
    }

    @Override
    public String toString() {
        return "Property{" +
                "propertyID=" + propertyID +
                ", propertyName='" + propertyName + '\'' +
                ", location='" + location + '\'' +
                ", fixedRent=" + fixedRent +
                ", owner=" + (owner != null ? owner.getUserName() : "null") +
                ", tenant=" + (tenant != null ? tenant.getUserName() : "null") +
                ", numOfBedRooms=" + numOfBedRooms +
                ", numOfRooms=" + numOfRooms +
                ", numOfBaths=" + numOfBaths +
                ", area=" + area + // ✅ toString update
                '}';
    }
}
