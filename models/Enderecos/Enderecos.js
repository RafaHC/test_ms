let Sequelize = require("sequelize");
let Database = require("../../config/connection");

//
// ─── MODELO DA TABELA DE ENDERECOS ──────────────────────────────────────────────
//
let Enderecos = {
  init: () => {
    const Enderecos = Database.define("enderecos", {
      userid: Sequelize.INTEGER,
      endereco: Sequelize.STRING,
      longitude: Sequelize.INTEGER,
      latitude: Sequelize.INTEGER,
      ativo: Sequelize.BOOLEAN,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    return Enderecos;
  },
};

module.exports = Enderecos;
