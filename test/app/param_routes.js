module.exports = function(app, router){

    router.post('/params/:username/post/:postId', async function(ctx, next){
        await ctx.validateParams({
            'username': 'alphaDash|between:6,15',
            'postId': 'numeric|digitsBetween:10000,99999'
        });

        if(ctx.validationErrors){
            ctx.status = 422;
            ctx.body = ctx.validationErrors;
        }else{
            ctx.status = 200;
            ctx.body = { success: true };
        }
    });

    app.use(router.routes()).use(router.allowedMethods());
}
