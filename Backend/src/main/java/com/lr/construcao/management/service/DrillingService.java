package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.request.Drilling.DrillingRequestDTO;
import com.lr.construcao.management.dto.response.Drilling.DrillingResponseDTO;
import com.lr.construcao.management.dto.response.Drilling.PaymentsStatusResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Address;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.model.Condominium;
import com.lr.construcao.management.model.Drilling;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.DrillingRepository;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class DrillingService {

    private final DrillingRepository drillingRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    private final AddressService addressService;
    private final ClientService clientService;

    public DrillingResponseDTO create(DrillingRequestDTO dto, Long userId) {

        Drilling drilling = Drilling.builder()
                .name(dto.getName())
                .drillSize(dto.getDrillSize())
                .depth(dto.getDepth())
                .drillQuatities(dto.getDrillQuatities())
                .priceMeter(dto.getPriceMeter())
                .invoice(dto.getInvoice())
                .paymentsStatus(PaymentsStatus.NAO_PAGO)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .address(addressService.createRetunrAddress(AddressRequestDTO.builder()
                        .road(dto.getRoad())
                        .numberAddress(dto.getNumberAddress())
                        .neighborhood(dto.getNeighborhood())
                        .city(dto.getCity())
                        .cep(dto.getCep())
                        .condominiumBlock(dto.getCondominiumBlock())
                        .condominiumLot(dto.getCondominiumLot())
                        .build())
                )
                .client(clientService.createReturnClient(ClientRequestDTO.builder()
                        .name(dto.getClientName())
                        .email(dto.getClientemail())
                        .phone(dto.getClientPhone()).build(), userId))
                .user(userRepository.findById(userId)
                        .orElseThrow(() -> new DataNotFoundException("User with id " + userId + "not found")))
                .build();

        return parseObject(drillingRepository.save(drilling), DrillingResponseDTO.class);
    }

    public DrillingResponseDTO update(DrillingRequestDTO dto, Long drillingId) {
        Drilling drilling = drillingRepository.findById(drillingId)
                .orElseThrow(() -> new DataNotFoundException("Drilling with id " + drillingId + " not found"));

        drilling.setName(dto.getName() != null ? dto.getName() : drilling.getName());
        drilling.setDrillSize(dto.getDrillSize() != null ? dto.getDrillSize() : drilling.getDrillSize());
        drilling.setDepth(dto.getDepth() != null ? dto.getDepth() : drilling.getDepth());
        drilling.setDrillQuatities(dto.getDrillQuatities() != null ? dto.getDrillQuatities() : drilling.getDrillQuatities());
        drilling.setPriceMeter(dto.getPriceMeter() != null ? dto.getPriceMeter() : drilling.getPriceMeter());
        drilling.setInvoice(dto.getInvoice() != null ? dto.getInvoice() : drilling.getInvoice());
        drilling.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : drilling.getStartDate());
        drilling.setEndDate(dto.getEndDate() != null ? dto.getEndDate() : drilling.getEndDate());

        if (drilling.getAddress() != null) {
            Address address = drilling.getAddress();
            address.setRoad(dto.getRoad() != null ? dto.getRoad() : address.getRoad());
            address.setNumberAddress(dto.getNumberAddress() != null ? dto.getNumberAddress() : address.getNumberAddress());
            address.setNeighborhood(dto.getNeighborhood() != null ? dto.getNeighborhood() : address.getNeighborhood());
            address.setCity(dto.getCity() != null ? dto.getCity() : address.getCity());
            address.setCep(dto.getCep() != null ? dto.getCep() : address.getCep());

            if (dto.getCondominiumBlock() != null || dto.getCondominiumLot() != null) {
                Condominium condominium = address.getCondominium();
                condominium.setBlock(dto.getCondominiumBlock());
                condominium.setLot(dto.getCondominiumLot());

                address.setCondominium(condominium);
            }
        }

        if (drilling.getClient() != null) {
            Client client = drilling.getClient();
            client.setName(dto.getClientName() != null ? dto.getClientName() : client.getName());
            client.setEmail(dto.getClientemail() != null ? dto.getClientemail() : client.getEmail());
            client.setPhone(dto.getClientPhone() != null ? dto.getClientPhone() : client.getPhone());
        }

        return parseObject(drillingRepository.save(drilling), DrillingResponseDTO.class);
    }

    public PaymentsStatusResponseDTO changeStatus(PaymentsStatus status, Long drillingId) {
        Drilling drilling = drillingRepository.findById(drillingId)
                .orElseThrow(() -> new DataNotFoundException("Drilling with id " + drillingId + " not found"));

        drilling.setPaymentsStatus(status);
        return parseObject(drillingRepository.save(drilling), PaymentsStatusResponseDTO.class);
    }

    public Page<DrillingResponseDTO> findAll(int page, int numberOfDrilling) {
        Pageable pageable = PageRequest.of(page, numberOfDrilling);
        Page<Drilling> drillings = drillingRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(drillings, DrillingResponseDTO.class), pageable, drillings.getTotalElements());
    }

    public Page<DrillingResponseDTO> findPerforationsByClient(int page, int numberOfDrilling, Long clientId) {
        Pageable pageable = PageRequest.of(page, numberOfDrilling);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new DataNotFoundException("Client with id" + clientId + "not found"));

        Page<Drilling> drillings = drillingRepository.findDrillingByClient(client, pageable);
        return new PageImpl<>(parsePageObjects(drillings, DrillingResponseDTO.class), pageable, drillings.getTotalElements());
    }

}
