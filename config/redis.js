const redis = require("redis");
const client = redis.createClient(
  "redis://h:p6c4afe3e8358fab3701b54c99f28905f8ed6199878bc8897dceaad80f7574373@ec2-52-22-198-76.compute-1.amazonaws.com:21339"
);

client.on("error", function (error) {
  console.error(error);
});

let redisCommands = {
  //
  // ─── CRIAR CHAVE DO TOKEN E ARMAZENAR NO REDIS 24 HRS ───────────────────────────
  //
  criarArmazenamentoToken: (userId, token, res) => {
    let objRedis = { token: token, id: userId };
    client.set(
      `TOKEN_${token}`,
      JSON.stringify(objRedis),
      "EX",
      60 * 60 * 24,
      (error) => {
        if (error) {
          console.log(error);
          return res.status(200).json(
            util.retornarPayload(null, "Ocorreu um erro em armazenar o token", [
              {
                location: "redis",
                param: "armazenamento",
                msg: "Ocorreu um erro em armazenar o token",
              },
            ])
          );
        }

        console.log("Criado token");
        return true;
      }
    );
  },
  //
  // ─── DELETAR A CHAVE DO TOKEN ARMAZENADA NO REDIS ────────────────────
  //
  deletarToken: (token) => {
    client.del(`TOKEN_${token}`, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });
  },
  //
  // ─── VERIFICAR SE O USUARIO POSSUI CHAVE DO TOKEN ARMAZENADA NO REDIS ────────────────────
  //
  pegarArmazenamentoToken: (token) => {
    return new Promise((resolve, reject) => {
      client.get(`TOKEN_${token}`, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        console.log("Result ==>", data);
        data = JSON.parse(data);

        resolve(data);
      });
    });
  },
  //
  // ─── CRIAR CHAVE DO USUARIO E ARMAZENAR CODIGO DE VERIFICACAO NO REDIS 24 HRS ───────────────────────────
  //
  criarArmazenamentoCodigoVericacao: (userId, codigo, res) => {
    let objRedis = { codigo: codigo, id: userId };
    client.set(
      `Verificacao_${userId}`,
      JSON.stringify(objRedis),
      "EX",
      60 * 60 * 24,
      (error) => {
        if (error) {
          console.log(error);
          return res.status(200).json(
            util.retornarPayload(null, "Ocorreu um erro em armazenar o codigo de verificação", [
              {
                location: "redis",
                param: "armazenamento",
                msg: "Ocorreu um erro em armazenar o codigo de verificação",
              },
            ])
          );
        }

        console.log("Criado codigo de verificacao");
        return true;
      }
    );
  },
  //
  // ─── DELETAR CODIGO DE VERIFICACAO ARMAZENADA NO REDIS ────────────────────
  //
  deletarCodigoVericacao: (userId) => {
    client.del(`Verificacao_${userId}`, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully CODIGO VERIFICACAO!");
      } else {
        console.log("Cannot delete");
      }
    });
  },
  //
  // ─── VERIFICAR SE O USUARIO POSSUI CODIGO DE VERIFICACAO ARMAZENADO NO REDIS ────────────────────
  //
  pegarArmazenamentoCodigoVerificacao: (userId) => {
    return new Promise((resolve, reject) => {
      client.get(`Verificacao_${userId}`, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        console.log("Result codigo verificacao ==>", data);
        data = JSON.parse(data);

        resolve(data);
      });
    });
  },
};

module.exports = redisCommands;
