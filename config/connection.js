let Sequelize = require("sequelize");
let pg = require("pg");
pg.defaults.ssl = true;

//
// ─── CONFIGURANDO A CONEXAO DO POSTGREE ─────────────────────────────────────────
//
const connection = new Sequelize({
  database: "d6ig8rn8oluv9q",
  username: "ulozobsjczwknf",
  password: "7ee053cb4616510a3ec455765d1d8233ea1a0f86c103f7cf26d3682e6e58544e",
  host: "ec2-54-197-48-79.compute-1.amazonaws.com",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  },
});

//
// ─── AUTENTICANDO A CONEXAO COM O POSTGREE ──────────────────────────────────────
//
connection
  .authenticate()
  .then(() => console.log("Conexao estabelecida"))
  .catch((err) => console.log("Ocorreu um erro " + err))
  .done();
module.exports = connection;
