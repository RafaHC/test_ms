let fornecedores = require("../../../models/Fornecedores/Fornecedores").init();
let FornecedoresCtrlHelper = {
  //
  // ─── CRIANDO  FORNECEDOR ────────────────────────────────────────────────────────
  //
  criarFornecedor: async (body) => {
    let obj = {
      userid: body.id,
      cpf_cnpj: body.cpf,
      ativo: true,
    };

    let result = await fornecedores.create(obj);

    return result;
  },
};

module.exports = FornecedoresCtrlHelper;
