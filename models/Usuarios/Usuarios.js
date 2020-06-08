let Sequelize = require("sequelize");
let Database = require("../../config/connection");
let Fornecedores = require("./../Fornecedores/Fornecedores").init();
let Enderecos = require("./../Enderecos/Enderecos").init();
//
// ─── MODELO DA TABELA DE USUARIOS ───────────────────────────────────────────────
//
let Usuarios = {
  init: () => {
    const Usuarios = Database.define("usuarios", {
      nome: Sequelize.STRING,
      sobrenome: Sequelize.STRING,
      email: Sequelize.STRING,
      cpf: Sequelize.STRING,
      celular: Sequelize.STRING,
      senha: Sequelize.STRING,
      tipoUsuario: Sequelize.INTEGER,
      autorizado: Sequelize.INTEGER,
      ativo: Sequelize.BOOLEAN,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    Usuarios.hasOne(Fornecedores, { foreignKey: "userid", as: "fornecedor" });
    Usuarios.hasMany(Enderecos, { foreignKey: "userid", as: "enderecos" });
    return Usuarios;
  },
};

module.exports = Usuarios;
