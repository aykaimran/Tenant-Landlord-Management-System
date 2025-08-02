package com.rentinel.backend.controller;

import com.rentinel.backend.model.LoginRequest;
import com.rentinel.backend.model.LoginResponse;

import com.rentinel.backend.model.Owner;
import com.rentinel.backend.model.Property;
// import com.rentinel.backend.model.Tenant;
import com.rentinel.backend.model.UserRegistrationStats;
import com.rentinel.backend.repository.OwnerRepository;
import com.rentinel.backend.repository.PaymentRepository;
import com.rentinel.backend.repository.PropertyAssignmentRepository;
import com.rentinel.backend.repository.PropertyRepository;
import com.rentinel.backend.repository.RentAssignmentRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/owners")
public class OwnerController {
    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RentAssignmentRepository rentAssignmentRepository;

    @Autowired
    private PropertyAssignmentRepository propertyAssignmentRepository;

    // GET /api/owners
    @GetMapping
    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    // Get an owner by ID
    @GetMapping("/id/{id}")
    public Optional<Owner> getOwnerById(@PathVariable Integer id) {
        return ownerRepository.findById(id);
    }

    @GetMapping("/{ID}")
    public Owner getPropertyById(@PathVariable Integer ID) {
        Optional<Owner> owner = ownerRepository.findById(ID);
        if (owner.isPresent()) {
            return owner.get();
        } else {
            throw new RuntimeException("Owner not found with id " + ID);
        }
    }

    @DeleteMapping("/{userName}")
    @Transactional
    public ResponseEntity<Void> deleteOwner(@PathVariable String userName) {
        // Find the owner first
        Optional<Owner> ownerOpt = ownerRepository.findByUserName(userName);
        if (!ownerOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Get all properties owned by this owner
        List<Property> properties = propertyRepository.findByOwnerName(userName);

        // For each property, delete dependent entities
        for (Property property : properties) {
            Integer propertyId = property.getPropertyID();

            // 1. Delete payments for this property
            paymentRepository.deletePaymentsForProperty(propertyId);

            // 2. Delete rent assignments for this property
            rentAssignmentRepository.deleteAllByPropertyID(propertyId);

            // 3. Delete property assignments for this property
            propertyAssignmentRepository.deleteByPropertyID(propertyId);

            // Finally, delete the property itself
            propertyRepository.deleteById(propertyId);
        }

        // Now delete the owner
        ownerRepository.deleteByUserName(userName);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public Owner updateOwner(@PathVariable Integer id, @RequestBody Owner ownerDetails) {
        Optional<Owner> owner = ownerRepository.findById(id);

        if (!owner.isPresent()) {
            throw new RuntimeException("Owner not found with ID " + id);
        }

        Owner existingOwner = owner.get();

        // Update the tenant details, skipping password update for security reasons
        existingOwner.setFullName(ownerDetails.getFullName());
        existingOwner.setUserName(ownerDetails.getUserName());
        existingOwner.setEmail(ownerDetails.getEmail());
        existingOwner.setCnic(ownerDetails.getCnic());
        return ownerRepository.save(existingOwner);
    }

    @PostMapping
    public ResponseEntity<Owner> createOwner(@RequestBody Owner newOwner) {
        try {
            System.out.println(newOwner);
            newOwner.setAccountCreationDate(LocalDate.now());
            Owner savedOwner = ownerRepository.save(newOwner);
            return new ResponseEntity<>(savedOwner, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // For debugging, remove in production
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/count")
    public long getOwnerCount() {
        return ownerRepository.count();
    }

    @GetMapping("/userRegistrations")
    public List<UserRegistrationStats> getUserRegistrationStats() {
        try {
            List<Object[]> results = ownerRepository.getUserRegistrationStats();
            List<UserRegistrationStats> statsList = new ArrayList<>();

            // Debugging: Print the results first to check the data structure
            System.out.println("Query Results: " + results);

            // Now process the results
            for (Object[] result : results) {
                if (result != null && result.length == 2) {
                    String month = (String) result[0];
                    Integer userCount = (Integer) result[1];
                    statsList.add(new UserRegistrationStats(month, userCount));
                }
            }
            return statsList;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching user registration stats", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginOwner(@RequestBody LoginRequest loginRequest) {
        Optional<Owner> owner = ownerRepository.findByUserNameAndPassword(
                loginRequest.getUsername(),
                loginRequest.getPassword());
        System.out.println(loginRequest.getUsername());
        System.out.println(loginRequest.getPassword());
        System.out.println(owner);

        LoginResponse response;
        if (owner.isPresent()) {
            response = new LoginResponse(true, "owner", owner.get().getId(), null);
            return ResponseEntity.ok(response);
        } else {
            response = new LoginResponse(false, null, null, "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

}
