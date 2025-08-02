package com.rentinel.backend.rentassignment;

import com.rentinel.backend.property.Property;
import com.rentinel.backend.tenant.Tenant;
import com.rentinel.backend.owner.Owner;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity(name = "RentAssignment2")
@Table(name = "rentAssignment")
public class RentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int assignmentID;

    @ManyToOne
    @JoinColumn(name = "propertyID", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "tenantID", nullable = false)
    private Tenant tenant;

    // @ManyToOne
    // @JoinColumn(name = "ownerName", nullable = false)
    // private Owner owner; // ownerName -- incorrect
    // ----------------------------------------------------------

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "dueDate", nullable = false)
    private LocalDate dueDate;

    public RentAssignment() {
    }

    public RentAssignment(Property property, Tenant tenant, Owner owner, LocalDate startDate, LocalDate dueDate) {
        this.property = property;
        this.tenant = tenant;
        // this.owner = owner;
        this.startDate = startDate;
        this.dueDate = dueDate;
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

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    // public Owner getOwner() {
    // return owner;
    // }

    // public void setOwner(Owner owner) {
    // this.owner = owner;
    // }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    // Getters and setters...
}
