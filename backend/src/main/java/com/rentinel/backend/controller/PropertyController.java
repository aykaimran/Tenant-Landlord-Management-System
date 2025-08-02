package com.rentinel.backend.controller;

import com.rentinel.backend.model.AreaCount;
import com.rentinel.backend.model.Property;
// import com.rentinel.backend.repository.OwnerRepository;
import com.rentinel.backend.repository.PaymentRepository;
import com.rentinel.backend.repository.PropertyAssignmentRepository;
import com.rentinel.backend.repository.PropertyRepository;
import com.rentinel.backend.repository.RentAssignmentRepository;
import com.rentinel.backend.repository.OwnerRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/properties")
public class PropertyController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RentAssignmentRepository rentAssignmentRepository;

    @Autowired
    private PropertyAssignmentRepository propertyAssignmentRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    // GET /properties
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // GET /properties/{propertyID} - Fetch a single property by its propertyID
    @GetMapping("/{propertyID}")
    public Property getPropertyById(@PathVariable Integer propertyID) {
        Optional<Property> property = propertyRepository.findById(propertyID);
        if (property.isPresent()) {
            return property.get();
        } else {
            throw new RuntimeException("Property not found with id " + propertyID);
        }
    }

    // DELETE /properties/{propertyID}
    @DeleteMapping("/{propertyID}")
    public void deleteProperty(@PathVariable Integer propertyID) {
        propertyRepository.deleteById(propertyID);
    }

    // PUT /properties/{propertyID}
    @PutMapping("/{propertyID}")
    public Property updateProperty(@PathVariable Integer propertyID, @RequestBody Property updatedProperty) {
        return propertyRepository.findById(propertyID)
                .map(property -> {
                    property.setPropertyName(updatedProperty.getPropertyName());
                    property.setLocation(updatedProperty.getLocation());
                    property.setFixedRent(updatedProperty.getFixedRent());
                    property.setOwnerName(updatedProperty.getOwnerName());
                    property.setTenantName(updatedProperty.getTenantName());
                    property.setNumOfBedRooms(updatedProperty.getNumOfBedRooms());
                    property.setNumOfRooms(updatedProperty.getNumOfRooms());
                    property.setNumOfBaths(updatedProperty.getNumOfBaths());
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new RuntimeException("Property not found with id " + propertyID));
    }

    // GET /properties/owner/{ownerID} - Fetch properties by ownerID
    @GetMapping("/owner/{ownerName}")
    public List<Property> getPropertiesByOwnerName(@PathVariable String ownerName) {
        return propertyRepository.findByOwnerName(ownerName);
    }

    @GetMapping("/count/by-owner/{ownerID}")
    public long getPropertiesByOwnerID(@PathVariable Integer ownerID) {
        String ownerName = ownerRepository.findById(ownerID).get().getUserName();
        return propertyRepository.countByOwnerName(ownerName);
    }

    @GetMapping("/count")
    public long getPropertyCount() {
        return propertyRepository.count();
    }

    @GetMapping("/averageRent")
    public Double getAverageRent() {
        return propertyRepository.getAverageRent();
    }

    @GetMapping("/averageRent/by-owner/{ownerID}")
    public Double getAverageRentByOwner(@PathVariable Integer ownerID) {
        String ownerName = ownerRepository.findById(ownerID).get().getUserName();
        return propertyRepository.getAverageRentByOwnerName(ownerName);
    }

    @GetMapping("/occupancyRate")
    public Double getOccupancyRate() {
        return propertyRepository.getOccupancyRate();
    }

    @GetMapping("/occupancyRate/by-owner/{ownerID}")
    public Double getOccupancyRate(@PathVariable Integer ownerID) {
        String ownerName = ownerRepository.findById(ownerID).get().getUserName();
        return propertyRepository.getOccupancyRateByOwner(ownerName);
    }

    @GetMapping("/rentedProperties/by-owner/{ownerID}")
    public Double getRentedProperties(@PathVariable Integer ownerID) {
        String ownerName = ownerRepository.findById(ownerID).get().getUserName();
        return propertyRepository.getRentedPropertiesByOwner(ownerName);
    }

    @GetMapping("/areacount")
    public List<AreaCount> getAreaCount() {
        return propertyRepository.getAreaCount()
                .stream()
                .map(row -> new AreaCount((String) row[0], ((Number) row[1]).intValue()))
                .collect(Collectors.toList());
    }

    @GetMapping("/areacount/owner/{ownerID}")
    public List<AreaCount> getAreaCount(@PathVariable Integer ownerID) {
        String ownerName = ownerRepository.findById(ownerID).get().getUserName();
        return propertyRepository.getAreaCountByOwner(ownerName)
                .stream()
                .map(row -> new AreaCount((String) row[0], ((Number) row[1]).intValue()))
                .collect(Collectors.toList());
    }

    // create new property at /properties
    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property newProperty) {
        try {
            System.out.println(newProperty);
            Property savedProperty = propertyRepository.save(newProperty);
            return new ResponseEntity<>(savedProperty, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/properties/deleteall/{propertyID}")
    @Transactional
    public ResponseEntity<Void> deletePropertyAndDependencies(@PathVariable Integer propertyID) {
        // Delete all dependencies
        rentAssignmentRepository.deleteAllByPropertyID(propertyID);
        propertyAssignmentRepository.deleteByPropertyID(propertyID);
        paymentRepository.deletePaymentsForProperty(propertyID);

        // Finally delete the property
        propertyRepository.deleteById(propertyID);

        return ResponseEntity.noContent().build();
    }
}
