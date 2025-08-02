package com.rentinel.backend.tenantnotifications;

import com.rentinel.backend.payment.Payment;
import com.rentinel.backend.payment.*;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
// import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TenantNotificationsService {

    private final TenantNotificationsRepository tenantNotificationsRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public TenantNotificationsService(TenantNotificationsRepository tenantNotificationsRepository,
            PaymentRepository paymentRepository) {
        this.tenantNotificationsRepository = tenantNotificationsRepository;
        this.paymentRepository = paymentRepository;
    }

    // Get all notifications
    public List<TenantNotifications> getAllNotifications() {
        return tenantNotificationsRepository.findAll();
    }

    // Get a specific notification by ID
    public Optional<TenantNotifications> getNotificationById(int notificationID) {
        return tenantNotificationsRepository.findById(notificationID);
    }

    // Save a new notification
    public TenantNotifications saveNotification(TenantNotifications notification) {
        return tenantNotificationsRepository.save(notification);
    }

    public List<TenantNotifications> getNotificationsByUsername(String username) {
        return tenantNotificationsRepository.findByTenant_UserName(username);
    }

    // // Update an existing notification
    // public TenantNotifications updateNotification(TenantNotifications
    // notification) {
    // return tenantNotificationsRepository.save(notification);
    // }

    // Delete a notification by ID
    public void deleteNotification(int notificationID) {
        tenantNotificationsRepository.deleteById(notificationID);
    }

    // // 🔁 This will run every day at 12:00 AM
    // @Scheduled(cron = "0 0 0 * * ?")
    // public void scheduledCheckOverduePayments() {
    // checkOverduePaymentsAndNotify();
    // }

    // Core logic for checking and sending notifications
    public void checkOverduePaymentsAndNotify() {
        List<Payment> payments = paymentRepository.findAll();

        payments.forEach(payment -> {
            if (payment.getProperty() != null &&
                    payment.getPaymentDate() != null &&
                    payment.getPaymentDate().isBefore(LocalDate.now()) &&
                    !"paid".equalsIgnoreCase(payment.getPaymentStatus())) {

                TenantNotifications notification = new TenantNotifications();
                notification.setTenant(payment.getTenant());
                notification.setSubject("Payment Due for Property: " + payment.getProperty().getPropertyName());
                notification.setSentDate(LocalDate.now());
                notification.setPropertyName(payment.getProperty().getPropertyName());
                notification.setFromOwner(payment.getOwner().getUserName());
                notification.setContent("Your payment for the property " +
                        payment.getProperty().getPropertyName() + " is overdue. Please make the payment.");

                tenantNotificationsRepository.save(notification);
            }
        });
    }
}