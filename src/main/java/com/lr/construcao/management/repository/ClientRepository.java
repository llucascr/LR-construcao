package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> { }
