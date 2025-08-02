package com.rentinel.backend.rentassignment;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository("rentAssignmentRepository2")
public interface RentAssignmentRepository extends JpaRepository<RentAssignment, Integer> {
    // You can add custom query methods here if needed
    Optional<RentAssignment> findByPropertyPropertyID(int propertyId);

    List<RentAssignment> findByTenant_IDAndProperty_propertyID(int tenantID, int propertyID);

    /// ////////////
    // Custom query method to find RentAssignment by Property ID

    // Count distinct owners by tenant's userName (Fix: Use tenant's userName)
    long countDistinctByTenant_UserName(String userName);

    // Count rented properties by tenant's userName (Fix: Use tenant's userName)
    long countByTenant_UserName(String userName);

    // Correctly defined method to get the earliest due date assignment for a given
    // tenant
    Optional<RentAssignment> findFirstByTenant_UserNameAndDueDateAfterOrderByDueDateAsc(String userName,
            LocalDate currentDate);

}
