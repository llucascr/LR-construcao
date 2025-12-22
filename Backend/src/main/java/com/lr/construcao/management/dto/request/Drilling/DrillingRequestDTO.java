package com.lr.construcao.management.dto.request.Drilling;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DrillingRequestDTO {

    private String name;

    private BigDecimal drillSize;

    private BigInteger depth;

    private BigInteger drillQuatities;

    private BigDecimal priceMeter;

    private Boolean invoice;

    private PaymentsStatus paymentsStatus;

    private LocalDate startDate;

    private LocalDate endDate;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String road;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String numberAddress;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String neighborhood;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String city;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String Cep;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String condominiumBlock;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String condominiumLot;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String ClientName;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    @Email(message = "Email does not exist")
    private String Clientemail;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String ClientPhone;

}
