package com.lr.construcao.management.dto.request.Email;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequestDTO {
    private String to;
    private String subject;
    private String body;
}
