-- USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PERFIS (Pessoal, Empresa)
CREATE TABLE perfis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTAS BANCÁRIAS
CREATE TABLE contas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    banco VARCHAR(100),
    agencia VARCHAR(20),
    conta VARCHAR(20),
    saldo DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- CARTÕES
CREATE TABLE cartoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    nome VARCHAR(100),
    limite DECIMAL(15,2),
    tipo ENUM('pessoal','empresarial') NOT NULL,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- CATEGORIAS
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('receita','despesa') NOT NULL,
    perfil_id INT NULL,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- MOVIMENTAÇÕES
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    conta_id INT NULL,
    cartao_id INT NULL,
    categoria_id INT NOT NULL,
    data DATE NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo ENUM('receita','despesa') NOT NULL,
    descricao VARCHAR(255),
    pago_com_perfil_id INT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id),
    FOREIGN KEY (conta_id) REFERENCES contas(id),
    FOREIGN KEY (cartao_id) REFERENCES cartoes(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (pago_com_perfil_id) REFERENCES perfis(id)
);

-- AJUSTES AUTOMÁTICOS
CREATE TABLE ajustes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origem_perfil_id INT NOT NULL,
    destino_perfil_id INT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    descricao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (origem_perfil_id) REFERENCES perfis(id),
    FOREIGN KEY (destino_perfil_id) REFERENCES perfis(id)
);
