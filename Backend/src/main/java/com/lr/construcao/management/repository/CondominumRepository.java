package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Condominium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CondominumRepository extends JpaRepository<Condominium, Long> {

    Condominium findCondominiumByBlockAndLot(String block, String lot);
}
