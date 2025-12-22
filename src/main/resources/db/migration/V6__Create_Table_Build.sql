CREATE SEQUENCE build_seq
    START WITH 1 INCREMENT BY 50 NOCACHE NOCYCLE;

CREATE TABLE tb_build (
    id NUMBER(19, 0) DEFAULT build_seq.nextval PRIMARY KEY NOT NULL,
    name VARCHAR2(150) NOT NULL,
    build_size NUMBER(10 ,2) NOT NULL,
    total_paid NUMBER(19, 2) NOT NULL,
    qtd_total_payments NUMBER(19, 0) NOT NULL,
    payments_value NUMBER(19, 2) NOT NULL,
    status VARCHAR2(30 CHAR) NOT NULL,
    start_date DATE DEFAULT SYSTIMESTAMP NOT NULL,
    end_date DATE DEFAULT SYSTIMESTAMP NOT NULL,
    create_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    update_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,

    client_id NUMBER(19, 0) UNIQUE,
    CONSTRAINT fk_build_client_id FOREIGN KEY (client_id) REFERENCES tb_client (id),
    address_id NUMBER(19, 0) UNIQUE,
    CONSTRAINT fk_build_address_id FOREIGN KEY (address_id) REFERENCES tb_address (id),
    user_id NUMBER(19, 0),
    CONSTRAINT fk_build_user_id FOREIGN KEY (user_id) REFERENCES tb_user (id),

    CONSTRAINT chk_build_status CHECK ( status IN ('EM_ESPERA', 'CONSTRUINDO', 'CONCLUIDO') )

);