const fs = require('fs-extra');
module.exports = function(app, router){

    router.post('/files', async function(ctx, next){
        await ctx.validateFiles({
            'jsFile':'required|size:min,10kb,max,20kb',
            'imgFile': 'required|image',
            'imgFile1': 'mime:jpg',
            'imgFile2': 'extension:jpg',
            'pkgFile': 'name:package'
        });

        if(ctx.validationErrors){
            ctx.status = 422;
            ctx.body = ctx.validationErrors;
        }else{
            ctx.status = 200;
            ctx.body = { success: true }
        }
    });

    router.post('/deleteOnFail', async function(ctx, next){
        await ctx.validateFiles({
            'jsFile':'required|size:min,10kb,max,20kb',
            'imgFile': 'required|image'
        }, true);
        
        if(ctx.validationErrors){
            ctx.status = 422;
            var tmpfiles = []
            for (var f in ctx.request.body.files){
                tmpfiles.push(ctx.request.body.files[f].path);
            }
            ctx.body = tmpfiles;
        }else{
            ctx.status = 200;
            ctx.body = { success: true }
        }
    });

    router.post('/fileActions', async function(ctx, next){
        await ctx.validateFiles({
            'jsFile':'required|size:min,10kb,max,20kb',
            'imgFile': 'required|image',
        },true, {}, {
            jsFile: {
                action: 'move',
                args: __dirname + '/../files/tmp/rules.js',
                callback: async function(validator, file, destination){
                    validator.addError(jsFile, 'action', 'move', 'Just checking if the callback action works!!')
                }
            },
            imgFile: [
                {
                    action: 'copy',
                    args: __dirname + '/../files/tmp/panda.jpg'
                },
                {
                    action: 'delete'
                }
            ]
        });

        if(ctx.validationErrors){
            ctx.status = 422;
            var tmpfiles = {}
            for (var f in ctx.request.body.files){
                tmpfiles[f] = ctx.request.body.files[f].path;
            }
            ctx.body = {
                tmpFiles: tmpfiles,
                errors: ctx.validationErrors
            };
        }else{
            ctx.status = 200;
            ctx.body = { success: true }
        }
    });

    app.use(router.routes()).use(router.allowedMethods());
}
