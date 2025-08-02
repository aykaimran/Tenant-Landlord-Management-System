package com.rentinel.backend.controller;

import com.rentinel.backend.model.RentAssignment;
import com.rentinel.backend.repository.RentAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rentAssignments")
public class RentAssignmentController {

    @Autowired
    private RentAssignmentRepository repository;

    @GetMapping
    public List<RentAssignment> getAll() {
        return repository.findAll();
    }

    @GetMapping("/property/{propertyId}")
    public List<RentAssignment> getByPropertyId(@PathVariable Integer propertyId) {
        return repository.findByPropertyID(propertyId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentAssignment> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RentAssignment create(@RequestBody RentAssignment rentAssignment) {
        return repository.save(rentAssignment);
    }

    // delete by propetty id
    @DeleteMapping("/property/{propertyID}")
    public ResponseEntity<Void> deleteByPropertyID(@PathVariable Integer propertyID) {
        List<RentAssignment> rentAssignments = repository.findByPropertyID(propertyID);
        if (!rentAssignments.isEmpty()) {
            repository.deleteAll(rentAssignments);
        }
        return ResponseEntity.noContent().build();
    }

    // delete by propetty id
    @DeleteMapping("/tenant/{tenantID}")
    public ResponseEntity<Void> deleteByTenantID(@PathVariable Integer tenantID) {
        List<RentAssignment> rentAssignments = repository.findByTenantID(tenantID);
        if (!rentAssignments.isEmpty()) {
            repository.deleteAll(rentAssignments);
        }
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<RentAssignment> updateDates(@PathVariable Integer id,
            @RequestBody RentAssignment updatedRentAssignment) {
        return repository.findById(id)
                .map(existingAssignment -> {
                    existingAssignment.setStartDate(updatedRentAssignment.getStartDate());
                    existingAssignment.setDueDate(updatedRentAssignment.getDueDate());
                    return ResponseEntity.ok(repository.save(existingAssignment));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
