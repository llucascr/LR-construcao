CREATE SEQUENCE drilling_seq
    START WITH 1 INCREMENT BY 50 NOCACHE NOCYCLE;

CREATE TABLE tb_drilling (
    id NUMBER(19, 0) DEFAULT drilling_seq.nextval PRIMARY KEY NOT NULL,
    name VARCHAR2(150) NOT NULL,
    drill_size NUMBER(10, 2) NOT NULL,
    depth NUMBER(19, 0) NOT NULL,
    drill_quatities NUMBER(19, 0) NOT NULL,
    price_meter NUMBER(19, 2) NOT NULL,
    invoice BOOLEAN NOT NULL,
    payments_status VARCHAR2(30 CHAR) NOT NULL,
    start_date DATE DEFAULT SYSTIMESTAMP NOT NULL,
    end_date DATE DEFAULT SYSTIMESTAMP NOT NULL,
    create_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    update_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,

    client_id NUMBER(19, 0) UNIQUE,
    CONSTRAINT fk_drilling_client_id FOREIGN KEY (client_id) REFERENCES tb_client (id),
    address_id NUMBER(19, 0) UNIQUE,
    CONSTRAINT fk_drilling_address_id FOREIGN KEY (address_id) REFERENCES tb_address (id),
    user_id NUMBER(19, 0),
    CONSTRAINT fk_drilling_user_id FOREIGN KEY (user_id) REFERENCES tb_user (id),

    CONSTRAINT chk_drilling_payments_status CHECK ( payments_status IN ('PAGO', 'NAO_PAGO', 'ATRASADO') )
);