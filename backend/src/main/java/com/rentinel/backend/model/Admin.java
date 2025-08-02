package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
// import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "fullName", nullable = false, length = 50)
    private String fullName;

    @Column(name = "userName", nullable = false, unique = true, length = 50)
    private String userName;

    @Column(name = "Password", nullable = false, length = 30)
    private String password;

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "CNIC", nullable = false, length = 13)
    private String cnic;

    @Column(name = "accountCreationDate", nullable = false)
    private LocalDate accountCreationDate;
}