package com.rentinel.backend.repository;

import com.rentinel.backend.model.Admin;
// import com.rentinel.backend.model.Owner;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

    // Find an admin by username
    Admin findByUserName(String userName);

    // Find an admin by CNIC
    Admin findByCnic(String cnic);

    Optional<Admin> findByuserNameAndPassword(String userName, String password); // Match the lowercase field name
}
