package com.rentinel.backend.owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("ownerController2")
@RequestMapping("/api/v1/owners")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    // Get all owners
    @GetMapping
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    // Get owner by ID
    @GetMapping("/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable("id") int id) {
        Optional<Owner> owner = ownerService.getOwnerById(id);
        return owner.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new owner
    @PostMapping
    public ResponseEntity<Owner> createOwner(@RequestBody Owner owner) {
        try {
            Owner createdOwner = ownerService.createOwner(owner);
            return new ResponseEntity<>(createdOwner, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing owner
    @PutMapping("/{id}")
    public ResponseEntity<Owner> updateOwner(@PathVariable("id") int id, @RequestBody Owner owner) {
        Owner updatedOwner = ownerService.updateOwner(id, owner);
        if (updatedOwner == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOwner);
    }

    // Delete owner by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable("id") int id) {
        if (!ownerService.deleteOwner(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
