package com.rentinel.backend.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("tenantRepository2")
public interface TenantRepository extends JpaRepository<Tenant, Integer> {

    Optional<Tenant> findByUserName(String username);
}
