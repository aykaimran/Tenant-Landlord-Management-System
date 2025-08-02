package com.rentinel.backend.tenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
// this is api layer
@RestController("tenantController2")
@RequestMapping(path = "/api/v1/tenant")
public class TenantController {
    private final TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public List<Tenant> getTenant() {
        return tenantService.getTenant();

    }

    @PostMapping
    public void registerNewTenant(@RequestBody Tenant tenant) {
        tenantService.addNewTenant(tenant);
    }

    @PutMapping("/{id}")
    public void updateTenant(@PathVariable("id") int id, @RequestBody Tenant updatedTenant) {
        tenantService.updateTenant(id, updatedTenant);
    }

    @GetMapping("/{id}")
    public Tenant getTenantById(@PathVariable("id") int id) {
        return tenantService.getTenantById(id);
    }

    // Adding Code :
    @GetMapping("/username/{userName}")
    public ResponseEntity<Tenant> getTenantByUsername(@PathVariable String userName) {
        Tenant tenant = tenantService.getTenantByUsername(userName);
        if (tenant != null) {
            return ResponseEntity.ok(tenant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/username/{userName}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable String userName, @RequestBody Tenant updatedTenant) {
        try {
            tenantService.updateTenant(userName, updatedTenant);
            return ResponseEntity.ok(updatedTenant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
