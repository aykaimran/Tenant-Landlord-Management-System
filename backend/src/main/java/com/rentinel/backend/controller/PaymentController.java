
package com.rentinel.backend.controller;

import com.rentinel.backend.model.MonthlyRentStats;
import com.rentinel.backend.model.Payment;
import com.rentinel.backend.repository.PaymentRepository;
import com.rentinel.backend.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Payment> getPaymentsByOwner(@PathVariable Integer ownerId) {
        String ownerName = ownerRepository.findById(ownerId).get().getUserName();
        return paymentRepository.findByOwnerUserName(ownerName);
    }

    // DELETE /payments/{id}
    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Integer id) {
        paymentRepository.deleteById(id);
    }

    @GetMapping("/count")
    public long getPaymentCount() {
        return paymentRepository.count();
    }

    @GetMapping("/totalPaymentAmount")
    public Double getTotalPaymentAmount() {
        return paymentRepository.getTotalPaymentAmount();
    }

    @GetMapping("/yearlyRent")
    public Double getYearlyRent() {
        return paymentRepository.getYearlyRent();
    }

    @GetMapping("/yearlyRent/by-owner/{ownerId}")
    public Double getYearlyRentByOwner(@PathVariable Integer ownerId) {
        String ownerName = ownerRepository.findById(ownerId).get().getUserName();
        return paymentRepository.getYearlyRentByOwnerName(ownerName);
    }

    @PutMapping("/updateStatus")
    public Payment updatePaymentStatus(@RequestBody Payment updatedPayment) {
        Payment existingPayment = paymentRepository.findById(updatedPayment.getPaymentID())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        existingPayment.setPaymentStatus(updatedPayment.getPaymentStatus());

        return paymentRepository.save(existingPayment);
    }

    // DELETE /payments/property/{propertyID}
    @DeleteMapping("/property/{propertyID}")
    public void deletePaymentsByPropertyID(@PathVariable Integer propertyID) {
        try {
            paymentRepository.deleteAllByPropertyID(propertyID);
            System.out.println("Deleted payments for property ID: " + propertyID);
        } catch (Exception e) {
            System.out.println("Error deleting payments: " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/count/by-owner/{ownerId}")
    public long getPayCountByOwner(@PathVariable Integer ownerId) {
        System.out.println(ownerId);
        String ownerName = ownerRepository.findById(ownerId).get().getUserName();
        System.out.println(ownerName);
        System.out.println(ownerRepository.findById(ownerId).get());

        Long totalPayments = paymentRepository.getTotalPaymentsByOwnerUserName(ownerName);
        return totalPayments != null ? totalPayments : 0L;
    }

    @GetMapping("/monthlyRents/{ownerId}")
    public List<MonthlyRentStats> getMonthlyRentStats(@PathVariable Integer ownerId) {
        try {
            String ownerName = ownerRepository.findById(ownerId).get().getUserName();
            List<Object[]> results = paymentRepository.getMonthlyRentStats(ownerName);
            List<MonthlyRentStats> statsList = new ArrayList<>();

            for (Object[] result : results) {
                if (result != null && result.length == 2) {
                    String month = (String) result[0];
                    Integer amount = ((Number) result[1]).intValue();
                    statsList.add(new MonthlyRentStats(month, amount));
                }
            }

            return statsList;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching rent stats", e);
        }
    }

}
