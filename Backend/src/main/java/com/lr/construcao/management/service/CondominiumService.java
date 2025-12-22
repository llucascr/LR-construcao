package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Condominium;
import com.lr.construcao.management.repository.CondominumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class CondominiumService {

    private final CondominumRepository condominumRepository;

//    public CondominiumDTO create(CondominiumDTO dto) {
//        if (condominumRepository.findCondominiumByBlockAndLot(dto.getBlock(), dto.getLot()).isPresent()) {
//            throw new EntityAlreadyExistExcpetion("Condominium with block " + dto.getBlock() + " and lot " +
//                    dto.getLot() + " already Exist");
//        }
//
//        Condominium condominium = Condominium.builder()
//                .block(dto.getBlock())
//                .lot(dto.getLot())
//                .build();
//
//        return parseObject(condominumRepository.save(condominium), CondominiumDTO.class);
//    }

    public CondominiumDTO update(CondominiumDTO dto, Long condominiumId) {
        Condominium condominium = condominumRepository.findById(condominiumId)
                .orElseThrow(() -> new DataNotFoundException("condominium with block " + dto.getBlock() +
                        " and lot " + dto.getLot() + " not found"));

        condominium.setBlock(dto.getBlock() != null ? dto.getBlock() : condominium.getBlock());
        condominium.setLot(dto.getLot() != null ? dto.getLot() : condominium.getLot());

        return parseObject(condominumRepository.save(condominium), CondominiumDTO.class);
    }

    public DeleteResponseDTO delete(Long condominiumId) {
        Condominium condominium = condominumRepository.findById(condominiumId)
                .orElseThrow(() -> new DataNotFoundException("condominium with id " + condominiumId + " not found"));

        condominumRepository.delete(condominium);
        return new DeleteResponseDTO(
                LocalDateTime.now(),
                "The condominium with block " + condominium.getBlock() +  " and lot " + condominium.getLot()
                        + " was deleted!"
        );
    }

    public CondominiumDTO findById(Long condominiumId) {
        Condominium condominium = condominumRepository.findById(condominiumId)
                .orElseThrow(() -> new DataNotFoundException("condominium with id " + condominiumId + " not found"));

        return parseObject(condominium, CondominiumDTO.class);
    }

}
