const bcrypt = require("bcrypt");
let usuarios = require("../../models/Usuarios/Usuarios").init();
let util = require("../../helper/util");
const armazenador = require("../../config/redis");
let usuariosCtrlHelper = require("./helper/UsuarioCtrlHelper");
let middleware = require("./../../config/middleware");
const FornecedorHelper = require("./../FornecedoresCtrl/Helper/FornecedoresCtrlHelper");
let UsuariosCtrl = {
  //
  // ─── METODO PARA CRIACAO DO USUARIO ─────────────────────────────────────────────
  //
  create: async (req, res) => {
    let erros = await usuariosCtrlHelper.validarCamposObrigatoriosCriacao(req);

    if (erros) {
      res
        .status(200)
        .json(util.retornarPayload(null, "Parametros invalidos", erros));
      return;
    }

    let usuarioJaExiste = await usuariosCtrlHelper.validarConfiguracoesUsuario(req, res);

    if (usuarioJaExiste !== null) {
      res.status(200).json(
        util.retornarPayload(null, "Este usuario esta sendo usado", [
          {
            location: "UsuarioCtrl",
            param: "celular",
            msg: "Este usuario esta sendo usado",
          },
        ])
      );
      return;
    }

    let senha = req.body.senha;
    let result;
    bcrypt.hash(senha, 5, async (err, hash) => {
      result = await usuariosCtrlHelper.criarUsuario(req.body, hash);
      //
      // ─── CASO O USUARIO FOR DO TIPOUSUARIO 1 - CRIAR O FORNECEDOR ──────────────────
      //
      if (req.body.tipoUsuario === 1) {
        await FornecedorHelper.criarFornecedor(result);
      }

      return res.json(
        util.retornarPayload(
          {
            id: result.id,
            nome: result.nome,
            celular: result.celular,
            cpf: result.cpf,
            email: result.email,
            autorizado: result.autorizado,
          },
          "Criado com sucesso!",
          []
        )
      );
    });
  },

  getAll: async (req, res) => {
    let result = await usuarios.findAll({});
    return res.send(result);
  },
  //
  // ─── METODO PARA DELETAR O USUARIO ──────────────────────────────────────────────
  //
  delete: (req, res) => {
    let result = usuarios.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.send(result);
  },
  //
  // ─── METODO PARA PEGAR O USUARIO ─────────────────────────────────
  //
  getUsuario: async (req, res) => {
    let result = await usuariosCtrlHelper.getUsuario(req.userId);
    req.userId = null;
    return res.json(util.retornarPayload(result, "Dados do usuario!", []));
  },

  //
  // ─── METODO RESPONSAVEL PARA VALIDAR O LOGIN DO USUARIO ──────────
  //
  login: async (req, res) => {
    let erros = await usuariosCtrlHelper.validarCamposObrigatoriosLogin(req);

    if (erros) {
      res
        .status(200)
        .json(util.retornarPayload(null, "Parametros invalidos", erros));
      return;
    }

    let usuario = req.body;

    let validacaoUsuario = await usuariosCtrlHelper.validarUsuarioLogin(
      usuario, req
    );

    let match = validacaoUsuario.match;

    let usuarioEncontrado = validacaoUsuario.usuarioEncontrado;
    console.log('Usuario Encontrado ==>', usuarioEncontrado)
    if (usuarioEncontrado.autorizado == 0) {
      res.status(200).json(
        util.retornarPayload(null, "Usuario não autorizado!", [
          {
            location: "UsuarioCtrl",
            param: "usuario",
            msg: "Usuario não autorizado!",
          },
        ])
      );
    } else if (usuarioEncontrado == null || match == false) {
      res.status(200).json(
        util.retornarPayload(null, "Usuario ou senha invalido!", [
          {
            location: "UsuarioCtrl",
            param: "usuario",
            msg: "Usuario ou senha invalido!",
          },
        ])
      );
      return;
    } else if (usuarioEncontrado.ativo == false) {
      res.status(200).json(
        util.retornarPayload(null, "Usuario inativo!", [
          {
            location: "UsuarioCtrl",
            param: "usuario",
            msg: "Usuario inativo!",
          },
        ])
      );
      return;
    } else {
      //
      // LOGANDO O USUARIO APOS AS VALIDACOES
      //
      let objUsuario = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        token: null,
        email: usuarioEncontrado.email,
      };

      objUsuario.token = await middleware.criarToken(
        usuarioEncontrado.id,
        res,
        null
      );
      console.log("USER ===>", objUsuario);

      res.json(util.retornarPayload(objUsuario, "Logado com sucesso!", []));
    }
  },
  //
  // ─── API PARA GERAR O CODIGO DE VERIFICACAO E SALVAR NO REDIS ─────────────────────────────────────
  //
  getCodigoVerificacao: async (req, res) => {
    let userId = req.params.id;
    let usuarioAutorizado = await usuariosCtrlHelper.validarUsuarioAutorizado(userId);
    if (!usuarioAutorizado) {
      return res.status(200).json(
        util.retornarPayload(null, "Usuario já autorizado!", [
          {
            location: "UsuarioCtrl",
            param: "usuario",
            msg: "Usuario já autorizado!",
          },
        ])
      );
    }

    let codigoVerificacao = await usuariosCtrlHelper.gerarNumeroRandomico();

    await armazenador.criarArmazenamentoCodigoVericacao(
      userId,
      codigoVerificacao,
      res
    );

    let objRetorno = {
      userId: userId,
      codigoVerificacao: codigoVerificacao,
    };

    return res.json(
      util.retornarPayload(
        objRetorno,
        "Codigo de verificação retornado com sucesso",
        []
      )
    );
  },
  updateAutorizacaoUser: async (req, res) => {
    let userId = req.params.id;
    let erros = await usuariosCtrlHelper.validarCamposObrigatoriosVerificacao(req);

    if (erros) {
      res
        .status(200)
        .json(util.retornarPayload(null, "Parametros invalidos", erros));
      return;
    }

    let usuarioAutorizado = await usuariosCtrlHelper.validarUsuarioAutorizado(userId);
    if (!usuarioAutorizado) {
      return res.status(200).json(
        util.retornarPayload(null, "Usuario já autorizado!", [
          {
            location: "UsuarioCtrl",
            param: "usuario",
            msg: "Usuario já autorizado!",
          },
        ])
      );
    }

    armazenador.pegarArmazenamentoCodigoVerificacao(userId)
    .then(async (result) => {
      console.log('body codigo ==>', req.body.codigo);
      console.log('RESULTADO ==>', result);
      if((result == undefined || result == null) || req.body.codigo != result.codigo){
        res
        .status(200)
        .json(util.retornarPayload(null, "Código de verificação invalido!", {
          location: "UsuarioCtrl",
          param: "verificacao",
          msg: "Código de verificação invalido!",
        }));
      return;
      }

      let retornoUsuario = await usuariosCtrlHelper.updateUser(userId, { autorizado : 1});
      console.log('RETORNO USUARIO ==>', retornoUsuario);
      if(retornoUsuario.autorizado == 1){
        await armazenador.deletarCodigoVericacao(userId);
        res.json(util.retornarPayload(retornoUsuario, "Usuario autorizado com sucesso!", []));
      }
      
    })
    .catch(error => {
      res
      .status(500)
      .json(util.retornarPayload(null, "Ocorreu um erro ao recuperar o código de verificação!", {
        location: "UsuarioCtrl",
        param: "verificacao",
        msg: "Ocorreu um erro ao recuperar o código de verificação!",
      }));
    })
    
  }
};

module.exports = UsuariosCtrl;
