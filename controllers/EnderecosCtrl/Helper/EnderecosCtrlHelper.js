let enderecos = require("../../../models/Enderecos/Enderecos").init();

let EnderecosCtrlHelper = {
  //
  // ─── VALIDANDO CAMPOS OBRIGATORIOS PARA CRIACAO DO ENDERECO ─────────────────────
  //
  validarCamposObrigatoriosCriacao: (req) => {
    req.assert("endereco", "Endereço é obrigatório!").notEmpty();
    req.assert("longitude", "Longitude é obrigatório!").notEmpty();
    req.assert("latitude", "Latitude é obrigatório!").notEmpty();
    let erros = req.validationErrors();
    return erros;
  },
  //
  // ─── CRIANDO O ENDERECO ─────────────────────────────────────────────────────────
  //
  criarEndereco: async (req) => {
    let body = req.body;
    let userid = req.userId;
    req.userId = null;
    let obj = {
      userid: userid,
      endereco: body.endereco,
      longitude: body.longitude,
      latitude: body.latitude,
      ativo: true,
    };

    let result = await enderecos.create(obj);

    return result;
  },
  //
  // ─── UPDATE NO ENDERECO DO USUARIO ──────────────────────────────────────────────
  //
  updateEnderecoUser: async (req) => {
    let result = await enderecos.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true
    });
    return result;
  },
};

module.exports = EnderecosCtrlHelper;
