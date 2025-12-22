package com.lr.construcao.management.dto.response.Build;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatusBuildResponseDTO {

    private String name;
    private StatusBuild status;

}
