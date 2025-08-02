package com.rentinel.backend.propertyassignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("propertyAssignmentRepository2")
public interface PropertyAssignmentRepository extends JpaRepository<PropertyAssignment, Integer> {
    List<PropertyAssignment> findByTenantID(Integer tenantID); // Find assignments by tenant ID
}
