package com.rentinel.backend.repository;

import com.rentinel.backend.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Integer> {
    boolean existsByUserName(String userName);

    Optional<Tenant> findByUserName(String userName); // Custom query method to find tenant by name

    Optional<Tenant> findByUserNameAndPassword(String userName, String Password);
}
