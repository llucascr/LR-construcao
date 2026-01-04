package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Permission findPermissionByDescription(String description);
}
