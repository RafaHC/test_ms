let UsuariosCtrl = require("./../controllers/UsuariosCtrl/UsuariosCtrl");
let EnderecosCtrl = require("./../controllers/EnderecosCtrl/EnderecosCtrl");
let CategoriasCtrl = require("./../controllers/CategoriasCtrl/CategoriasCtrl");

//
// ─── ROTAS DA APLICACAO ─────────────────────────────────────────────────────────
//
module.exports = (app, middleware) => {
  app.get("/codigo/:id", UsuariosCtrl.getCodigoVerificacao);
  app.get("/usuarios", UsuariosCtrl.getAll);
  app.put("/usuarios/:id/verificacao", UsuariosCtrl.updateAutorizacaoUser);
  app.get("/usuario", middleware.checkToken, UsuariosCtrl.getUsuario);
  app.post("/usuarios", UsuariosCtrl.create);
  app.post("/login", UsuariosCtrl.login);
  app.delete("/usuarios/:id", UsuariosCtrl.delete);
  app.post("/enderecos", middleware.checkToken, EnderecosCtrl.create);
  //app.get("/enderecos", middleware.checkToken, EnderecosCtrl.getEnderecosUser);
  //TODO: PASSAR ID pro endereco
  app.put("/enderecos/:id",middleware.checkToken,EnderecosCtrl.updateEnderecoUser);
  app.post("/categorias", CategoriasCtrl.create);
  app.get("/categorias", CategoriasCtrl.getCategorias);
  app.put("/categorias/:id", CategoriasCtrl.updateCategoria);

  app.get("/", middleware.checkToken, (req, res) => {
    let id = req.userId;
    req.userId = null;
    if (res.newToken !== null && res.newToken !== undefined) {
      console.log("Response novo token ==>", res.newToken);
    }
    res.json({
      message: "Hello world!",
      id: id,
    });
  });
};
