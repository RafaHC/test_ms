let Sequelize = require("sequelize");
let Database = require("../../config/connection");
//
// ─── MODELO DA TABELA DE CATEGORIAS ─────────────────────────────────────────────
//
let Categorias = {
  init: () => {
    const Categorias = Database.define("categorias", {
      nome: Sequelize.STRING,
      ativo: Sequelize.BOOLEAN,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    return Categorias;
  },
};

module.exports = Categorias;
