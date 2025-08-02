package com.rentinel.backend.controller;

import com.rentinel.backend.model.Blacklist;
// import com.rentinel.backend.model.Tenant;
import com.rentinel.backend.repository.BlacklistRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/blacklist")
public class BlacklistController {
    @Autowired
    private BlacklistRepository blacklistRepository;

    @GetMapping("/{CNIC}")
    public boolean checkExistence(@PathVariable String CNIC) {
        Optional<Blacklist> obj = blacklistRepository.findById(CNIC);
        if (obj.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    @PostMapping
    public void createBlacklist(@RequestBody Blacklist newEntry) {
        blacklistRepository.save(newEntry);
    }

}
