package com.rentinel.backend.owner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Add this import

@Repository("ownerRepository2")
public interface OwnerRepository extends JpaRepository<Owner, Integer> {
    Optional<Owner> findByUserName(String userName);
}