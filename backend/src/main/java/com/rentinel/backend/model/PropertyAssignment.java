package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "propertyAssignment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignmentID") // matches SQL column name
    private Integer assignmentID;

    @Column(name = "propertyID", nullable = false)
    private Integer propertyID; // ID of the property being assigned

    @Column(name = "ownerID", nullable = false)
    private Integer ownerID; // Name of the owner of the property

    @Column(name = "tenantID", nullable = false)
    private Integer tenantID; // Name of the tenant assigned to the property

    @Column(name = "assignmentDate", nullable = false)
    private LocalDate assignmentDate; // Date when the property was assigned
}
