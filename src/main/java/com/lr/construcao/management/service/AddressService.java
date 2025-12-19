package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Address;
import com.lr.construcao.management.model.Condominium;
import com.lr.construcao.management.repository.AddressRepository;
import com.lr.construcao.management.repository.CondominumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.parseObject;
import static com.lr.construcao.management.mapper.ObjectMapper.parsePageObjects;

@RequiredArgsConstructor
@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final CondominumRepository condominumRepository;

    public AddressResponseDTO create(AddressRequestDTO dto) {

        long count = addressRepository.countByFullData(
                dto.getRoad(),
                dto.getNumberAddress(),
                dto.getCondominiumBlock(),
                dto.getCondominiumLot()
        );

        if (count > 0) {
            throw new EntityAlreadyExistExcpetion("This address cannot be registered because it already belongs to a " +
                    "Construction or Drilling ");
        }

        if (dto.getCondominiumBlock() == null || dto.getCondominiumLot() == null) {
            Address address = Address.builder()
                    .road(dto.getRoad())
                    .numberAddress(dto.getNumberAddress())
                    .neighborhood(dto.getNeighborhood())
                    .city(dto.getCity())
                    .cep(dto.getCep())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build();

            return parseObject(addressRepository.save(address), AddressResponseDTO.class);
        }

        Address address = Address.builder()
                .road(dto.getRoad())
                .numberAddress(dto.getNumberAddress())
                .neighborhood(dto.getNeighborhood())
                .city(dto.getCity())
                .cep(dto.getCep())
                .condominium(createCondominium(dto.getCondominiumBlock(), dto.getCondominiumLot()))
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();


        return parseObject(addressRepository.save(address), AddressResponseDTO.class);
    }

    public AddressResponseDTO update(AddressRequestDTO dto, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new DataNotFoundException("Address with id " + addressId + " not found"));

        if (dto.getCondominiumBlock() != null || dto.getCondominiumLot() != null) {

            Condominium condominium = Condominium.builder()
                    .id(address.getCondominium().getId())
                    .block(dto.getCondominiumBlock())
                    .lot(dto.getCondominiumLot())
                    .build();

            address.setCondominium(condominumRepository.save(condominium));

        }

        address.setRoad(dto.getRoad() != null ? dto.getRoad() : address.getRoad());
        address.setNumberAddress(dto.getNumberAddress() != null ? dto.getNumberAddress() : address.getNumberAddress());
        address.setNeighborhood(dto.getNeighborhood() != null ? dto.getNeighborhood() : address.getNeighborhood());
        address.setCity(dto.getCity() != null ? dto.getCity() : address.getCity());
        address.setCep(dto.getCep() != null ? dto.getCep() : address.getCep());

        return parseObject(addressRepository.save(address), AddressResponseDTO.class);
    }

    public Page<AddressResponseDTO> listAll(int page, int numberOfAddress) {
        Pageable pageable = PageRequest.of(page, numberOfAddress);
        Page<Address> addresses = addressRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(addresses, AddressResponseDTO.class), pageable, addresses.getTotalElements());
    }

    private Condominium createCondominium(String block, String lot) {
        if (condominumRepository.findCondominiumByBlockAndLot(block, lot) != null) {
            return condominumRepository.findCondominiumByBlockAndLot(block, lot);
        } // TODO: Pensar melhor nessa solucao


        Condominium condominium = Condominium.builder()
                .block(block)
                .lot(lot)
                .build();

        condominumRepository.save(condominium);
        return condominium;
    }

}
