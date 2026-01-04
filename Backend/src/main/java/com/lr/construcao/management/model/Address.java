package com.lr.construcao.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tb_address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "address_seq_gen")
    @SequenceGenerator(
            name = "address_seq_gen",
            sequenceName = "address_seq",
            allocationSize = 50
    )
    private Long id;

    @Column(nullable = false, length = 150)
    private String road;

    @Column(name = "number_address", length = 20)
    private String numberAddress;

    @Column(length = 150)
    private String neighborhood;

    @Column(length = 100)
    private String city;

    @Column(length = 10)
    @Size(min = 8, message = "The CEP must have at least 8 digits")
    private String cep;

    @Column(name = "create_at", nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "condominium_id", referencedColumnName = "id")
    private Condominium condominium;

}
