package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Owner")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id; // Changed to lowercase

    @Column(name = "fullName", nullable = false, length = 50)
    private String fullName;

    @Column(name = "userName", nullable = false, unique = true, length = 50)
    private String userName;

    @Column(name = "Password", nullable = false, length = 30) // Changed to lowercase
    private String password; // Changed to lowercase

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "CNIC", nullable = false, length = 13)
    private String cnic; // Changed to lowercase

    @Column(name = "accountCreationDate", nullable = false)
    private LocalDate accountCreationDate;
}