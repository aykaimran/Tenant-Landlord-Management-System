package com.rentinel.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "blackListedUsers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blacklist {

    @Id
    @Column(name = "CNIC", length = 13)
    private String CNIC;
}