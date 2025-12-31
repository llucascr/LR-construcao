CREATE TABLE  tb_user_permission (
    id_user NUMBER(19 ,0) NOT NULL,
    id_permission NUMBER(19, 0) NOT NULL,
    CONSTRAINT pk_user_permission PRIMARY KEY (id_user, id_permission),
    CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES TB_USER (id),
    CONSTRAINT fk_permission FOREIGN KEY (id_permission) REFERENCES TB_PERMISSION (id)
);