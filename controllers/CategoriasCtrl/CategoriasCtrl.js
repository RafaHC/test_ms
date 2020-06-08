let categoriaHelper = require("./helper/CategoriasCtrlHelper");
const util = require("./../../helper/util");

let CategoriasCtrl = {
  //
  // ─── CRIAR AS CATEGORIAS ─────────────────────────────────────────
  //
  create: async (req, res) => {
    let erros = await categoriaHelper.validarCamposObrigatoriosCriacao(req);

    if (erros) {
      res
        .status(200)
        .json(util.retornarPayload(null, "Parametros invalidos", erros));
      return;
    }

    result = await categoriaHelper.criarCategoria(req);

    return res.json(
      util.retornarPayload(
        {
          id: result.id,
          nome: result.nome,
        },
        "Categoria criada com sucesso!",
        []
      )
    );
  },
  //
  // ─── PEGAR AS CATEGORIAS ────────────────────────────────────────────────────────
  //
  getCategorias: async (req, res) => {
    let result = await categoriaHelper.carregarCategorias();
    return res.json(util.retornarPayload(result, "Categorias do app!", []));
  },
  //
  // ─── ATUALIZAR A CATEGORIA ──────────────────────────────────────────────────────
  //
  updateCategoria: async (req, res) => {
    let result = await categoriaHelper.updateCategoria(req);
    return res.send(
      util.retornarPayload(result[1], "Categoria atualizada com sucesso!", [])
    );
  },
};

module.exports = CategoriasCtrl;
