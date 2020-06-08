let usuarios = require("../../../models/Usuarios/Usuarios").init();
let Fornecedores = require("../../../models/Fornecedores/Fornecedores").init();
let Enderecos = require("../../../models/Enderecos/Enderecos").init();
let util = require("../../../helper/util");
const bcrypt = require("bcrypt");

let usuariosCtrlHelper = {
  //
  // ─── VALIDANDO CAMPOS OBRIGATORIOS PARA CRIACAO DO USUARIO ──────────────────────
  //
  validarCamposObrigatoriosCriacao: (req) => {
    req.assert("nome", "Nome é obrigatório!").notEmpty();
    req.assert("sobrenome", "Sobrenome é obrigatório!").notEmpty();
    req.assert("celular", "Celular é obrigatório!").notEmpty();
    req.assert("senha", "Senha é obrigatório!").notEmpty();
    req.assert("tipoUsuario", "Tipo do usuario é obrigatório!").notEmpty();
    let erros = req.validationErrors();
    return erros;
  },
  //
  // ─── VALIDANDO CAMPOS OBRIGATORIOS PARA O LOGIN DO USUARIO ──────────────────────
  //
  validarCamposObrigatoriosLogin: (req) => {
    //req.assert("celular", "celular é obrigatório!").notEmpty();
    req.assert("senha", "Senha é obrigatório!").notEmpty();
    let erros = req.validationErrors();
    return erros;
  },
  //
  // ─── VALIDANDO CAMPOS OBRIGATORIOS PARA VERIFICACAO DO USUARIO ──────────────────────
  //
  validarCamposObrigatoriosVerificacao: (req) => {
    req.assert("codigo", "codigo é obrigatório!").notEmpty();
    let erros = req.validationErrors();
    return erros;
  },
  definirCasoBuscaTipoUsuario: async (req) => {
    let objBusca = null;
    if(req.body.tipoUsuario == 1) {
      objBusca = { cpf: req.body.cpf, tipoUsuario: 1 }

    }else if(req.body.tipoUsuario == 2){
      objBusca = { celular: req.body.celular, tipoUsuario: 2 }
    }
    return objBusca;
  },
  // TIPO USUARIO => 1 - FORNECEDOR , 2 - CLIENTE
  // ─── VALIDANDO SE POSSUI USUARIO COM O CELULAR JA CADASTRADO CASO SEJA CLIENTE ────────────────────
  // ─── VALIDANDO SE POSSUI USUARIO COM O CELULAR JA CADASTRADO CASO SEJA FORNECEDOR ────────────────────
  //TODO ALTERAR CHAMADA NO CONTROLLER DO USUARIO
  validarConfiguracoesUsuario: async (req, res) => {
    let filtroQuery = await usuariosCtrlHelper.definirCasoBuscaTipoUsuario(req);
    const usuario = await usuarios.findOne({
      where: filtroQuery,
    });

    return usuario !== null ? usuario.dataValues : null;
  },
  //
  // ─── VALIDANDO SE POSSUI O USUARIO E A SENHA DELE ESTAO CORRETOS ────────────────
  //
  validarUsuarioLogin: async (usuario, req) => {
    let match = false;
    let filtroQuery = await usuariosCtrlHelper.definirCasoBuscaTipoUsuario(req);
    usuarioEncontrado = await usuarios.findOne({
      where: filtroQuery,
    });
    if (usuarioEncontrado)
      match = await bcrypt.compare(
        usuario.senha,
        usuarioEncontrado.dataValues.senha
      );

    return {
      usuarioEncontrado: usuarioEncontrado.dataValues,
      match: match
    };
  },
  //
  // ─── CRIANDO O USUARIO ──────────────────────────────────────────────────────────
  //
  criarUsuario: async (body, hash) => {
    let obj = {
      nome: body.nome,
      sobrenome: body.sobrenome,
      email: body.email,
      celular: body.celular,
      senha: hash,
      cpf: body.cpf,
      tipoUsuario: body.tipoUsuario,
      autorizado: 0,
      ativo: true,
    };

    result = await usuarios.create(obj);
    return result;
  },
  //
  // ─── RETORNANDO USUARIO - DADOS DO FORNECEDOR E OS ENDERECOS ────────────────────
  //
  getUsuario: async (id) => {
    let result = await usuarios.findAll({
      attributes: [
        "id",
        "nome",
        "sobrenome",
        "email",
        "cpf",
        "celular",
        "ativo",
        "tipoUsuario",
        "autorizado",
      ],
      where: {
        id: id,
        ativo: true,
      },
      include: [
        {
          model: Fornecedores,
          attributes: ["id", "cpf_cnpj", "descricao", "ativo"],
          as: "fornecedor",
        },
        {
          model: Enderecos,
          attributes: ["id", "endereco", "longitude", "latitude", "ativo"],
          as: "enderecos",
        },
      ],
    });
    return result;
  },
  //
  // ─── UPDATE NO USUARIO ──────────────────────────────────────────────
  //
  updateUser: async (id, body) => {
    let result = await usuarios.update(body, {
      where: {
        id: parseInt(id),
      },
      returning: true,
    });
    return result[1][0].dataValues;
  },
  //
  // ─── GERAR CODIGO RANDOMICO DE 1000 A 9999 ──────────────────────────────────────────────
  //
  gerarNumeroRandomico: async () => {
    let numeroAleatorio = parseInt(1000 + Math.random() * 8999);

    return numeroAleatorio;
  },
  //
  // ─── VALIUDANDO SE O USUARIO JA ESTA AUTORIZADO ──────────────────────────────────────────────
  //
  validarUsuarioAutorizado: async (userId) => {
    let usuarioEncontrado = await usuariosCtrlHelper.getUsuario(userId);
    console.log(
      "usuario encontrado ==>",
      usuarioEncontrado[0].dataValues.autorizado
    );
    if (
      usuarioEncontrado.length > 0 &&
      usuarioEncontrado[0].dataValues !== undefined &&
      usuarioEncontrado[0].dataValues.autorizado !== 0
    ) {
      return false;
    }

    return true;
  },
};

module.exports = usuariosCtrlHelper;
