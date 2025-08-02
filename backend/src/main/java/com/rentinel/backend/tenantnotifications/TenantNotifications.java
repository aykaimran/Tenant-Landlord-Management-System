package com.rentinel.backend.tenantnotifications;

import com.rentinel.backend.tenant.Tenant;
// import com.aykaimran.rentinel.property.Property;
import jakarta.persistence.*;

import java.time.LocalDate;

// import java.time.LocalDateTime;
@Entity(name = "TenantNotifications2")
@Table(name = "tenantNotifications")
public class TenantNotifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notificationID;

    @ManyToOne
    @JoinColumn(name = "tenantID", nullable = false)
    private Tenant tenant;

    @Column(length = 30)
    private String subject;

    @Column(nullable = false)
    private LocalDate sentDate;

    @Column(name = "propertyName", length = 50, nullable = false)
    private String propertyName;

    @Column(name = "ownerUserName", length = 30)
    private String fromOwner;

    @Column(length = 255, nullable = false)
    private String content;

    public TenantNotifications() {
    }

    public TenantNotifications(int notificationID, Tenant tenant,
            String subject, LocalDate sentDate, String propertyName, String fromOwner, String content) {
        this.notificationID = notificationID;
        this.tenant = tenant;
        this.subject = subject;
        this.sentDate = sentDate;
        this.propertyName = propertyName;
        this.fromOwner = fromOwner;
        this.content = content;
    }

    public int getNotificationID() {
        return notificationID;
    }

    public void setNotificationID(int notificationID) {
        this.notificationID = notificationID;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDate getSentDate() {
        return sentDate;
    }

    public void setSentDate(LocalDate sentDate) {
        this.sentDate = sentDate;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getFromOwner() {
        return fromOwner;
    }

    public void setFromOwner(String fromOwner) {
        this.fromOwner = fromOwner;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    // constructors, getters, setters...
}
