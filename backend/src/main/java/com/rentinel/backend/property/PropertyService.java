package com.rentinel.backend.property;

// import com.aykaimran.rentinel.owner.Owner;
// import com.aykaimran.rentinel.tenant.Tenant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    // Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Get property by ID
    public Optional<Property> getPropertyById(int id) {
        return propertyRepository.findById(id);
    }

    // Create a new property
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    // Update an existing property
    public Property updateProperty(int id, Property property) {
        if (!propertyRepository.existsById(id)) {
            return null; // Property not found
        }
        property.setPropertyID(id); // Ensure the ID remains unchanged
        return propertyRepository.save(property);
    }

    // Delete a property
    public boolean deleteProperty(int id) {
        if (!propertyRepository.existsById(id)) {
            return false; // Property not found
        }
        propertyRepository.deleteById(id);
        return true;
    }
}
