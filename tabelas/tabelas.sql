-- public.usuarios definition

-- Drop table

-- DROP TABLE public.usuarios;

CREATE TABLE public.usuarios (
	id serial NOT NULL,
	nome varchar(120) NOT NULL,
	sobrenome varchar(60) NOT NULL,
	email varchar(60) NULL,
	celular varchar(14) NOT NULL,
	senha varchar(60) NOT NULL,
	tipoUsuario int4 NOT NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	ativo bool NOT NULL,
	CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);

CREATE TABLE public.enderecos (
	id serial NOT NULL,
	userid int4 NOT NULL,
    longitude int8 NOT NULL,
	latitude int8 NOT NULL,
	endereco varchar(240) NOT NULL,
    ativo bool NOT NULL,
	CONSTRAINT enderecos_pkey PRIMARY KEY (id)
);


-- public.enderecos foreign keys

ALTER TABLE public.enderecos ADD CONSTRAINT enderecos_userid_fkey FOREIGN KEY (userid) REFERENCES usuarios(id);

CREATE TABLE public.categorias (
	id serial NOT NULL,
	nome varchar(20) NOT NULL,
	ativo bool NOT NULL,
	CONSTRAINT categorias_pkey PRIMARY KEY (id)
);

CREATE TABLE public.fornecedores (
	id serial NOT NULL,
	userid int4 NOT NULL,
	cpf_cnpj varchar(14) NOT NULL,
	descricao varchar(420) NOT NULL,
	ativo bool NOT NULL,
	CONSTRAINT fornecedores_pkey PRIMARY KEY (id)
);


-- public.fornecedores foreign keys

ALTER TABLE public.fornecedores ADD CONSTRAINT fornecedores_userid_fkey FOREIGN KEY (userid) REFERENCES usuarios(id);


CREATE TABLE public.servicos (
	id serial NOT NULL,
	fornecedorid int4 NOT NULL,
	categoriaid int4 NOT NULL,
	nome varchar(20) NOT NULL,
	valor numeric(10,2) NOT NULL,
	ativo bool NOT NULL,
	CONSTRAINT servicos_pkey PRIMARY KEY (id)
);


-- public.servicos foreign keys

ALTER TABLE public.servicos ADD CONSTRAINT servicos_categoriaid_fkey FOREIGN KEY (categoriaid) REFERENCES categorias(id);
ALTER TABLE public.servicos ADD CONSTRAINT servicos_fornecedorid_fkey FOREIGN KEY (fornecedorid) REFERENCES fornecedores(id);