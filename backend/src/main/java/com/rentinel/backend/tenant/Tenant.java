package com.rentinel.backend.tenant;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity(name = "Tenant2")
@Table(name = "Tenant")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @Column(nullable = false, length = 50)
    private String fullName;

    @Column(nullable = false, length = 50, unique = true)
    private String userName;

    @Column(nullable = false, length = 30)
    private String Password;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 13)
    private String CNIC;

    @Column(nullable = false)
    private LocalDate accountCreationDate;

    public Tenant(int ID, String fullName, String email, String userName, String Password, String CNIC,
            LocalDate accountCreationDate) {
        this.ID = ID;
        this.fullName = fullName;
        this.email = email;
        this.userName = userName;
        this.Password = Password;
        this.CNIC = CNIC;
        this.accountCreationDate = accountCreationDate;
    }

    public Tenant() {
        this.accountCreationDate = LocalDate.now();
    }

    public Tenant(String fullName, String email, String userName, String Password, String CNIC) {
        this.fullName = fullName;
        this.email = email;
        this.userName = userName;
        this.Password = Password;
        this.CNIC = CNIC;
        this.accountCreationDate = LocalDate.now();
    }

    // Getters and setters
    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCNIC() {
        return CNIC;
    }

    public void setCNIC(String CNIC) {
        this.CNIC = CNIC;
    }

    public LocalDate getAccountCreationDate() {
        return accountCreationDate;
    }

    public void setAccountCreationDate(LocalDate accountCreationDate) {
        this.accountCreationDate = accountCreationDate;
    }

    @Override
    public String toString() {
        return "Tenant{" +
                "ID=" + ID +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", userName='" + userName + '\'' +
                ", Password='" + Password + '\'' +
                ", CNIC='" + CNIC + '\'' +
                ", accountCreationDate=" + accountCreationDate +
                '}';
    }
}
