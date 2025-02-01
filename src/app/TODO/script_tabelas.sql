-- Tabela principal para os sorteios da Lotofácil
CREATE TABLE historico_lotofacil (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER UNIQUE NOT NULL,
    data_do_sorteio VARCHAR(255),
    numeros_sorteados TEXT[],
    premios_v1a VARCHAR(255),
    premios_w1a VARCHAR(255),
    premios_v2a VARCHAR(255),
    premios_w2a VARCHAR(255),
    premios_v3a VARCHAR(255),
    premios_w3a VARCHAR(255),
    premios_v4a VARCHAR(255),
    premios_w4a VARCHAR(255),
    premios_v5a VARCHAR(255),
    premios_w5a VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

-- Tabela para as cidades ganhadoras
CREATE TABLE cidades_lotofacil (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_lotofacil(sorteio),
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER,
    CONSTRAINT fk_sorteio
        FOREIGN KEY(sorteio)
        REFERENCES historico_lotofacil(sorteio)
        ON DELETE CASCADE
);

-- Tabela principal para os sorteios da Megasena
CREATE TABLE historico_megasena (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER UNIQUE NOT NULL,
    data_do_sorteio VARCHAR(255),
    numeros_sorteados TEXT[],
    premios_v1a VARCHAR(255),
    premios_w1a VARCHAR(255),
    premios_v2a VARCHAR(255),
    premios_w2a VARCHAR(255),
    premios_v3a VARCHAR(255),
    premios_w3a VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

-- Tabela para as cidades ganhadoras
CREATE TABLE cidades_megasena (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_megasena(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

-- Tabela principal para os sorteios da Quina
CREATE TABLE historico_quina (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER UNIQUE NOT NULL,
    data_do_sorteio VARCHAR(255),
    numeros_sorteados TEXT[],
    premios_v1a VARCHAR(255),
    premios_w1a VARCHAR(255),
    premios_v2a VARCHAR(255),
    premios_w2a VARCHAR(255),
    premios_v3a VARCHAR(255),
    premios_w3a VARCHAR(255),
    premios_v4a VARCHAR(255),
    premios_w4a VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

-- Tabela para as cidades ganhadoras
CREATE TABLE cidades_quina (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_quina(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

INSERT INTO historico_quina (
    sorteio,
    data_do_sorteio,
    numeros_sorteados,
    premios_v1a,
    premios_w1a,
    premios_v2a,
    premios_w2a,
    premios_v3a,
    premios_w3a,
    premios_v4a,
    premios_w4a,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    3662,                                
    '30/01/2025',                        
    ARRAY['05', '19', '48', '64', '76'], 
    '11.910.397,76',                     
    '1',                                 
    '3.243,28',                          
    '196',                               
    '77,09',                             
    '7.853',                             
    '3,58',                              
    '168.999',                           
    '31/01/2025',                        
    '600.000,00',                        
    NOW()                                
);


INSERT INTO cidades_quina (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (3662, 'São Paulo', 'SP', 1),
    (3662, 'Rio de Janeiro', 'RJ', 2),
    (3662, 'Curitiba', 'PR', 3);


select * from historico_quina;
SELECT * FROM historico_quina ORDER BY sorteio desc;

select * from cidades_quina;

INSERT INTO historico_quina (
    sorteio,
    data_do_sorteio,
    numeros_sorteados,
    premios_v1a,
    premios_w1a,
    premios_v2a,
    premios_w2a,
    premios_v3a,
    premios_w3a,
    premios_v4a,
    premios_w4a,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    3661,
    '25/01/2025',
    ARRAY['07', '13', '25', '45', '59'],  
    '2.500.000,00',                        
    '2',                                   
    '6.500,00',                            
    '154',                                 
    '150,50',                              
    '3.689',                               
    '3,00',                                
    '76.432',                              
    '28/01/2025',                          
    '3.000.000,00',                        
    NOW()                                  
);

INSERT INTO cidades_quina (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (3661, 'Campinas', 'SP', 1),
    (3661, 'Curitiba', 'PR', 1);


-- Índices para melhor performance
CREATE INDEX idx_sorteio_lotofacil ON historico_lotofacil(sorteio);
CREATE INDEX idx_cidade_sorteio_lotofacil ON cidades_lotofacil(sorteio);

INSERT INTO historico_lotofacil (
    sorteio,
    data_do_sorteio,
    numeros_sorteados,
    premios_v1a,
    premios_w1a,
    premios_v2a,
    premios_w2a,
    premios_v3a,
    premios_w3a,
    premios_v4a,
    premios_w4a,
    premios_v5a,
    premios_w5a,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    1142, 
    '2023-01-01', 
    ARRAY['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 
    '1000', 
    10, 
    '500', 
    5, 
    '100', 
    1, 
    '50', 
    0, 
    '10', 
    0, 
    '2023-01-02', 
    '2000', 
    NOW() 
);

INSERT INTO cidades_lotofacil (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (1142, 'São Paulo', 'SP', 1),
    (1142, 'Rio de Janeiro', 'RJ', 2),
    (1142, 'Belo Horizonte', 'MG', 1);

INSERT INTO historico_megasena (
    sorteio,
    data_do_sorteio,
    numeros_sorteados,
    premios_v1a,
    premios_w1a,
    premios_v2a,
    premios_w2a,
    premios_v3a,
    premios_w3a,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    1659,
    '07/12/2014',
    ARRAY['03', '10', '15', '23', '33', '42'], 
    '28.600.000,00', 
    '0', 
    '12.345,67', 
    '300', 
    '345,67', 
    '8.900', 
    '10/12/2014', 
    '33.000.000,00', 
    NOW() 
);

INSERT INTO cidades_megasena (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (1659, 'São Paulo', 'SP', 1),
    (1659, 'Rio de Janeiro', 'RJ', 2),
    (1659, 'Curitiba', 'PR', 3);


select * from historico_lotofacil;

select * from historico_megasena;
select * from cidades_megasena;


-- DELETES
DELETE FROM cidades_megasena
WHERE sorteio = 1659;

DELETE FROM historico_megasena
WHERE sorteio = 1659;