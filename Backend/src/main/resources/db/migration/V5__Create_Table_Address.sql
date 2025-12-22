CREATE SEQUENCE address_seq
    START WITH 1 INCREMENT BY 50 NOCACHE NOCYCLE;

CREATE TABLE tb_address (
    id NUMBER(19, 0) DEFAULT address_seq.nextval PRIMARY KEY NOT NULL,
    road VARCHAR2(150 CHAR) NOT NULL,
    number_address VARCHAR2(20 CHAR),
    neighborhood VARCHAR2(150 CHAR),
    city VARCHAR2(100 CHAR),
    cep VARCHAR2(10 CHAR),
    create_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    update_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    condominium_id NUMBER(19, 0) UNIQUE,
    CONSTRAINT fk_condominium_id FOREIGN KEY (condominium_id) REFERENCES tb_condominium (id)
);

