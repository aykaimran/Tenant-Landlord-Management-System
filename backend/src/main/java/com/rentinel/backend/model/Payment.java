package com.rentinel.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paymentID")
    private int paymentID;

    @Column(name = "paymentStatus", length = 20)
    private String paymentStatus;

    @Column(name = "paymentDate")
    private LocalDate paymentDate; // Use a String for simplicity (you can change to LocalDate or Date later)

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "propertyID", nullable = false)
    private int propertyID; // Reference to Property (Foreign Key)

    @Column(name = "tenantUserName", length = 50)
    private String tenantUserName; // Reference to Tenant (Foreign Key)

    @Column(name = "ownerUserName", length = 50)
    private String ownerUserName; // Reference to Owner (Foreign Key)

    // No need to specify @ManyToOne or @OneToMany in this simple version.
    // We are just leaving the foreign key relationships as plain String comments.
}
