package com.lr.construcao.management.model;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
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
@Table(name = "tb_drilling")
public class Drilling {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "drilling_seq_gen")
    @SequenceGenerator(
            name = "drilling_seq_gen",
            sequenceName = "drilling_seq",
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

    @Column(name = "drill_size", nullable = false, precision = 10, scale = 2)
    private BigDecimal drillSize;

    @Column(name = "depth", nullable = false, precision = 19, scale = 0)
    private BigInteger depth;

    @Column(name = "drill_quatities", nullable = false, precision = 19, scale = 0)
    private BigInteger drillQuatities;

    @Column(name = "price_meter", nullable = false, precision = 19, scale = 2)
    private BigDecimal priceMeter;

    @Column(name = "invoice", nullable = false)
    private boolean invoice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payments_status", nullable = false, length = 30)
    private PaymentsStatus paymentsStatus;

    @Column(name = "start_date", nullable = false, updatable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "create_at", nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

}
