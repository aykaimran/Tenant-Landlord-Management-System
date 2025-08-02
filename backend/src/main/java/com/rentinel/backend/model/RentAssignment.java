package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "rentAssignment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignmentID")
    private Integer assignmentID;

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "dueDate", nullable = false)
    private LocalDate dueDate;

    @Column(name = "propertyID", nullable = false)
    private Integer propertyID;

    @Column(name = "tenantID", nullable = false)
    private Integer tenantID;
}
