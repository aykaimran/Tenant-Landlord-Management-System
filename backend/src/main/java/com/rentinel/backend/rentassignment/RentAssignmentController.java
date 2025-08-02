package com.rentinel.backend.rentassignment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import java.time.LocalDate;
// import java.util.HashMap;
// import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("rentAssignmentController2")
@RequestMapping("/api/v1/rentAssignments")
public class RentAssignmentController {

    @Autowired
    private RentAssignmentService rentAssignmentService;

    // Get all rent assignments
    @GetMapping
    public List<RentAssignment> getAllRentAssignments() {
        return rentAssignmentService.getAllRentAssignments();
    }

    // Get rent assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<RentAssignment> getRentAssignmentById(@PathVariable("id") int id) {
        Optional<RentAssignment> rentAssignment = rentAssignmentService.getRentAssignmentById(id);
        return rentAssignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<RentAssignment> getRentAssignmentByPropertyId(@PathVariable("propertyId") int propertyId) {
        Optional<RentAssignment> rentAssignment = rentAssignmentService.getRentAssignmentByPropertyId(propertyId);
        return rentAssignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tenant/{username}/{propertyId}")
    public List<RentAssignment> getRentAssignmentsByTenantUsername(@PathVariable String username,
            @PathVariable int propertyId) {
        return rentAssignmentService.getRentAssignmentsByTenantUsername(username, propertyId);
    }

    // Create a new rent assignment
    @PostMapping
    public ResponseEntity<RentAssignment> createRentAssignment(@RequestBody RentAssignment rentAssignment) {
        try {
            RentAssignment createdRentAssignment = rentAssignmentService.createRentAssignment(rentAssignment);
            return new ResponseEntity<>(createdRentAssignment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing rent assignment
    @PutMapping("/{id}")
    public ResponseEntity<RentAssignment> updateRentAssignment(@PathVariable("id") int id,
            @RequestBody RentAssignment rentAssignment) {
        RentAssignment updatedRentAssignment = rentAssignmentService.updateRentAssignment(id, rentAssignment);
        if (updatedRentAssignment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRentAssignment);
    }

    // Delete rent assignment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentAssignment(@PathVariable("id") int id) {
        if (!rentAssignmentService.deleteRentAssignment(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
    // // Zahra's Modifications
    // // Simple endpoint to get tenant dashboard details
    // @GetMapping("/tenant/{tenantID}")
    // public ResponseEntity<String> getTenantDashboardDetails(@PathVariable Long
    // tenantID)
    // {
    // // Get total owners, rented properties, rent paid, and upcoming due date
    // long totalOwners = rentAssignmentService.getTotalOwners(tenantID);
    // long rentedProperties =
    // rentAssignmentService.getTotalRentedProperties(tenantID);
    // double totalRentPaid = rentAssignmentService.getTotalRentPaid(tenantID);
    // LocalDate upcomingDueDate =
    // rentAssignmentService.getUpcomingDueDate(tenantID);
    //
    // // Simple concatenated response as a String (for simplicity)
    // String response = String.format("Total Owners: %d, Rented Properties: %d,
    // Total Rent Paid: %.2f, Upcoming Due Date: %s",
    // totalOwners, rentedProperties, totalRentPaid, upcomingDueDate != null ?
    // upcomingDueDate : "None");
    //
    // return ResponseEntity.ok(response); // Return as a plain String message
    // }

    // Zahra's Modifications
    // Simple endpoint to get tenant dashboard details
    @GetMapping("/tenant/{userName}/total-owners")
    public ResponseEntity<Long> getTotalOwners(@PathVariable String userName) {
        long totalOwners = rentAssignmentService.getTotalOwners(userName);
        return ResponseEntity.ok(totalOwners);
    }

    @GetMapping("/tenant/{userName}/rented-properties")
    public ResponseEntity<Long> getRentedProperties(@PathVariable String userName) {
        long rentedProperties = rentAssignmentService.getTotalRentedProperties(userName);
        return ResponseEntity.ok(rentedProperties);
    }

    @GetMapping("/tenant/{userName}/total-rent-paid")
    public ResponseEntity<Double> getTotalRentPaid(@PathVariable String userName) {
        double totalRentPaid = rentAssignmentService.getTotalRentPaid(userName);
        return ResponseEntity.ok(totalRentPaid);
    }

    @GetMapping("/tenant/{userName}/upcoming-due-date")
    public ResponseEntity<String> getUpcomingDueDate(@PathVariable String userName) {
        LocalDate upcomingDueDate = rentAssignmentService.getUpcomingDueDate(userName);
        return ResponseEntity.ok(upcomingDueDate != null ? upcomingDueDate.toString() : "None");
    }

    @GetMapping("/tenant/{userName}/last-payment-date")
    public ResponseEntity<String> getLastPaymentDate(@PathVariable String userName) {
        LocalDate lastPaymentDate = rentAssignmentService.getLastTenantPaymentDate(userName);
        return ResponseEntity.ok(lastPaymentDate != null ? lastPaymentDate.toString() : "None");
    }

    @GetMapping("/tenant/{userName}/yearly-rent-paid")
    public ResponseEntity<Double> getYearlyRentPaid(@PathVariable String userName) {
        double yearlyRentPaid = rentAssignmentService.getYearlyRentPaid(userName);
        return ResponseEntity.ok(yearlyRentPaid);
    }

    @GetMapping("/tenant/{userName}/average-rent-paid")
    public ResponseEntity<Double> getAverageRentPaid(@PathVariable String userName) {
        double averageRentPaid = rentAssignmentService.getAverageRentPaid(userName);
        return ResponseEntity.ok(averageRentPaid);
    }

    // Date Formatter :
    // private String formatDate(LocalDate date) {
    // if (date == null) return "N/A";
    // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMMM yyyy");
    // String formattedDate = date.format(formatter);
    // String day = date.getDayOfMonth() + getDaySuffix(date.getDayOfMonth());
    // return day + " " + date.format(DateTimeFormatter.ofPattern("MMMM yyyy"));
    // }

    // private String getDaySuffix(int day)
    // {
    // if (day >= 11 && day <= 13) return "th";
    // return switch (day % 10)
    // {
    // case 1 -> "st";
    // case 2 -> "nd";
    // case 3 -> "rd";
    // default -> "th";
    // };
    // }
    // // For Pending Rent
    // @GetMapping("/tenant/{userName}/pending-rent")
    // public ResponseEntity<Double> getPendingRent(@PathVariable String userName)
    // {
    // // Call the service method to calculate the pending rent
    // double pendingRent = rentAssignmentService.getPendingRentForTenant(userName);
    //
    // // Return the pending rent as a response
    // return ResponseEntity.ok(pendingRent);
    // }

}
