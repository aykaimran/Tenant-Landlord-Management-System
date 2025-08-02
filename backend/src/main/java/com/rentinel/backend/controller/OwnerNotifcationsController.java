package com.rentinel.backend.controller;

import com.rentinel.backend.model.OwnerNotifcations;
import com.rentinel.backend.repository.OwnerNotifcationsRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/ownerNotifcations")
public class OwnerNotifcationsController {

    @Autowired
    private OwnerNotifcationsRepository ownerNotifcationsRepository;

    @GetMapping("/{ownerID}")
    public List<OwnerNotifcations> getNotificationsByOwner(@PathVariable Integer ownerID) {
        return ownerNotifcationsRepository.findByownerID(ownerID);
    }

}
