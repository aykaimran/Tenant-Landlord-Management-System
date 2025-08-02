package com.rentinel.backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository("paymentRepository2")
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
        // You can add custom queries here later
        @Query("SELECT p FROM Payment2 p WHERE p.paymentDate <= :today AND p.paymentStatus <> 'Paid'")
        List<Payment> findOverduePayments(@Param("today") LocalDate today);

        List<Payment> findByTenant_UserName(String username);

        Optional<Payment> findByPaymentIDAndTenant_UserName(int id, String username);

        // Get total payments made by the tenant based on userName
        @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment2 p WHERE p.tenant.userName = :userName")
        double getTotalPaymentsMadeByTenantUserName(String userName);

        // Remove the duplicate method and keep only this one:
        @Query(value = "SELECT FORMAT(paymentDate, 'MMM') AS month, SUM(amount) AS totalAmount " +
                        "FROM Payment p " +
                        "WHERE YEAR(paymentDate) = YEAR(GETDATE()) AND p.tenantUserName = :userName " +
                        "GROUP BY FORMAT(paymentDate, 'MMM'), MONTH(paymentDate) " +
                        "ORDER BY MONTH(paymentDate)", nativeQuery = true)
        List<Map<String, Object>> getMonthlyPaymentsByTenantUserName(@Param("userName") String userName);

        // Get the total rent paid by a tenant based on userName
        @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment2 p WHERE p.tenant.userName = :userName")
        double getTotalRentPaidByTenantUserName(String userName);

        // Get the most recent paid payment for a tenant
        Optional<Payment> findTopByTenant_UserNameAndPaymentStatusOrderByPaymentDateDesc(String userName,
                        String paymentStatus);

        // Get total rent paid by the tenant in the current year
        @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment2 p WHERE p.tenant.userName = ?1 AND p.paymentDate >= ?2")
        double getTotalRentPaidInYearByTenantUserName(String userName, LocalDate startOfYear);

}
