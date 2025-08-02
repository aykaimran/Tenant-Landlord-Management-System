package com.rentinel.backend.repository;

import com.rentinel.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT SUM(P.amount) FROM Payment P WHERE P.paymentStatus = 'Paid'")
    Double getTotalPaymentAmount();

    @Query(value = "SELECT SUM(p.amount) FROM payment p WHERE YEAR(p.paymentDate) = YEAR(GETDATE())", nativeQuery = true)
    Double getYearlyRent();

    @Query(value = "SELECT SUM(p.amount) FROM payment p WHERE YEAR(p.paymentDate) = YEAR(GETDATE()) AND p.ownerUserName = :ownerUserName", nativeQuery = true)
    Double getYearlyRentByOwnerName(String ownerUserName);

    // @Query("DELETE FROM Payment P WHERE P.propertyID = ?1")
    // void deleteByPropertyID(Integer propertyID);

    @Modifying
    @Transactional
    @Query("DELETE FROM Payment pa WHERE pa.propertyID = :propertyID")
    void deleteAllByPropertyID(Integer propertyID);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Payment WHERE propertyID = :propertyId", nativeQuery = true)
    void deletePaymentsForProperty(@Param("propertyId") Integer propertyId);

    @Query(value = "SELECT SUM(p.amount) FROM Payment p WHERE p.ownerUserName = :ownerUserName", nativeQuery = true)
    Long getTotalPaymentsByOwnerUserName(@Param("ownerUserName") String ownerUserName);

    List<Payment> findByOwnerUserName(String ownerUserName);

    @Query(value = "SELECT FORMAT(paymentDate, 'MMM') AS month, SUM(amount) AS totalAmount " +
            "FROM Payment " +
            "WHERE YEAR(paymentDate) = YEAR(GETDATE()) AND ownerUserName = :ownerUserName " +
            "GROUP BY FORMAT(paymentDate, 'MMM'), MONTH(paymentDate) " +
            "ORDER BY MONTH(paymentDate)", nativeQuery = true)
    List<Object[]> getMonthlyRentStats(String ownerUserName);

}
