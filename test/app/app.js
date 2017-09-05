const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-better-body');

const app = new Koa();
const router = new Router();

require('koa-qs')(app, 'extended');

const validate = require('../../lib/validate');

app.use(koaBody({
    'multipart': true
}));
app.use(validate());
app.use(async (ctx, next) => {
    await next();
})
require('./query_routes')(app, router);
require('./header_routes')(app, router);
require('./param_routes')(app, router);
require('./post_routes')(app, router);
require('./file_routes')(app, router);

module.exports = app;
