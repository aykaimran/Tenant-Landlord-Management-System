package com.rentinel.backend.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository("propertyRepository2")
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    Optional<Property> findByPropertyName(String propertyName);
}
