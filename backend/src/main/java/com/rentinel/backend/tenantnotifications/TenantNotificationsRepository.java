package com.rentinel.backend.tenantnotifications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("tenantNotificationsRepository2")
public interface TenantNotificationsRepository extends JpaRepository<TenantNotifications, Integer> {
    // You can add custom queries if needed
    List<TenantNotifications> findByTenant_UserName(String userName);
}
