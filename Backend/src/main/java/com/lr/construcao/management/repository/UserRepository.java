package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(String email);

    @Transactional
    @Modifying
    @Query(value = """
    UPDATE User u SET u.active = FALSE WHERE u.id = :userId
    """)
    void disable(@Param("userId") Long userId);

    @Query("""
    SELECT u FROM User u WHERE u.email = :email
    """)
    User findByEmail(@Param("email") String email);

    Optional<User> findOpUserByEmail(String email);

}
