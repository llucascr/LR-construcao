package com.lr.construcao.management.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tb_condominium")
public class Condominium {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "condominium_seq_gen")
    @SequenceGenerator(
            name = "condominium_seq_gen",
            sequenceName = "condominium_seq",
            allocationSize = 50
    )
    private Long id;

    @Column(nullable = false, length = 10)
    private String block;

    @Column(nullable = false, length = 10)
    private String lot;

}
