ALTER TABLE tb_client
ADD user_id NUMBER(19);

ALTER TABLE tb_client
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id)
REFERENCES tb_user (id);

CREATE INDEX idx_client_user_id
ON tb_client (user_id);