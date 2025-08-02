package com.rentinel.backend.tenantnotifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("tenantNotificationController2")
@RequestMapping("/api/notifications")
public class TenantNotificationsController {

    private final TenantNotificationsService tenantNotificationsService;

    @Autowired
    public TenantNotificationsController(TenantNotificationsService tenantNotificationsService) {
        this.tenantNotificationsService = tenantNotificationsService;
    }

    // Get all tenant notifications
    // @GetMapping
    // public List<TenantNotifications> getAllNotifications() {
    // return tenantNotificationsService.getAllNotifications();
    // }

    // Get a specific notification by ID
    @GetMapping("/{notificationID}")
    public ResponseEntity<TenantNotifications> getNotificationById(@PathVariable int notificationID) {
        Optional<TenantNotifications> notification = tenantNotificationsService.getNotificationById(notificationID);
        return notification.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all notifications OR filter by username
    @GetMapping
    public List<TenantNotifications> getNotifications(@RequestParam(required = false) String username) {
        if (username != null) {
            return tenantNotificationsService.getNotificationsByUsername(username);
        } else {
            return tenantNotificationsService.getAllNotifications();
        }
    }

    // Create a new tenant notification
    @PostMapping
    public ResponseEntity<TenantNotifications> createNotification(@RequestBody TenantNotifications notification) {
        TenantNotifications savedNotification = tenantNotificationsService.saveNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    // // Update an existing tenant notification
    // @PutMapping("/{notificationID}")
    // public ResponseEntity<TenantNotifications> updateNotification(@PathVariable
    // int notificationID, @RequestBody TenantNotifications notification) {
    // notification.setNotificationID(notificationID);
    // TenantNotifications updatedNotification =
    // tenantNotificationsService.updateNotification(notification);
    // return ResponseEntity.ok(updatedNotification);
    // }

    // Delete a tenant notification by ID
    @DeleteMapping("/{notificationID}")
    public ResponseEntity<Void> deleteNotification(@PathVariable int notificationID) {
        tenantNotificationsService.deleteNotification(notificationID);
        return ResponseEntity.noContent().build();
    }
}
