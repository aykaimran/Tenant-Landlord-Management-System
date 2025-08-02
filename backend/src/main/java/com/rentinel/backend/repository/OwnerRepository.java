package com.rentinel.backend.repository;

import com.rentinel.backend.model.Owner;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Integer> {
    // Optional<Owner> findById(Integer id); // Match the lowercase field name

    Optional<Owner> findByUserName(String userName);

    void deleteByUserName(String userName);

    @Query(value = "SELECT FORMAT(accountCreationDate, 'MMM') AS month, COUNT(*) AS userCount " +
            "FROM ( " +
            "    SELECT accountCreationDate FROM Owner " +
            "    UNION ALL " +
            "    SELECT accountCreationDate FROM Tenant " +
            ") AS allUsers " +
            "WHERE YEAR(accountCreationDate) = YEAR(GETDATE()) " +
            "GROUP BY FORMAT(accountCreationDate, 'MMM'), MONTH(accountCreationDate) " +
            "ORDER BY MONTH(accountCreationDate)", nativeQuery = true)
    List<Object[]> getUserRegistrationStats();

    @Query(value = "SELECT * FROM Owner WHERE userName = :userName AND Password = :Password", nativeQuery = true)
    Optional<Owner> findByUserNameAndPassword(String userName, String Password); // Match the lowercase field name
}