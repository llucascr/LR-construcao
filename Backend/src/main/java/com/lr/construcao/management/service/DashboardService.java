package com.lr.construcao.management.service;

import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.model.Drilling;
import com.lr.construcao.management.repository.BuildRepository;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.DrillingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
