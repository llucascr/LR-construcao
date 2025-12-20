package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Build;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildRepository extends JpaRepository<Build, Long> {

    Optional<Build> findBuildsByName(String name); 
    
}
