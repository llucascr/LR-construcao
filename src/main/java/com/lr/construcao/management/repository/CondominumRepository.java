package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Condominium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CondominumRepository extends JpaRepository<Condominium, Long> {

    Optional<Condominium> findCondominiumByBlockAndLot(String block, String lot);

}
