package com.rentinel.backend.controller;

import com.rentinel.backend.model.Admin;
import com.rentinel.backend.model.LoginRequest;
import com.rentinel.backend.model.LoginResponse;
// import com.rentinel.backend.model.Tenant;
import com.rentinel.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminRepository adminRepository;

    @Autowired
    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    // Get an admin by ID
    @GetMapping("/id/{id}")
    public Optional<Admin> getAdminById(@PathVariable Integer id) {
        return adminRepository.findById(id);
    }

    // Get an admin by userName
    @GetMapping("/username/{username}")
    public Admin getAdminByUserName(@PathVariable String username) {
        return adminRepository.findByUserName(username);
    }

    // Get an admin by CNIC
    @GetMapping("/cnic/{cnic}")
    public Admin getAdminByCNIC(@PathVariable String cnic) {
        return adminRepository.findByCnic(cnic);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        Optional<Admin> admin = adminRepository.findByuserNameAndPassword(
                loginRequest.getUsername(),
                loginRequest.getPassword());

        LoginResponse response;
        if (admin.isPresent()) {
            response = new LoginResponse(true, "admin", admin.get().getId(), null);
            return ResponseEntity.ok(response);
        } else {
            response = new LoginResponse(false, null, null, "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }
}
