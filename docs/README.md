# 🏗️ LR Construção - Sistema de Gestão para Construção e Perfuração

![Java](https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![Oracle](https://img.shields.io/badge/Database-Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-V1.0%20Finalizado-success?style=for-the-badge)

> **Full Stack Application:** Backend robusto em Java + Frontend moderno em React.

## 📋 Sobre o Projeto
Este projeto é uma API Backend desenvolvida para o gerenciamento de empresas de construção civil e perfuração de solo. O sistema centraliza o cadastro de clientes, controle financeiro de obras (construções) e serviços de perfuração, com foco em integridade de dados e flexibilidade de endereçamento.

### 🌟 Diferenciais Técnicos
* **Consistência Financeira:** Regras de negócio e cálculos monetários executados no Backend para evitar erros de arredondamento ou manipulação no client-side.
* **Modelagem Relacional Complexa:** Banco de dados Oracle normalizado para suportar múltiplos endereços, tipos de serviços e relacionamentos entre entidades.
* **DX & Inovação (Google Antigravity):** O desenvolvimento do Frontend utilizou a nova IDE baseada em agentes de IA da Google, otimizando a criação de componentes e integração com a API.

---

## 🚀 Tecnologias e Arquitetura

### Backend (API REST)
* **Linguagem:** Java 17
* **Framework:** Spring Boot 3 (Web, Data JPA, Validation)
* **Banco de Dados:** Oracle Database (Driver JDBC)
* **Documentação:** Swagger / OpenAPI
* **Build:** Maven

### Frontend (SPA)
* **Library:** React.js
* **Build Tool:** Vite (para alta performance)
* **Estilização:** CSS Modules / Styled Components (ajuste conforme seu uso)
* **Consumo de API:** Fetch API / Axios

### 🏗️ Diagrama de Classes e Arquitetura
A estrutura foi planejada para garantir escalabilidade. Abaixo, o diagrama da versão atual:

![Diagrama da aplicação V2](https://github.com/llucascr/LR-construcao/blob/lucas/docs/diagramas/driagrama_LR-construcoes_V2.png)

---

## ⚙️ Funcionalidades Principais

| Funcionalidade | Descrição Técnica |
| :--- | :--- |
| **Gestão de Clientes** | CRUD completo com validação de CPF/CNPJ e múltiplos endereços. |
| **Controle de Obras** | Associação de obras a clientes com status de andamento e orçamento. |
| **Serviços de Perfuração** | Módulo específico para gerenciamento de perfurações de solo. |
| **Cálculos Automáticos** | O sistema calcula automaticamente totais, impostos e margens no servidor. |

---

## 🛠️ Como Executar o Projeto

Para rodar a aplicação completa, você precisará clonar o repositório e executar tanto o servidor (Backend) quanto o cliente (Frontend).

### 1. Configuração do Backend
Pré-requisitos: Java 17+, Maven, Oracle Database.

```bash
# Clone o repositório
git clone [https://github.com/llucascr/LR-construcao.git](https://github.com/llucascr/LR-construcao.git)
cd LR-construcao
