package com.rentinel.backend.controller;

import com.rentinel.backend.model.LoginRequest;
import com.rentinel.backend.model.LoginResponse;
import com.rentinel.backend.model.Tenant;
import com.rentinel.backend.repository.PropertyAssignmentRepository;
import com.rentinel.backend.repository.RentAssignmentRepository;
import com.rentinel.backend.repository.TenantRepository;

// import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tenants")
public class TenantController {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RentAssignmentRepository rentAssignmentRepository;
    @Autowired
    private PropertyAssignmentRepository propertyAssignmentRepository;

    // GET /api/owners
    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    // GET /tenants/checkUsername?username={username} - Check if the username exists
    @GetMapping("/checkUsername/{userName}")
    public boolean checkTenantUsername(@PathVariable String userName) {
        return tenantRepository.existsByUserName(userName);
    }

    // POST /tenants - Register a new tenant
    @PostMapping
    public Tenant registerTenant(@RequestBody Tenant tenant) {
        System.out.println(tenant);
        return tenantRepository.save(tenant);
    }

    // DELETE /tenants/{id}
    @DeleteMapping("/{id}")
    public void deleteTenant(@PathVariable Integer id) {
        rentAssignmentRepository.deleteAllByTenantID(id);
        propertyAssignmentRepository.deleteAllByTenantID(id);
        tenantRepository.deleteById(id);
    }

    // GET /tenants/id/{name} - Fetch tenant ID by name
    @GetMapping("/id/{userName}")
    public Integer getTenantIdByName(@PathVariable String userName) {
        Optional<Tenant> tenant = tenantRepository.findByUserName(userName);
        if (tenant.isPresent()) {
            return tenant.get().getID(); // Return the tenant ID
        } else {
            throw new RuntimeException("Tenant not found with name " + userName);
        }
    }

    @GetMapping("/userName/{ID}")
    public Optional<Tenant> getTenant(@PathVariable Integer ID) {
        Optional<Tenant> tenant = tenantRepository.findById(ID);
        return tenant;
    }

    // PUT /tenants/{id} - Update tenant details
    @PutMapping("/{id}")
    public Tenant updateTenant(@PathVariable Integer id, @RequestBody Tenant tenantDetails) {
        Optional<Tenant> tenant = tenantRepository.findById(id);

        if (!tenant.isPresent()) {
            throw new RuntimeException("Tenant not found with ID " + id);
        }

        Tenant existingTenant = tenant.get();

        // Update the tenant details, skipping password update for security reasons
        existingTenant.setFullName(tenantDetails.getFullName());
        existingTenant.setUserName(tenantDetails.getUserName());
        existingTenant.setEmail(tenantDetails.getEmail());
        existingTenant.setCnic(tenantDetails.getCnic());
        return tenantRepository.save(existingTenant);
    }

    @GetMapping("/count")
    public long gettenantCount() {
        return tenantRepository.count();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginTenant(@RequestBody LoginRequest loginRequest) {
        Optional<Tenant> tenant = tenantRepository.findByUserNameAndPassword(
                loginRequest.getUsername(),
                loginRequest.getPassword());

        LoginResponse response;
        if (tenant.isPresent()) {
            response = new LoginResponse(true, "tenant", tenant.get().getID(), null);
            return ResponseEntity.ok(response);
        } else {
            response = new LoginResponse(false, null, null, "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/count/by-owner/{ownerId}")
    public long getTenantCountByOwner(@PathVariable Integer ownerId) {
        return propertyAssignmentRepository.countDistinctTenantIDByOwnerID(ownerId);
    }

}
