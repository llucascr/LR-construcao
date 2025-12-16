package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Condominium;
import com.lr.construcao.management.repository.CondominumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class CondominiumService {

    private final CondominumRepository condominumRepository;

    public CondominiumDTO create(CondominiumDTO dto) {
        if (condominumRepository.findCondominiumByBlockAndLot(dto.getBlock(), dto.getLot()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Condominium with block " + dto.getBlock() + " and lot " +
                    dto.getLot() + " already Exist");
        }

        Condominium condominium = Condominium.builder()
                .block(dto.getBlock())
                .lot(dto.getLot())
                .build();

        return parseObject(condominumRepository.save(condominium), CondominiumDTO.class);
    }

}
