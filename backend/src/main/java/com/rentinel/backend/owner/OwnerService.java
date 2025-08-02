package com.rentinel.backend.owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    // Get all owners
    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    // Get owner by ID
    public Optional<Owner> getOwnerById(int id) {
        return ownerRepository.findById(id);
    }

    // Create a new owner
    public Owner createOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    // Update an existing owner
    public Owner updateOwner(int id, Owner owner) {
        if (!ownerRepository.existsById(id)) {
            return null; // Owner not found
        }
        owner.setID(id); // Ensure the ID remains unchanged
        return ownerRepository.save(owner);
    }

    // Delete an owner by ID
    public boolean deleteOwner(int id) {
        if (!ownerRepository.existsById(id)) {
            return false; // Owner not found
        }
        ownerRepository.deleteById(id);
        return true;
    }
}
