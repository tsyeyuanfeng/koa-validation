'use strict';

var v = require('validator')
  , crypto = require('crypto');

class Filters{
    constructor(Validator){
        this.validator = Validator;
    }

    async integer(field, value){
        let eVal = v.toInt(value);
        if(!isNaN(eVal)){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'integer', 'The value for '+field+' cannot be converted to an integer.');
            return;
        }
    }

    async float(field, value){
        let eVal = v.toFloat(value);
        if(!isNaN(eVal)){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'float', 'The value for '+field+' cannot be converted to a Float.');
            return;
        }
    }

    async lowercase(field, value){
        try {
            return value.toLowerCase();
        } catch(e) {
            this.validator.addError(field, 'filter', 'lowercase', 'The value for '+field+' cannot be converted to lowercase.');
            return;
        }
    }

    async uppercase(field, value){
        try {
            return value.toUpperCase();
        } catch(e) {
            this.validator.addError(field, 'filter', 'uppercase', 'The value for '+field+' cannot be converted to uppercase.');
            return;
        }
    }

    async boolean(field, value){
        return v.toBoolean(value);
    }

    async json(field, value){
        try {
            return JSON.stringify(value);
        } catch(e) {
            this.validator.addError(field, 'filter', 'json', 'Invalid string cannot be converted to JSON');
            return
        }
    }

    async trim(field, value, separator){
        let eVal = (separator) ? v.trim(value, separator) : v.trim(value);
        if(typeof eVal === 'string'){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'trim', 'The value for '+field+' cannot be trimmed as the data type is invalid');
            return
        }
    }

    async ltrim(field, value, separator){
        let eVal = (separator) ? v.ltrim(value, separator) : v.ltrim(value);
        if(typeof eVal === 'string'){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'ltrim', 'The value for '+field+' cannot be escaped as the data type is invalid');
            return
        }
    }

    async rtrim(field, value, separator){
        let eVal = (separator) ? v.rtrim(value, separator) : v.rtrim(value);
        if(typeof eVal === 'string'){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'rtrim', 'The value for '+field+' cannot be trimmed as the data type is invalid');
            return
        }
    }

    async escape(field, value){
        let eVal = v.escape(value);

        if(typeof eVal === 'string'){
            return eVal;
        }else{
            this.validator.addError(field, 'filter', 'escape', 'The value for '+field+' cannot be trimmed as the data type is invalid');
            return
        }
    }

    async replace(field, value, original, replacement){
        if(!original || !replacement) {
            this.validator.addError(field, 'filter', 'replace', 'The arguements for relacing the provided string are missing');
            return
        }

        try {
            return value.replace(original, replacement)
        } catch(e) {
            this.validator.addError(field, 'filter', 'replace', 'The value for '+field+' is not a valid string and hence cannot be replaced.');
            return
        }
    }

    async hex(field, value, alg, enc){
        enc = enc || 'hex';
        try {
            return crypto.createHash(alg).update(value).digest(enc);
        }catch(e){
            this.validator.addError(field, 'filter', 'hex', 'The valur or arguements required to hex the field are invalid');
            return;
        }
    }

    async sha1(field, value){
        try {
            return crypto.createHash('sha1').update(value).digest('hex');
        }catch(e){
            this.validator.addError(field, 'filter', 'sha1', 'The value you tried to sha1 is invalid');
            return;
        }
    }

    async md5(field, value){
        try {
            return crypto.createHash('md5').update(value).digest('hex');
        }catch(e){
            this.validator.addError(field, 'filter', 'md5', 'The value you tried to md5 is invalid');
            return;
        }
    }
}

module.exports = Filters;
