let categorias = require("../../../models/Categorias/Categorias").init();

let CategoriasCtrlHelper = {
  //
  // ─── VALIDANDO CAMPOS OBRIGATORIOS PARA CRIACAO DA CATEGORIA ────────────────────
  //
  validarCamposObrigatoriosCriacao: (req) => {
    req.assert("nome", "Nome é obrigatório!").notEmpty();
    let erros = req.validationErrors();
    return erros;
  },
  //
  // ─── CRIANDO A CATEGORIA ────────────────────────────────────────────────────────
  //
  criarCategoria: async (req) => {
    let body = req.body;
    let obj = {
      nome: body.nome,
      ativo: true,
    };

    let result = await categorias.create(obj);

    return result;
  },
  //
  // ─── UPDATE NA CATEGORIA ────────────────────────────────────────────────────────
  //
  updateCategoria: async (req) => {
    let result = await categorias.update(req.body, {
      where: {
        id: req.params.id
      },
        returning: true
    });
    return result;
  },

  //
  // ─── UPDATE NA CATEGORIA ────────────────────────────────────────────────────────
  //
  carregarCategorias: async () => {
     let result = await categorias.findAll({});
     return result;
  },
};

module.exports = CategoriasCtrlHelper;
