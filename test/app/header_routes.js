module.exports = function(app, router){

    router.get('/headers', async function(ctx, next){
        await ctx.validateHeaders(
            {
                'content-type': 'required|equals:application/json',
                'x-authorization': 'required|between:20,30',
                'x-origin-ip': 'required|ip',
            },
            {},
            {
                before:{
                    'content-type': 'trim|lowercase'
                }
            }
        );

        if(ctx.validationErrors){
            ctx.status = 422;
            ctx.body = ctx.validationErrors;
        }else{
            ctx.status = 200;
            ctx.body = { success: true }
        }
    });

    app.use(router.routes()).use(router.allowedMethods());
}
