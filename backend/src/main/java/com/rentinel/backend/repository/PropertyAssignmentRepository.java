package com.rentinel.backend.repository;

import com.rentinel.backend.model.PropertyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PropertyAssignmentRepository extends JpaRepository<PropertyAssignment, Integer> {

    // Custom query to find property assignments by tenant ID (tenantName)
    List<PropertyAssignment> findByTenantID(Integer ID);

    List<PropertyAssignment> findByPropertyID(Integer propertyID);

    @Modifying
    @Transactional
    @Query("DELETE FROM PropertyAssignment pa WHERE pa.propertyID = :propertyID")
    void deleteByPropertyID(Integer propertyID);

    @Modifying
    @Transactional
    @Query("DELETE FROM PropertyAssignment ra WHERE ra.tenantID = :tenantID")
    void deleteAllByTenantID(Integer tenantID);

    @Query("SELECT COUNT(DISTINCT p.tenantID) FROM PropertyAssignment p WHERE p.ownerID = :ownerId")
    long countDistinctTenantIDByOwnerID(@Param("ownerId") Integer ownerId);
}
