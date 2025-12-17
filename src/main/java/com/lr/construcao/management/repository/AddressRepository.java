package com.lr.construcao.management.repository;

import com.lr.construcao.management.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findAddressByRoadAndNumberAddress(String road, String numberAddress);

    @Query(value = """
       SELECT COUNT(*)
       FROM tb_address a
       LEFT JOIN tb_condominium c ON a.condominium_id = c.id
       WHERE a.road = :road
         AND a.number_address = :number
         AND (
             (:block IS NULL AND c.id IS NULL)
             OR
             (c.block = :block AND c.lot = :lot)
         )
    """, nativeQuery = true)
    long countByFullData(
            @Param("road") String road,
            @Param("number") String number,
            @Param("block") String block,
            @Param("lot") String lot
    );

}
