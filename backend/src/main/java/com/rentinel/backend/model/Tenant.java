package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

@Entity
@Table(name = "Tenant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID") // matches SQL column name
    private int ID;

    @Column(name = "fullName", nullable = false, length = 50)
    private String fullName;

    @Column(name = "userName", nullable = false, unique = true, length = 50)
    private String userName;

    // @JsonIgnore
    @Column(name = "Password", nullable = false, length = 30)
    private String password;

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "CNIC", nullable = false, length = 13)
    private String cnic;

    @Column(name = "accountCreationDate", nullable = false)
    private LocalDate accountCreationDate;
}
