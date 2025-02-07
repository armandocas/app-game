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

CREATE TABLE cidades_megasena (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_megasena(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

--
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

CREATE TABLE cidades_quina (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_quina(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

-- Tabela principal para os sorteios da Lotomania
CREATE TABLE historico_lotomania (
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
    premios_v6a VARCHAR(255),
    premios_w6a VARCHAR(255),
    premios_v7a VARCHAR(255),
    premios_w7a VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

-- Tabela para as cidades ganhadoras
CREATE TABLE cidades_lotomania (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_lotomania(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

-- Inserir dados na tabela historico_lotomania
INSERT INTO historico_lotomania (
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
    premios_v6a,
    premios_w6a,
    premios_v7a,
    premios_w7a,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    1510, -- sorteio
    '10/12/2014', -- data_do_sorteio
    ARRAY['00', '01', '04', '05', '06', '16', '19', '42', '43', '47', '56', '63', '65', '67', '73', '82', '85', '87', '88', '91'], -- numeros_sorteados
    '7.609.509,86', -- premios_v1a
    '1', -- premios_w1a (agora VARCHAR)
    '25.647,20', -- premios_v2a
    '15', -- premios_w2a (agora VARCHAR)
    '1.687,32', -- premios_v3a
    '228', -- premios_w3a (agora VARCHAR)
    '113,68', -- premios_v4a
    '2115', -- premios_w4a (agora VARCHAR)
    '18,95', -- premios_v5a
    '12684', -- premios_w5a (agora VARCHAR)
    '0,00', -- premios_v6a
    '0', -- premios_w6a (agora VARCHAR)
    '0,00', -- premios_v7a
    '0', -- premios_w7a (agora VARCHAR)
    '13/12/2014', -- data_de_fechamento
    '600.000,00', -- valor_do_proximo_premio
    NOW() -- atualizado_em
);

-- Inserir dados na tabela cidades_lotomania
INSERT INTO cidades_lotomania (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (1510, 'Paulo Afonso', 'BA', 1);

select * from historico_lotomania;
select * from cidades_lotomania;

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
    3662,                                -- sorteio
    '30/01/2025',                        -- data_do_sorteio
    ARRAY['05', '19', '48', '64', '76'], -- numeros_sorteados
    '11.910.397,76',                     -- premios_v1a
    '1',                                 -- premios_w1a
    '3.243,28',                          -- premios_v2a
    '196',                               -- premios_w2a
    '77,09',                             -- premios_v3a
    '7.853',                             -- premios_w3a
    '3,58',                              -- premios_v4a
    '168.999',                           -- premios_w4a
    '31/01/2025',                        -- data_de_fechamento
    '600.000,00',                        -- valor_do_proximo_premio
    NOW()                                -- atualizado_em
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
    ARRAY['07', '13', '25', '45', '59'],  -- Números sorteados
    '2.500.000,00',                        -- Prêmio para 5 acertos
    '2',                                   -- Ganhadores com 5 acertos
    '6.500,00',                            -- Prêmio para 4 acertos
    '154',                                 -- Ganhadores com 4 acertos
    '150,50',                              -- Prêmio para 3 acertos
    '3.689',                               -- Ganhadores com 3 acertos
    '3,00',                                -- Prêmio para 2 acertos
    '76.432',                              -- Ganhadores com 2 acertos
    '28/01/2025',                          -- Data do próximo sorteio
    '3.000.000,00',                        -- Valor estimado para o próximo prêmio
    NOW()                                  -- Atualizado em
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
    1142, -- sorteio
    '2023-01-01', -- data_do_sorteio
    ARRAY['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], -- numeros_sorteados
    '1000', -- premios_v1a
    10, -- premios_w1a
    '500', -- premios_v2a
    5, -- premios_w2a
    '100', -- premios_v3a
    1, -- premios_w3a
    '50', -- premios_v4a
    0, -- premios_w4a
    '10', -- premios_v5a
    0, -- premios_w5a
    '2023-01-02', -- data_de_fechamento
    '2000', -- valor_do_proximo_premio
    NOW() -- atualizado_em
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
    ARRAY['03', '10', '15', '23', '33', '42'], -- Números sorteados
    '28.600.000,00', -- Prêmio faixa 1
    '0', -- Ganhadores faixa 1
    '12.345,67', -- Prêmio faixa 2
    '300', -- Ganhadores faixa 2
    '345,67', -- Prêmio faixa 3
    '8.900', -- Ganhadores faixa 3
    '10/12/2014', -- Data do próximo sorteio
    '33.000.000,00', -- Valor do próximo prêmio
    NOW() -- Atualizado em
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

CREATE TABLE historico_duplasena (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER UNIQUE NOT NULL,
    data_do_sorteio VARCHAR(255),
    numeros_sorteados_a TEXT[], -- Números sorteados no primeiro sorteio
    premios_v1a VARCHAR(255), -- Prêmio para 6 acertos (sorteio A)
    premios_w1a VARCHAR(255), -- Ganhadores para 6 acertos (sorteio A)
    premios_v2a VARCHAR(255), -- Prêmio para 5 acertos (sorteio A)
    premios_w2a VARCHAR(255), -- Ganhadores para 5 acertos (sorteio A)
    premios_v3a VARCHAR(255), -- Prêmio para 4 acertos (sorteio A)
    premios_w3a VARCHAR(255), -- Ganhadores para 4 acertos (sorteio A)
    premios_v4a VARCHAR(255), -- Prêmio para 3 acertos (sorteio A)
    premios_w4a VARCHAR(255), -- Ganhadores para 3 acertos (sorteio A)
    numeros_sorteados_b TEXT[], -- Números sorteados no segundo sorteio
    premios_v1b VARCHAR(255), -- Prêmio para 6 acertos (sorteio B)
    premios_w1b VARCHAR(255), -- Ganhadores para 6 acertos (sorteio B)
    premios_v2b VARCHAR(255), -- Prêmio para 5 acertos (sorteio B)
    premios_w2b VARCHAR(255), -- Ganhadores para 5 acertos (sorteio B)
    premios_v3b VARCHAR(255), -- Prêmio para 4 acertos (sorteio B)
    premios_w3b VARCHAR(255), -- Ganhadores para 4 acertos (sorteio B)
    premios_v4b VARCHAR(255), -- Prêmio para 3 acertos (sorteio B)
    premios_w4b VARCHAR(255), -- Ganhadores para 3 acertos (sorteio B)
    data_de_fechamento VARCHAR(255), -- Data de fechamento do próximo sorteio
    valor_do_proximo_premio VARCHAR(255), -- Valor estimado do próximo prêmio
    atualizado_em TIMESTAMP WITH TIME ZONE -- Timestamp de atualização
);

CREATE TABLE cidades_duplasena (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_duplasena(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

INSERT INTO historico_duplasena (
    sorteio,
    data_do_sorteio,
    numeros_sorteados_a,
    premios_v1a,
    premios_w1a,
    premios_v2a,
    premios_w2a,
    premios_v3a,
    premios_w3a,
    premios_v4a,
    premios_w4a,
    numeros_sorteados_b,
    premios_v1b,
    premios_w1b,
    premios_v2b,
    premios_w2b,
    premios_v3b,
    premios_w3b,
    premios_v4b,
    premios_w4b,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    1339, -- sorteio
    '09/12/2014', -- data_do_sorteio
    ARRAY['21', '24', '26', '33', '34', '36'], -- numeros_sorteados_a
    '0,00', -- premios_v1a
    '0', -- premios_w1a
    '3.037,59', -- premios_v2a
    '61', -- premios_w2a
    '65,65', -- premios_v3a
    '2.688', -- premios_w3a
    '0,00', -- premios_v4a
    '0', -- premios_w4a
    ARRAY['05', '18', '23', '26', '27', '37'], -- numeros_sorteados_b
    '247.057,31', -- premios_v1b
    '1', -- premios_w1b
    '2.850,66', -- premios_v2b
    '65', -- premios_w2b
    '43,06', -- premios_v3b
    '4.098', -- premios_w3b
    '0,00', -- premios_v4b
    '0', -- premios_w4b
    '12/12/2014', -- data_de_fechamento
    '5.000.000,00', -- valor_do_proximo_premio
    NOW() -- atualizado_em
);

INSERT INTO cidades_duplasena (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (1339, 'Campinas', 'SP', 1);

CREATE TABLE historico_timemania (
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
    time_coracao_nome VARCHAR(255),
    time_coracao_valor VARCHAR(255),
    time_coracao_ganhadores VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

CREATE TABLE cidades_timemania (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_timemania(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

INSERT INTO historico_timemania (
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
    time_coracao_nome,
    time_coracao_valor,
    time_coracao_ganhadores,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    662, -- sorteio
    '27/12/2014', -- data_do_sorteio
    ARRAY['11', '27', '28', '32', '34', '41', '60'], -- numeros_sorteados
    '12.206.341,77', -- premios_v1a
    '1', -- premios_w1a
    '87.030,72', -- premios_v2a
    '3', -- premios_w2a
    '1.161,95', -- premios_v3a
    '321', -- premios_w3a
    '6,00', -- premios_v4a
    '7.169', -- premios_w4a
    '2,00', -- premios_v5a
    '73.725', -- premios_w5a
    'csa/al', -- time_coracao_nome
    '5,00', -- time_coracao_valor
    '15.610', -- time_coracao_ganhadores
    '30/12/2014', -- data_de_fechamento
    '650.000,00', -- valor_do_proximo_premio
    NOW() -- atualizado_em
);

INSERT INTO cidades_timemania (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (662, 'Santos', 'SP', 1);

CREATE TABLE historico_diadesorte (
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
    mes_da_sorte_nome VARCHAR(255),
    mes_da_sorte_valor VARCHAR(255),
    mes_da_sorte_ganhadores VARCHAR(255),
    data_de_fechamento VARCHAR(255),
    valor_do_proximo_premio VARCHAR(255),
    atualizado_em TIMESTAMP WITH TIME ZONE
);

CREATE TABLE cidades_diadesorte (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_diadesorte(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

INSERT INTO historico_diadesorte (
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
    mes_da_sorte_nome,
    mes_da_sorte_valor,
    mes_da_sorte_ganhadores,
    data_de_fechamento,
    valor_do_proximo_premio,
    atualizado_em
) VALUES (
    1, -- sorteio
    '14/12/2024', -- data_do_sorteio
    ARRAY['03', '10', '11', '15', '16', '20', '27'], -- numeros_sorteados
    '1.729.358,25', -- premios_v1a
    '1', -- premios_w1a
    '2.108,47', -- premios_v2a
    '88', -- premios_w2a
    '25,00', -- premios_v3a
    '2.853', -- premios_w3a
    '5,00', -- premios_v4a
    '33.221', -- premios_w4a
    'janeiro', -- mes_da_sorte_nome
    '2,50', -- mes_da_sorte_valor
    '100.848', -- mes_da_sorte_ganhadores
    '17/12/2024', -- data_de_fechamento
    '150.000,00', -- valor_do_proximo_premio
    NOW() -- atualizado_em
);

INSERT INTO cidades_diadesorte (
    sorteio,
    cidade,
    estado,
    ganhadores
) VALUES
    (1, 'Canal Eletrônico', 'BR', 1);

CREATE TABLE historico_supersete (
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

CREATE TABLE cidades_supersete (
    id SERIAL PRIMARY KEY,
    sorteio INTEGER REFERENCES historico_supersete(sorteio) ON DELETE CASCADE,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ganhadores INTEGER
);

CREATE TABLE historico_maismilionaria (
  sorteio INTEGER PRIMARY KEY,
  data_do_sorteio VARCHAR(20),
  numeros_sorteados INTEGER[],
  premios_v1a VARCHAR(30),
  premios_w1a VARCHAR(30),
  premios_v2a VARCHAR(30),
  premios_w2a VARCHAR(30),
  premios_v3a VARCHAR(30),
  premios_w3a VARCHAR(30),
  premios_v4a VARCHAR(30),
  premios_w4a VARCHAR(30),
  premios_v5a VARCHAR(30),
  premios_w5a VARCHAR(30),
  premios_v6a VARCHAR(30),
  premios_w6a VARCHAR(30),
  premios_v7a VARCHAR(30),
  premios_w7a VARCHAR(30),
  premios_v8a VARCHAR(30),
  premios_w8a VARCHAR(30),
  premios_v9a VARCHAR(30),
  premios_w9a VARCHAR(30),
  premios_v10a VARCHAR(30),
  premios_w10a VARCHAR(30),
  trevos_trv1 VARCHAR(10),
  trevos_trv2 VARCHAR(10),
  data_de_fechamento VARCHAR(20),
  valor_do_proximo_premio VARCHAR(30),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cidades_maismilionaria (
  id SERIAL PRIMARY KEY,
  sorteio INTEGER REFERENCES historico_maismilionaria(sorteio),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  ganhadores INTEGER
);

select * from historico_maismilionaria;


select * from historico_supersete;
select * from cidades_supersete;

select * from historico_diadesorte;
select * from cidades_diadesorte;


select * from historico_timemania;
select * from cidades_timemania;

select * from historico_duplasena;
select * from cidades_duplasena;


select * from historico_lotofacil;

select * from historico_megasena;
select * from cidades_megasena;


-- DELETES
DELETE FROM cidades_megasena
WHERE sorteio = 1659;

DELETE FROM historico_megasena
WHERE sorteio = 1659;


