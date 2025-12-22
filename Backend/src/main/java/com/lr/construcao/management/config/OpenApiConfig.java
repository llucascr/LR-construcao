package com.lr.construcao.management.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("\uD83C\uDFD7\uFE0F Construction & Drilling Management API")
                        .version("v1")
                        .description("Este projeto é uma API Backend desenvolvida para o gerenciamento de empresas de " +
                                "construção civil e perfuração de solo. O sistema centraliza o cadastro de clientes, " +
                                "controle financeiro de obras (construções) e serviços de perfuração, com foco em " +
                                "integridade de dados e flexibilidade de endereçamento.\n" +
                                "A solução foca em cálculos dinâmicos no backend para evitar inconsistência de dados " +
                                "financeiros e uma modelagem de dados normalizada para geolocalização.")
//                        .termsOfService("Termos de serviço")
//                        .license(new License()
//                                .name("APACHE 2.0")
//                                .url("ulr licence")
//                        )
                );
    }

}
