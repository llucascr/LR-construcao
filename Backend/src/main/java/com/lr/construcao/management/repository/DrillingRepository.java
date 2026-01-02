package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Drilling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DrillingRepository extends JpaRepository<Drilling, Long> {

    Optional<Drilling> findDrillingByName(String name);

    @Query("""
    SELECT COUNT(*) FROM Drilling
        """
    )
    Integer getTotalDrillingMonth();

    @Query("""
        SELECT d FROM Drilling d WHERE MONTH(d.startDate) = :month AND YEAR(d.startDate) = :year
        """)
    List<Drilling> getMonthlyRevenue(@Param("month") int month, @Param("year") int year);
}
