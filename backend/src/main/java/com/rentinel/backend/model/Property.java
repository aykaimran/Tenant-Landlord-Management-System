package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Property")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "propertyID")
    private int propertyID;

    @Column(name = "propertyName", length = 50)
    private String propertyName;

    @Column(name = "Area", length = 50, nullable = false)
    private String area;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "fixedRent", nullable = false)
    private double fixedRent;

    @Column(name = "ownerName", length = 50)
    private String ownerName; // References Owner(userName)

    @Column(name = "tenantName", length = 50)
    private String tenantName; // References Tenant(userName)

    @Column(name = "numOfBedRooms")
    private int numOfBedRooms;

    @Column(name = "numOfRooms")
    private int numOfRooms;

    @Column(name = "numOfBaths")
    private int numOfBaths;
}
