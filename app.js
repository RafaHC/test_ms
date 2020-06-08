//
// ─── START DA APLICACAO ──────────────────────────────────────────────────────────
//
let result = require('./config/config_app');
let app = result.app;
let middleware = result.middleware;
require('./config/routes')(app, middleware);