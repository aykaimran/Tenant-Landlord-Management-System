package com.rentinel.backend.paymentreminder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("paymentReminderRepository2")
public interface PaymentReminderManagementRepository extends JpaRepository<PaymentReminder, Integer> {
    boolean existsByPaymentID(int paymentID);
}
