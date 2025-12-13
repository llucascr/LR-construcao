package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    public Optional<Client> findClientByEmail(String email);

    @Query(value = """
    SELECT c
    FROM Client c
    WHERE UPPER(c.name) LIKE UPPER(CONCAT('%', :name, '%'))
    """)
    Page<Client> SearchByName(@Param("name") String name, Pageable pageable);
}
