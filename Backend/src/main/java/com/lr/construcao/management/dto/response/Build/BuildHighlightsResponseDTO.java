package com.lr.construcao.management.dto.response.Build;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BuildHighlightsResponseDTO {
    private String buildName;
    private String road;
    private String neighborhood;
    private String numberAddress;
    private StatusBuild statusBuild;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal buildCost;
    private Integer progress;
}
