# 🏗️ Construction & Drilling Management API

![Java](https://img.shields.io/badge/Java-17%2B-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![Oracle](https://img.shields.io/badge/Database-Oracle-F80000?logo=oracle&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## 📋 Sobre o Projeto

Este projeto é uma API Backend desenvolvida para o gerenciamento de empresas de construção civil e perfuração de solo. O sistema centraliza o cadastro de clientes, controle financeiro de obras (construções) e serviços de perfuração, com foco em integridade de dados e flexibilidade de endereçamento.

A solução foca em **cálculos dinâmicos no backend** para evitar inconsistência de dados financeiros e uma **modelagem de dados normalizada** para geolocalização.

## 🚀 Tecnologias Utilizadas

* **Linguagem:** Java 17 (ou superior)
* **Framework:** Spring Boot (Web, Data JPA, Validation)
* **Banco de Dados:** Oracle
* **Ferramentas:** Maven, Docker, Swagger

### Diagrama da Aplicação
![Driagrama da aplicação V1](https://github.com/llucascr/LR-construcao/blob/lucas/docs/diagramas/driagrama_LR-construcoes_V1.png)


## 🛠️ Como Executar o Projeto

### Pré-requisitos
* Java JDK 17+
* Maven

### Passos
1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/llucascr/LR-construcao.git
    ou
    git clone git@github.com:llucascr/LR-construcao.git
    ```
2.  **Configure o Banco de Dados:**
    Ajuste o arquivo `src/main/resources/application.properties` com suas credenciais:
    ```properties

    ```
3.  **Execute a aplicação:**
    ```bash
    mvn spring-boot:run
    ```

## ✒️ Autor

**Lucas** - *Desenvolvedor Backend*

---
