package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ownerNotifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerNotifcations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificationID")
    private Integer id; // Changed to lowercase

    @Column(name = "ownerID", nullable = false)
    private Integer ownerID;

    @Column(name = "subject", length = 30)
    private String subject;

    @Column(name = "sentDate", nullable = false)
    private LocalDate sentDate;

    @Column(name = "propertyName", nullable = false, length = 50) // Changed to lowercase
    private String propertyName; // Changed to lowercase

    @Column(name = "tenantUserName", nullable = false, length = 30)
    private String tenantUserName;

    @Column(name = "content", nullable = false, length = 255)
    private String content; // Changed to lowercase
}