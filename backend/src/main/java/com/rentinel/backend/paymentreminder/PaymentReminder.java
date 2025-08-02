package com.rentinel.backend.paymentreminder;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity(name = "PaymentReminder2")
@Table(name = "PaymentReminder")
public class PaymentReminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reminderID;

    private int paymentID;

    private LocalDate emailSentDate;

    // Getters and setters
    public int getReminderID() {
        return reminderID;
    }

    public void setReminderID(int reminderID) {
        this.reminderID = reminderID;
    }

    public int getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(int paymentID) {
        this.paymentID = paymentID;
    }

    public LocalDate getEmailSentDate() {
        return emailSentDate;
    }

    public void setEmailSentDate(LocalDate emailSentDate) {
        this.emailSentDate = emailSentDate;
    }
}
