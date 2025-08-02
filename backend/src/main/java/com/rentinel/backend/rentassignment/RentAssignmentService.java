package com.rentinel.backend.rentassignment;

import com.rentinel.backend.payment.Payment;
import com.rentinel.backend.payment.PaymentRepository;
// import com.aykaimran.rentinel.property.Property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.aykaimran.rentinel.tenant.Tenant;
import com.rentinel.backend.tenant.TenantRepository;

// import com.aykaimran.rentinel.property.PropertyRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

// import java.math.BigDecimal;
@Service
public class RentAssignmentService {

    @Autowired
    private RentAssignmentRepository rentAssignmentRepository;

    // @Autowired
    // private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // Get all rent assignments
    public List<RentAssignment> getAllRentAssignments() {
        return rentAssignmentRepository.findAll();
    }

    // Get rent assignment by ID
    public Optional<RentAssignment> getRentAssignmentById(int id) {
        return rentAssignmentRepository.findById(id);
    }

    // Create a new rent assignment
    public RentAssignment createRentAssignment(RentAssignment rentAssignment) {
        return rentAssignmentRepository.save(rentAssignment);
    }

    // Update an existing rent assignment
    public RentAssignment updateRentAssignment(int id, RentAssignment rentAssignment) {
        if (!rentAssignmentRepository.existsById(id)) {
            return null; // Rent assignment not found
        }
        rentAssignment.setAssignmentID(id); // Ensure the ID remains unchanged
        return rentAssignmentRepository.save(rentAssignment);
    }

    public Optional<RentAssignment> getRentAssignmentByPropertyId(int propertyId) {
        return rentAssignmentRepository.findByPropertyPropertyID(propertyId);
    }

    public List<RentAssignment> getRentAssignmentsByTenantUsername(String username, int propertyId) {
        Integer tenantID = tenantRepository.findByUserName(username).get().getID();
        return rentAssignmentRepository.findByTenant_IDAndProperty_propertyID(tenantID, propertyId);
    }

    // Delete a rent assignment by ID
    public boolean deleteRentAssignment(int id) {
        if (!rentAssignmentRepository.existsById(id)) {
            return false; // Rent assignment not found
        }
        rentAssignmentRepository.deleteById(id);
        return true;
    }

    public LocalDate getUpcomingDueDate(String userName) {
        Optional<RentAssignment> upcomingDueDateAssignment = rentAssignmentRepository
                .findFirstByTenant_UserNameAndDueDateAfterOrderByDueDateAsc(userName, LocalDate.now());
        return upcomingDueDateAssignment.map(RentAssignment::getDueDate).orElse(null); // If no assignment found, return
                                                                                       // null
    }

    // Method to get the last payment date for the tenant
    public LocalDate getLastTenantPaymentDate(String userName) {
        Optional<Payment> lastPayment = paymentRepository
                .findTopByTenant_UserNameAndPaymentStatusOrderByPaymentDateDesc(userName, "Paid");
        return lastPayment.map(Payment::getPaymentDate).orElse(null); // Get the most recent paid payment
    }

    public double getTotalRentPaid(String userName) {
        return paymentRepository.getTotalRentPaidByTenantUserName(userName);
    }

    public long getTotalOwners(String userName) {
        return rentAssignmentRepository.countDistinctByTenant_UserName(userName);
    }

    // Method to get total rented properties for a tenant (using tenant.ID)
    public long getTotalRentedProperties(String userName) {
        return rentAssignmentRepository.countByTenant_UserName(userName);
    }

    // Method to get the total rent paid in the current year
    public double getYearlyRentPaid(String userName) {
        LocalDate startOfYear = LocalDate.now().withDayOfYear(1); // First day of the current year
        return paymentRepository.getTotalRentPaidInYearByTenantUserName(userName, startOfYear);
    }

    // Method to get average rent paid by the tenant
    public double getAverageRentPaid(String userName) {
        List<Payment> payments = paymentRepository.findByTenant_UserName(userName); // Get all payments for the tenant
        if (payments.isEmpty()) {
            return 0.0;
        }
        double totalPaid = payments.stream().mapToDouble(Payment::getAmount).sum();
        return totalPaid / payments.size(); // Calculate the average
    }

    // // For Pending Rent
    // // Method to calculate total pending rent for a tenant
    // public double getPendingRentForTenant(String userName)
    // {
    // // Fetch all rent assignments for the tenant where the status is "pending"
    // List<RentAssignment> pendingAssignments =
    // rentAssignmentRepository.findByTenant_UserNameAndStatus(userName, "pending");
    //
    // // Initialize total pending rent as BigDecimal
    // BigDecimal totalPendingRent = BigDecimal.ZERO;
    //
    // // Loop through all the pending assignments and sum the rent
    // for (RentAssignment assignment : pendingAssignments) {
    // // Add the fixed rent for each property (rent is stored as BigDecimal in
    // Property)
    // totalPendingRent =
    // totalPendingRent.add(assignment.getProperty().getFixedRent());
    // }
    //
    // // If you need the result as a double, convert the BigDecimal to double
    // return totalPendingRent.doubleValue();
    // }

}
