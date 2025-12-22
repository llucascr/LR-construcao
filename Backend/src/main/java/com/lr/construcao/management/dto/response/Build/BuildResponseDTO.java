package com.lr.construcao.management.dto.response.Build;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.model.Address;
import com.lr.construcao.management.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BuildResponseDTO {

    private String name;

    private BigDecimal buildSize;

    private BigDecimal totalPaid;

    private BigInteger qtdTotalPayments;

    private BigDecimal paymentsValue;

    private StatusBuild status;

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private AddressResponseDTO address;

    private ClientResponseDTO client;

    private UserResponseDTO user;

}
