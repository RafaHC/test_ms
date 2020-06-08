//
// ─── METODOS UTIL PARA TODA A APLICACAO ─────────────────────────────────────────
//
let util = {
  retornarPayload: (body, message, erros) => {
    return {
      message: message,
      data: body,
      error: erros,
    };
  },
};

module.exports = util;
