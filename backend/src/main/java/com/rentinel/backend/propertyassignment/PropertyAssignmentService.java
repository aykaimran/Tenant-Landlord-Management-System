package com.rentinel.backend.propertyassignment;

import com.rentinel.backend.tenant.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyAssignmentService {

    @Autowired
    private PropertyAssignmentRepository repository;

    @Autowired
    private TenantRepository tenantRepository;

    public List<PropertyAssignment> getAllAssignments() {
        return repository.findAll();
    }

    public Optional<PropertyAssignment> getAssignmentById(int id) {
        return repository.findById(id);
    }

    public PropertyAssignment addAssignment(PropertyAssignment assignment) {
        return repository.save(assignment);
    }

    public PropertyAssignment updateAssignment(int id, PropertyAssignment updatedAssignment) {
        return repository.findById(id)
                .map(existingAssignment -> {
                    existingAssignment.setProperty(updatedAssignment.getProperty());
                    existingAssignment.setOwner(updatedAssignment.getOwner());
                    existingAssignment.setTenant(updatedAssignment.getTenant());
                    existingAssignment.setAssignmentDate(updatedAssignment.getAssignmentDate());
                    return repository.save(existingAssignment);
                }).orElse(null);
    }

    public List<PropertyAssignment> getAssignmentsByTenantUsername(String username) {
        Integer tenantID = tenantRepository.findByUserName(username).get().getID();
        return repository.findByTenantID(tenantID);
    }

    public boolean deleteAssignment(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
