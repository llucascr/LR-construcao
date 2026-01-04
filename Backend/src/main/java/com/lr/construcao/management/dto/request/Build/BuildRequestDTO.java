package com.lr.construcao.management.dto.request.Build;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BuildRequestDTO {

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String name;

    private BigDecimal buildSize;

    private BigDecimal totalPaid;

    private BigDecimal buildCost;

    private LocalDate startDate;

    private LocalDate endDate;

    private String road;

    private String numberAddress;

    private String neighborhood;

    private String city;

    private String Cep;

    private String condominiumBlock;

    private String condominiumLot;

    private String ClientName;

    @Email(message = "Email does not exist")
    private String Clientemail;

    private String ClientPhone;

}
