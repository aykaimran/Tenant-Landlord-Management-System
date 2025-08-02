package com.rentinel.backend.repository;

// import com.rentinel.backend.model.Owner;
import com.rentinel.backend.model.Blacklist;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistRepository extends JpaRepository<Blacklist, String> {

}
