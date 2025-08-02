package com.rentinel.backend.payment;

import com.rentinel.backend.owner.Owner;
import com.rentinel.backend.owner.OwnerRepository;
import com.rentinel.backend.property.Property;
import com.rentinel.backend.property.PropertyRepository;
import com.rentinel.backend.tenant.Tenant;
import com.rentinel.backend.tenant.TenantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TenantRepository tenantRepository;
    private final OwnerRepository ownerRepository;
    private final PropertyRepository propertyRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
            TenantRepository tenantRepository,
            OwnerRepository ownerRepository,
            PropertyRepository propertyRepository) {
        this.paymentRepository = paymentRepository;
        this.tenantRepository = tenantRepository;
        this.ownerRepository = ownerRepository;
        this.propertyRepository = propertyRepository;
    }

    public void createPayment(Payment payment, String tenantUserName, String ownerUserName, int propertyID) {
        Tenant tenant = tenantRepository.findByUserName(tenantUserName)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Owner owner = ownerRepository.findByUserName(ownerUserName)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Property property = propertyRepository.findById(propertyID)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        payment.setTenant(tenant);
        payment.setOwner(owner);
        payment.setProperty(property);

        paymentRepository.save(payment);
    }

    public Payment savePayment(Payment payment, String tenantUserName, String ownerUserName, int propertyID) {
        // Fetch the tenant from the database using the tenant's username
        Tenant tenant = tenantRepository.findByUserName(tenantUserName)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found"));

        // Fetch the owner from the database using the owner's username
        Owner owner = ownerRepository.findByUserName(ownerUserName)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        // Fetch the property from the database using the property ID
        Property property = propertyRepository.findById(propertyID)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));

        // Set the correct tenant, owner, and property for the payment
        payment.setTenant(tenant);
        payment.setOwner(owner);
        payment.setProperty(property);

        // Set payment date and status if not provided
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(java.time.LocalDate.now());
        }
        if (payment.getPaymentStatus() == null) {
            payment.setPaymentStatus("Pending");
        }

        // Save the payment to the database
        return paymentRepository.save(payment);
    }

    public void updatePayment(int id, Payment updatedPayment, String tenantUserName, String ownerUserName,
            int propertyID) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Tenant tenant = tenantRepository.findByUserName(tenantUserName)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Owner owner = ownerRepository.findByUserName(ownerUserName)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Property property = propertyRepository.findById(propertyID)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        existing.setPaymentStatus(updatedPayment.getPaymentStatus());
        existing.setPaymentDate(updatedPayment.getPaymentDate());
        existing.setAmount(updatedPayment.getAmount());
        existing.setTenant(tenant);
        existing.setOwner(owner);
        existing.setProperty(property);

        paymentRepository.save(existing);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(int id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment with ID " + id + " not found"));
    }

    public List<Payment> getPaymentsByTenantUsername(String username) {
        return paymentRepository.findByTenant_UserName(username);
    }

    public Payment getPaymentForTenant(int paymentId, String username) {
        return paymentRepository.findByPaymentIDAndTenant_UserName(paymentId, username)
                .orElseThrow(() -> new RuntimeException("Payment not found for this tenant"));
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Zahra's Added Code
    public List<Map<String, Object>> getMonthlyPaymentTotals() {
        List<Payment> payments = paymentRepository.findAll(); // built-in JPA method

        // Group by month (number) and sum amounts
        Map<Integer, Integer> monthlyTotals = payments.stream()
                .filter(p -> p.getPaymentDate() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPaymentDate().getMonthValue(), // 1=January, 2=February, etc.
                        Collectors.summingInt(Payment::getAmount)));

        // Prepare ordered list (January to December)
        List<Map<String, Object>> monthlyData = new ArrayList<>();

        for (int monthNumber = 1; monthNumber <= 12; monthNumber++) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", Month.of(monthNumber).name()); // Converts 1 -> JANUARY, 2 -> FEBRUARY
            map.put("payment", monthlyTotals.getOrDefault(monthNumber, 0));
            monthlyData.add(map);
        }

        return monthlyData;
    }

    // For Tenant's Dashboard to display TotalRent Paid

    public int getTotalRentPaidByProperty(int propertyId) {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .filter(payment -> payment.getProperty().getPropertyID() == propertyId)
                .mapToInt(Payment::getAmount)
                .sum();
    }

    public int getTotalRentPaid() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .mapToInt(Payment::getAmount)
                .sum();
    }

    // Zahra's Added Code:
    // Method to get total payments made by a tenant (using tenant.userName)
    public double getTotalPaymentsMade(String userName) {
        return paymentRepository.getTotalPaymentsMadeByTenantUserName(userName); // Fetch total payments for the tenant
    }

    public List<Map<String, Object>> getMonthlyPayments(String userName) {
        return paymentRepository.getMonthlyPaymentsByTenantUserName(userName);
    }

}
