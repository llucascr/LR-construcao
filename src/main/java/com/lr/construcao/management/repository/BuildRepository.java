package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Build;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BuildRepository extends JpaRepository<Build, Long> {

    Optional<Build> findBuildsByName(String name);

    @Query(value = """
          SELECT b
          FROM Build b
          WHERE UPPER(b.name) LIKE UPPER(CONCAT('%', :name, '%'))
          """)
    Page<Build> searchByName(@Param("name") String name, Pageable pageable);

    
}
