package com.lr.construcao.management.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CondominiumDTO {

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String block;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String lot;

}
