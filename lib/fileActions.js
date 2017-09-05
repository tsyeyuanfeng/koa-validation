'use strict'

var fs = require('fs-extra');

class FileActions {
    constructor(Validator){
        this.validator = Validator;
    }

    async move(field, file, deleteOnFail, destination, callback){
        try{
            await fs.move(file.path, destination, { clobber: true });
            if(callback){
                if(await callback(this.validator, file, destination)){
                    return true;
                }else{
                    if(deleteOnFail){
                        if(file.path && (await fs.exists(file.path))){
                            await fs.remove(file.path);
                        }
                    }

                    return false;
                }
            }else{
                return true;
            }
        } catch (e){
            this.validator.addError(field, 'action', 'move', 'The file could not be moved to the destination provided');
            if(deleteOnFail){
                if(file.path && (await fs.exists(file.path))){
                    await fs.remove(file.path);
                }
            }

            return false;
        }
    }

    async copy(field, file, deleteOnFail, destination, callback){

        try {
            await fs.copy(file.path, destination, { clobber: true });

            if(callback){
                if(await callback(this.validator, file, destination)){
                    return true;
                }else{
                    if(deleteOnFail){
                        if(file.path && (await fs.exists(file.path))){
                            await fs.remove(file.path);
                        }
                    }
                    return false;
                }
            }else {
                return true;
            }
        } catch (e){
            this.validator.addError(field, 'action', 'copy', 'The file could not be copied to the destination provided');
            if(deleteOnFail){
                if(file.path && (await fs.exists(file.path))){
                    await fs.remove(file.path);
                }
            }
            return false;
        }
    }

    async remove(field, file, deleteOnFail, args, callback){
        try {
            await fs.remove(file.path);

            if(callback) {
                return (await callback(this.validator, file.path));
            }else{
                return true;
            }

        }catch(e){
            this.validator.addError(field, 'action', 'delete', 'The original uploaded file could not be deleted');
            return false;
        }
    }
}

module.exports = FileActions;
