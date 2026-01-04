package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.response.Drilling.DrillingRecentResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.model.Drilling;
import com.lr.construcao.management.repository.BuildRepository;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.DrillingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class DashboardService {

    private final DrillingRepository drillingRepository;
    private final BuildRepository buildRepository;
    private final ClientRepository clientRepository;

    public Integer getTotalDrillingMonth() {
        return drillingRepository.getTotalDrillingMonth();
    }

    public BigDecimal getMonthlyRevenue() {
        BigDecimal totalValue = BigDecimal.ZERO;
        List<Drilling> drillings = drillingRepository.getMonthlyRevenue(
                LocalDate.now().getMonthValue(),
                LocalDate.now().getYear()
        );

        for (Drilling drilling : drillings) {
            totalValue = totalValue.add(getTotalValue(drilling.getId()));
        }

        return totalValue;
    }

    public BigDecimal getTotalPaidBuildMonth() {
        return buildRepository.getTotalPaidBuildMonth(LocalDate.now().getYear());
    }

    public Integer getTotalClients() {
        return clientRepository.getTotalClients();
    }

    public List<DrillingRecentResponseDTO> findDrillingRecent() {
        Pageable top4 = PageRequest.of(0, 4, Sort.by("startDate").descending());

        return drillingRepository.findAll(top4)
                .map(this::convertToRecentDTO)
                .getContent();
    }

    private DrillingRecentResponseDTO convertToRecentDTO(Drilling entity) {

        return new DrillingRecentResponseDTO(
                entity.getClient().getName(),
                entity.getStartDate(),
                entity.getDepth(),
                getTotalValue(entity.getId()),
                entity.getPaymentsStatus()
        );
    }

    private BigDecimal getTotalValue(Long drillingId) {

        Drilling drilling = drillingRepository.findById(drillingId)
                .orElseThrow(() -> new DataNotFoundException("Drilling with id " + drillingId + " not found"));

        if (drilling.getDrillQuatities() == null || drilling.getDepth() == null || drilling.getPriceMeter() == null) {
            return BigDecimal.ZERO;
        }

        BigInteger totalDepth = drilling.getDrillQuatities().multiply(drilling.getDepth());

        return new BigDecimal(totalDepth).multiply(drilling.getPriceMeter());
    }

}
