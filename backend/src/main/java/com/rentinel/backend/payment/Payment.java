package com.rentinel.backend.payment;

import com.rentinel.backend.owner.Owner;
import com.rentinel.backend.property.*;
import com.rentinel.backend.tenant.*;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity(name = "Payment2")
@Table(name = "Payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentID;

    @Column(length = 20)
    private String paymentStatus;

    @Column(name = "paymentDate", columnDefinition = "DATE")
    private LocalDate paymentDate;

    @Column(nullable = false)
    private int amount;

    @ManyToOne
    @JoinColumn(name = "tenantUserName", referencedColumnName = "userName")
    private Tenant tenant;

    @ManyToOne
    @JoinColumn(name = "ownerUserName", referencedColumnName = "userName")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "propertyID", referencedColumnName = "propertyID", nullable = false)
    private Property property;

    public Payment() {
    }

    public Payment(String paymentStatus, LocalDate paymentDate, int amount, Property property, Owner owner,
            Tenant tenant) {
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.property = property;
        this.owner = owner;
        this.tenant = tenant;
    }

    public int getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(int paymentID) {
        this.paymentID = paymentID;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentID=" + paymentID +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", paymentDate=" + paymentDate +
                ", amount=" + amount +
                ", tenant=" + (tenant != null ? tenant.getUserName() : "null") +
                ", owner=" + (owner != null ? owner.getUserName() : "null") +
                ", propertyID=" + (property != null ? property.getPropertyID() : "null") +
                '}';
    }
}
