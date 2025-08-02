package com.rentinel.backend;

import com.rentinel.backend.payment.*;
import com.rentinel.backend.paymentreminder.PaymentReminder;
import com.rentinel.backend.paymentreminder.PaymentReminderManagementRepository;
import com.rentinel.backend.tenant.*;
import com.rentinel.backend.tenantnotifications.*;
import com.rentinel.backend.tenantnotifications.TenantNotificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
// import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
// @EnableScheduling // 🔔 Required for @Scheduled to work
public class BackendApplication {
	// @Autowired
	// EmailSenderService emailSenderService;
	//
	// @Autowired
	// private PaymentRepository paymentRepository;
	//
	// @Autowired
	// private TenantNotificationsService tenantNotificationsService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// @EventListener(ApplicationReadyEvent.class)
	// public void checkOverduePaymentsAndSendEmails() {
	// List<Payment> overduePayments =
	// paymentRepository.findOverduePayments(LocalDate.now());
	//
	// for (Payment payment : overduePayments) {
	// Tenant tenant = payment.getTenant();
	// String to = tenant.getEmail(); // use actual tenant email
	// String subject = "Payment Due Reminder";
	// String body = "Hello " + tenant.getFullName() + ",\n\n" +
	// "This is a friendly reminder that your rent payment was due on " +
	// payment.getPaymentDate() + " and is still pending.\n" +
	// "Please make the payment at your earliest convenience.\n\n" +
	// "Thank you,\nRentinel Team";
	//
	// // 1. Send Email
	// emailSenderService.sendEmail(to, subject, body);
	//
	// // 2. Create Notification
	// TenantNotifications notification = new TenantNotifications();
	// notification.setTenant(tenant);
	// notification.setSubject("Payment Due");
	// notification.setSentDate(LocalDate.now());
	// notification.setPropertyName(payment.getProperty().getPropertyName());
	// notification.setFromOwner(payment.getOwner().getUserName());
	// notification.setContent("Your rent payment for " +
	// payment.getProperty().getPropertyName()
	// + " was due on " + payment.getPaymentDate() + " and is still pending.");
	//
	// tenantNotificationsService.saveNotification(notification);
	// }
	// }
	@Autowired
	EmailSenderService emailSenderService;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private TenantNotificationsService tenantNotificationsService;

	@Autowired
	private PaymentReminderManagementRepository paymentReminderRepository;

	@EventListener(ApplicationReadyEvent.class)
	public void checkOverduePaymentsAndSendEmails() {
		List<Payment> overduePayments = paymentRepository.findOverduePayments(LocalDate.now());

		for (Payment payment : overduePayments) {
			if (paymentReminderRepository.existsByPaymentID(payment.getPaymentID())) {
				continue;
			}

			Tenant tenant = payment.getTenant();
			String to = tenant.getEmail(); // use actual tenant email
			String subject = "Payment Due Reminder";
			String body = "Hello " + tenant.getFullName() + ",\n\n" +
					"This is a friendly reminder that your rent payment was due on " +
					payment.getPaymentDate() + " and is still pending.\n" +
					"Please make the payment at your earliest convenience.\n\n" +
					"Thank you,\nRentinel Team";

			// 1. Send Email
			emailSenderService.sendEmail(to, subject, body);

			// 2. Save Notification
			TenantNotifications notification = new TenantNotifications();
			notification.setTenant(tenant);
			notification.setSubject("Payment Due");
			notification.setSentDate(LocalDate.now());
			notification.setPropertyName(payment.getProperty().getPropertyName());
			notification.setFromOwner(payment.getOwner().getUserName());
			notification.setContent("Your rent payment for " + payment.getProperty().getPropertyName()
					+ " was due on " + payment.getPaymentDate() + " and is still pending.");
			tenantNotificationsService.saveNotification(notification);

			// 3. Save PaymentReminder
			PaymentReminder reminder = new PaymentReminder();
			reminder.setPaymentID(payment.getPaymentID());
			reminder.setEmailSentDate(LocalDate.now());
			paymentReminderRepository.save(reminder);
		}
	}

}
