let enderecos = require("../../models/Enderecos/Enderecos").init();
let enderecoHelper = require("./Helper/EnderecosCtrlHelper");
const util = require("./../../helper/util");

let EnderecoCtrl = {
  //
  // ─── CRIAR ENDERECO ─────────────────────────────────────────────────────────────
  //
  create: async (req, res) => {
    let erros = await enderecoHelper.validarCamposObrigatoriosCriacao(req);

    if (erros) {
      res
        .status(200)
        .json(util.retornarPayload(null, "Parametros invalidos", erros));
      return;
    }

    result = await enderecoHelper.criarEndereco(req);

    return res.json(
      util.retornarPayload(
        {
          id: result.id,
          endereco: result.endereco,
          longitude: result.longitude,
          latitude: result.latitude,
        },
        "Endereço criado com sucesso!",
        []
      )
    );
  },
  //
  // ─── PEGAR OS ENDERECOS DO USUARIO ──────────────────────────────────────────────
  //
  getEnderecosUser: async (req, res) => {
    let id = req.userId;
    req.userId = null;
    let result = await enderecos.findAll({
      where: {
        userid: id,
      },
    });
    res.json(util.retornarPayload(result, "Endereços do usuario!", []));
  },
  //
  // ─── ATUALIZANDO O ENDERECO DO USUARIO PELO ID ──────────────────────────────────
  //
  updateEnderecoUser: async (req, res) => {
    let result = await enderecoHelper.updateEnderecoUser(req);
    return res.send(
      util.retornarPayload(result[1], "Endereço atualizado com sucesso!", [])
    );
  },
};

module.exports = EnderecoCtrl;
