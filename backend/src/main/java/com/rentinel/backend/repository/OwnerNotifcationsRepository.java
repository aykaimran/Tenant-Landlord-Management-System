package com.rentinel.backend.repository;

import com.rentinel.backend.model.OwnerNotifcations;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerNotifcationsRepository extends JpaRepository<OwnerNotifcations, Integer> {

    List<OwnerNotifcations> findByownerID(Integer ownerID);
}
