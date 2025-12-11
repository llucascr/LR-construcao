package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    public Optional<Client> findClientByEmail(String email);
}
