let Sequelize = require("sequelize");
let Database = require("../../config/connection");

//
// ─── MODELO DA TABELA DE SERVICOS ───────────────────────────────────────────────
//
let Servicos = {
  init: () => {
    const Servicos = Database.define("servicos", {
      fornecedorid: Sequelize.INTEGER,
      categoriaid: Sequelize.INTEGER,
      nome: Sequelize.STRING,
      valor: Sequelize.DECIMAL,
      ativo: Sequelize.BOOLEAN,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    return Servicos;
  },
};

module.exports = Servicos;
