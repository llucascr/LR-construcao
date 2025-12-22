package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Drilling;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DrillingRepository extends JpaRepository<Drilling, Long> {

    Optional<Drilling> findDrillingByName(String name);
    
}
