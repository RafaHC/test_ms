let Sequelize = require("sequelize");
let Database = require("../../config/connection");

//
// ─── MODELO DA TABELA DE FORNECEDORES ──────────────────────────────────────────────
//
let Fornecedores = {
  init: () => {
    const Fornecedores = Database.define("fornecedores", {
      userid: Sequelize.INTEGER,
      cpf_cnpj: Sequelize.STRING,
      descricao: Sequelize.STRING,
      ativo: Sequelize.BOOLEAN,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    return Fornecedores;
  },
};

module.exports = Fornecedores;
