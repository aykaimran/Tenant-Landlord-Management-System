package com.rentinel.backend.tenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    @Autowired
    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public List<Tenant> getTenant() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(int tenantId) {
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant with ID " + tenantId + " not found"));
    }

    public void addNewTenant(Tenant tenant) {
        Optional<Tenant> tenantOptional = tenantRepository.findByUserName(tenant.getUserName());
        if (tenantOptional.isPresent()) {
            throw new RuntimeException("Username is already taken");
        }

        tenant.setAccountCreationDate(LocalDate.now());
        tenantRepository.save(tenant);
    }

    public void updateTenant(int id, Tenant updatedTenant) {
        Tenant existingTenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        existingTenant.setFullName(updatedTenant.getFullName());
        existingTenant.setEmail(updatedTenant.getEmail());
        existingTenant.setUserName(updatedTenant.getUserName());
        existingTenant.setPassword(updatedTenant.getPassword());
        existingTenant.setCNIC(updatedTenant.getCNIC());

        tenantRepository.save(existingTenant);
    }

    public Tenant getTenantByUsername(String username) {
        return tenantRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Tenant not found with username: " + username));
    }

    public void updateTenant(String userName, Tenant updatedTenant) {
        Tenant existingTenant = tenantRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Tenant not found with username: " + userName));

        // Update tenant details
        existingTenant.setFullName(updatedTenant.getFullName());
        existingTenant.setEmail(updatedTenant.getEmail());
        existingTenant.setCNIC(updatedTenant.getCNIC());
        // Update other fields as necessary

        tenantRepository.save(existingTenant); // Save the updated tenant details
    }

}
