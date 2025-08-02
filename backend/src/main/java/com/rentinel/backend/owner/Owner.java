package com.rentinel.backend.owner;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity(name = "Owner2")
@Table(name = "Owner")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @Column(nullable = false, length = 50)
    private String fullName;

    @Column(nullable = false, unique = true, length = 50)
    private String userName;

    @Column(nullable = false, length = 30)
    private String Password;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 13)
    private String CNIC;

    @Column(nullable = false)
    private LocalDate accountCreationDate = LocalDate.now(); // auto-set date

    public Owner() {
    }

    public Owner(String fullName, String userName, String password, String email, String CNIC) {
        this.fullName = fullName;
        this.userName = userName;
        this.Password = password;
        this.email = email;
        this.CNIC = CNIC;
        this.accountCreationDate = LocalDate.now();
    }

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
        this.Password = password;
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
        return "Owner{" +
                "ID=" + ID +
                ", fullName='" + fullName + '\'' +
                ", userName='" + userName + '\'' +
                ", Password='" + Password + '\'' +
                ", email='" + email + '\'' +
                ", CNIC='" + CNIC + '\'' +
                ", accountCreationDate=" + accountCreationDate +
                '}';
    }
}
