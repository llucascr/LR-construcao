package com.lr.construcao.management.model;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tb_build")
public class Build {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "build_seq_gen")
    @SequenceGenerator(
            name = "build_seq_gen",
            sequenceName = "build_seq",
            allocationSize = 50
    )
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "build_size", nullable = false, precision = 10, scale = 2)
    private BigDecimal buildSize;

    @Column(name = "total_paid", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalPaid;

    @Column(name = "qtd_total_payments", nullable = false, precision = 19, scale = 0)
    private BigInteger qtdTotalPayments;

    @Column(name = "payments_value", nullable = false, precision = 19, scale = 2)
    private BigDecimal paymentsValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusBuild status;

    @Column(name = "start_date", nullable = false, updatable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "create_at", nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

}
