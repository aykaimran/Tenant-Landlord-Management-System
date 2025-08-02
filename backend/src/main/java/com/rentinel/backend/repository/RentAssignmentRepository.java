package com.rentinel.backend.repository;

import com.rentinel.backend.model.RentAssignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
@Repository
public interface RentAssignmentRepository extends JpaRepository<RentAssignment, Integer> {
    List<RentAssignment> findByPropertyID(Integer propertyID);

    List<RentAssignment> findByTenantID(Integer tenantID);

    void deleteAllByPropertyID(Integer propertyID);

    @Modifying
    @Transactional
    @Query("DELETE FROM RentAssignment ra WHERE ra.tenantID = :tenantID")
    void deleteAllByTenantID(Integer tenantID);
}
