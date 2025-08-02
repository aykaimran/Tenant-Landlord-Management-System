package com.rentinel.backend.propertyassignment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("propertyAssignmentController2")
@RequestMapping("/api/property-assignments")
public class PropertyAssignmentController {

    @Autowired
    private PropertyAssignmentService service;

    @GetMapping
    public List<PropertyAssignment> getAllAssignments() {
        return service.getAllAssignments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyAssignment> getAssignmentById(@PathVariable int id) {
        return service.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyAssignment> addAssignment(@RequestBody PropertyAssignment assignment) {
        return ResponseEntity.ok(service.addAssignment(assignment));
    }

    @GetMapping("/tenant")
    public List<PropertyAssignment> getAssignmentsByTenantUsername(@RequestParam String username) {
        return service.getAssignmentsByTenantUsername(username);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyAssignment> updateAssignment(@PathVariable int id,
            @RequestBody PropertyAssignment updatedAssignment) {
        PropertyAssignment result = service.updateAssignment(id, updatedAssignment);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable int id) {
        if (service.deleteAssignment(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
