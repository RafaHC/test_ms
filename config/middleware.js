let jwt = require("jsonwebtoken");
const config = require("./config.js");
const armazenador = require("./redis");
const util = require("../helper/util");

//
// ─── VERIFICACAO SE O TOKEN E VALIDO E RENOVACAO EM CASO DE EXPIRACAO ─────────────
//
let checkToken = async (req, res, next) => {
  let token = retornarToken(req);
  res.newToken = null;
  //
  // CHAMADA PARA VERIFICAR SE HA TOKEN ARMAZENADO NO REDIS
  //
  armazenador
    .pegarArmazenamentoToken(token)
    .then(async (data) => {
      console.log("TOKEN ==>", token == data.token);
      if (token == data.token) {
        req.userId = data.id;
        verificarToken(token)
          .then((result) => {
            if (result == false) {
              return res.status(200).json(
                util.retornarPayload(null, "Token inválido", [
                  {
                    location: "middleware",
                    param: "token",
                    msg: "Token inválido",
                  },
                ])
              );
            } else {
              req.decoded = result;
              console.log("DECODED ==>", req.decoded);
              next();
            }
          })
          .catch(async (err) => {
            if (err.name === "TokenExpiredError") {
              res.newToken = await criarToken(data.id, res, token);
              res.setHeader("newToken", res.newToken);
              next();
            } else {
              return res.status(200).json(
                util.retornarPayload(
                  null,
                  "Ocorreu um erro em verificar o token",
                  [
                    {
                      location: "middleware",
                      param: "token",
                      msg: "Ocorreu um erro em verificar o token",
                    },
                  ]
                )
              );
            }
          });
      } else {
        return res.status(200).json(
          util.retornarPayload(null, "Auth token is not supplied", [
            {
              location: "middleware",
              param: "autenticacao",
              msg: "Auth token is not supplied",
            },
          ])
        );
      }
    })
    .catch((err) =>
      res.status(200).json(
        util.retornarPayload(null, "Ocorreu um erro ao recuperar o token!", [
          {
            location: "middleware",
            param: "autenticacao",
            msg: "Ocorreu um erro ao recuperar o token!",
          },
        ])
      )
    );
};

//
// ─── CRIACAO DO TOKEN COM BASE NO ID DO USUARIO ─────────────────────────────────
//
let criarToken = async (id, res, tokenAntigo) => {
  let token = jwt.sign({ usuario: id }, config.secret, {
    expiresIn: "60s",
  });
  if (tokenAntigo !== null) {
    await armazenador.deletarToken(tokenAntigo);
  }
  console.log("Token Criado!", token);
  await armazenador.criarArmazenamentoToken(id, token, res);
  return token;
};

//
// ─── RETORNANDO O TOKEN SEM O BEARER ────────────────────────────────────────────
//
let retornarToken = (req) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  return token;
};

//
// ─── VERIFICANDO SE O TOKEN E VALIDO ────────────────────────────────────────────
//
let verificarToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  checkToken: checkToken,
  criarToken: criarToken,
};
