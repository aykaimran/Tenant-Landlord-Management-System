package com.rentinel.backend.propertyassignment;

import com.rentinel.backend.property.Property;
import com.rentinel.backend.owner.Owner;
import com.rentinel.backend.tenant.Tenant;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity(name = "PropertyAssignment2")
@Table(name = "propertyAssignment")
public class PropertyAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int assignmentID;

    @ManyToOne
    @JoinColumn(name = "propertyID", nullable = false)
    private Property property; // propertyID -- correct

    @ManyToOne
    @JoinColumn(name = "ownerID", nullable = false)
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "tenantID", nullable = false)
    private Tenant tenant;

    @Column(nullable = false)
    private LocalDate assignmentDate;

    public PropertyAssignment() {
    }

    public PropertyAssignment(Property property, Owner owner, Tenant tenant, LocalDate assignmentDate) {
        this.property = property;
        this.owner = owner;
        this.tenant = tenant;
        this.assignmentDate = assignmentDate;
    }

    public int getAssignmentID() {
        return assignmentID;
    }

    public void setAssignmentID(int assignmentID) {
        this.assignmentID = assignmentID;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public LocalDate getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(LocalDate assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    @Override
    public String toString() {
        return "PropertyAssignment{" +
                "assignmentID=" + assignmentID +
                ", property=" + (property != null ? property.getPropertyID() : "null") +
                ", owner=" + (owner != null ? owner.getUserName() : "null") +
                ", tenant=" + (tenant != null ? tenant.getUserName() : "null") +
                ", assignmentDate=" + assignmentDate +
                '}';
    }
}
