'use strict';

var v = require('validator')
  , moment = require('moment-timezone');

const date_formats = [
    moment.ISO_8601,
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'DD/MM/YYYY',
    'D-M-YYYY',
    'D.M.YYYY',
    'D/M/YYYY',
    'YYYY-MM-DD HH:mm:Z',
    'YYYY-MM-DD HH:mm:ZZ',
    'YYYY-MM-DD HH:mm Z'
];

class Rules {
    constructor(Validator) {
        this.validator = Validator;
    }

    async accepted(field, value, message){
        if(value === true || value === 'yes' || value === 'on' || value === 1 || value === "1"){
            return true;
        }else{
            this.validator.addError(field, 'rule', 'accepted', message || 'The value of the field needs to be between 1, yes, or true');
            return false;
        }
    }

    async after(field, value, afterDate, message){
        let mAfterDate, mDate;
        if(typeof this.validator.validations[field].date_format !== 'undefined'){
            mAfterDate = moment(afterDate, date_formats.concat([this.validator.validations[field].date_format]));
            mDate = moment(value, this.validator.validations[field].date_format, true);
        }else{
            mAfterDate = moment(afterDate, date_formats);
            mDate = moment(value, date_formats);
        }

        if(message){
            message = message.replace(':afterDate', afterDate);
        }

        if(!mAfterDate.isValid()){
            this.validator.addError(field, 'rule', 'after', 'The after date arguement is an invalid date');
            return false;
        }else if(!mDate.isValid()){
            this.validator.addError(field, 'rule', 'after', 'The value of the field is an invalid date');
            return false;
        }else if(mAfterDate.valueOf() > mDate.valueOf()){
            this.validator.addError(field, 'rule', 'after', message || 'The provided date does not fall after the date mentioned in the arguement');
            return false;
        }

        return true;
    }

    async alpha(field, value, message){
        if(!v.isAlpha(value.toString())){
            this.validator.addError(field, 'rule', 'alpha', message || 'The value of the field needs to be alphabetical');
            return false;
        }

        return true;
    }

    async alphaDash(field, value, message){
        if(!(/^[A-Z0-9_-]+$/i.test(value))){
            this.validator.addError(field, 'rule', 'alphaDash', message || 'The field value can only contain aplhabets, _ and -');
            return false;
        }

        return true;
    }

    async alphaNumeric(field, value, message){
        if(!v.isAlphanumeric(value)){
            this.validator.addError(field, 'rule', 'alphaNumeric', message || 'The value of the field can only contain letters and numbers');
            return false;
        }

        return true;
    }

    async before(field, value, beforeDate, message){
        let mBeforeDate, mDate;
        if(typeof this.validator.validations[field].date_format !== 'undefined'){
            mBeforeDate = moment(beforeDate, date_formats.concat([this.validator.validations[field].date_format]));
            mDate = moment(value, this.validator.validations[field].date_format, true);
        }else{
            mBeforeDate = moment(beforeDate, date_formats);
            mDate = moment(value, date_formats);
        }

        if(message){
            message = message.replace(':beforeDate', beforeDate);
        }

        if(!mBeforeDate.isValid()){
            this.validator.addError(field, 'rule', 'before', message || 'The before date arguement is an invalid date');
            return false;
        }else if(!mDate.isValid()){
            this.validator.addError(field, 'rule', 'before', message || 'The value of the field is an invalid date');
            return false;
        }else if(mBeforeDate.valueOf() < mDate.valueOf()){
            this.validator.addError(field, 'rule', 'before', message || 'The provided date does not come before the date mentioned in the arguement');
            return false;
        }

        return true;
    }

    //Length of charachters
    async between(field, value, args, message){

        if(!Array.isArray(args) && args.length !== 2){
            this.validator.addError(field, 'rule', 'between', 'The number of arguements in the field are invalid');
            return false;
        }else{
            if(!v.isInt(args[0]) || !v.isInt(args[1])){
                this.validator.addError(field, 'rule', 'between', 'The rule arguements for the field need to be integers');
                return false;
            }else if( parseInt(args[0]) >= parseInt(args[1]) ){
                this.validator.addError(field, 'rule', 'between', 'The rule arguement for the min value cannot be greater than or equal to the max value');
                return false;
            }else if(value.toString().length < parseInt(args[0]) || value.toString().length > parseInt(args[1])){
                if(message){
                    if(message){
                        message = message.replace(':minLength', args[0]).replace(':maxLength', args[1]);
                    }
                }

                this.validator.addError(field, 'rule', 'between', 'The size of the field is not within the specified range');
                return false;
            }
        }

        return true;
    }

    async boolean(field, value, message){
        if(value === true || value === false || value === 0 || value === "0" ||value === 1 || value === "1"){
            return true;
        }else{
            this.validator.addError(field, 'rule', 'boolean', 'The value of the field needs to be between true, false, 0 and 1');
            return false;
        }
    }

    async contains(field, value, inString, message){
        if(typeof inString !== "string"){
            this.validator.addError(field, 'rule', 'contains', 'The number of arguements provided is invalid. Please provide one single string');
            return false;
        }else{
            if(!v.contains(value, inString)){
                if(message){
                    message.replace(':substring', inString);
                }
                this.validator.addError(field, 'rule', 'contains', message || 'The value of the field can only contain letters and numbers');
                return false;
            }
        }

        return true;
    }

    async date(field, value, message){
        if(!moment(value, date_formats, true).isValid()){
            this.validator.addError(field, 'rule', 'date', message || 'The value provided for the field is an invalid date');
            return false;
        }

        return true;
    }

    async dateFormat(field, value, format, message){
        if(!moment(value, format, true).isValid()){
            if(message){
                message.replace(':format', format);
            }
            this.validator.addError(field, 'rule', 'dateFormat', message || 'The value provided for the field is either invalid or not in the format mentioned');
            return false;
        }

        this.validator.validations[field].date_format = format;
        return true;
    }

    async different(field, value, otherField, message){
        if(typeof otherField !== "string"){
            this.validator.addError(field, 'rule', 'different', 'The number of arguements provided is invalid. Please provide one single string');
            return false;
        }else{
            otherField = otherField.split('.').filter(function(e){ return e !== ''; });
            let otherValue;
            let self = this;

            otherField.map(function(item){
        		if(typeof otherValue === 'undefined'){
        			otherValue = self.validator.fields && self.validator.fields[item];
        		}else{
        			otherValue = otherValue[item];
        		}
        	});

            if(typeof otherValue === 'undefined'){
                this.validator.addError(field, 'rule', 'different', message || 'The field you are comparing the value against does not exist');
                return false;
            }else if(otherValue == value){
                this.validator.addError(field, 'rule', 'different', message || 'The field you are comparing the value against is the same');
                return false;
            }
        }

        return true;
    }

    async digits(field, value, dNumber, message){

        if(message){
            message = message.replace(':digits', dNumber.toString());
        }

        if(!v.isInt(dNumber)){
            this.validator.addError(field, 'rule', 'digits', 'The arguement entered is an invalid. Please enter digits');
            return false;
        }else if(value != dNumber){
            this.validator.addError(field, 'rule', 'digits', message || 'The value does not match with the mentioned number');
            return false;
        }

        return true;
    }

    /**
     * [digitsBetween - Check if the value provided is in digits that fall between the args]
     * @param  {string}     field   The name of the field getting validated
     * @param  {integer}    value   The value of the field getting validated
     * @param  {array}      args    Contains the minimum and maximum number with the array
     * @param  {string}     message An optional custom error message to be displayed in case of the error
     * @return {boolean}    True if field validates false if it doesn't
     */

    async digitsBetween(field, value, args, message){
        if(!Array.isArray(args) && args.length !== 2){
            this.validator.addError(field, 'rule', 'digitsBetween', 'The number of arguements in the field are invalid');
            return false;
        }else{
            if(!v.isInt(args[0]) || !v.isInt(args[1])){
                this.validator.addError(field, 'rule', 'digitsBetween', 'The rule arguements for the field need to be integers');
                return false;
            }else if(parseInt(args[0]) >= parseInt(args[1])){
                this.validator.addError(field, 'rule', 'digitsBetween', 'The rule arguement for the min value cannot be greater than or equal to the max value');
                return false;
            }else if(parseInt(value) < parseInt(args[0]) || parseInt(value) > parseInt(args[1])){
                if(message){
                    message = message.replace(':min', args[0]).replace(':max', args[1]);
                }

                this.validator.addError(field, 'rule', 'digitsBetween', message || 'The digits are not within the specified range');
                return false;
            }
        }

        return true;
    }

    async email(field, value, message){
        if(!v.isEmail(value)){
            this.validator.addError(field, 'rule', 'email', message || 'The value entered is not a valid email');
            return false;
        }

        return true;
    }

    async equals(field, value, arg, message){
        if(value != arg){
            this.validator.addError(field, 'rule', 'equals', message || 'The value entered does not match with the arguement');
            return false;
        }

        return true;
    }

    async in(field, value, args, message){
        if(!Array.isArray(args)) args = [args];

        let match = false;

        for(let i = 0; i < args.length; i++){
            if(value == args[i]){
                match = true;
            }
        }

        if(!match){
            this.validator.addError(field, 'rule', 'in', message || 'The value entered does not exist in the arguements supplied');
            return false;
        }

        return true;
    }

    async integer(field, value, message){
        if(!v.isInt(value.toString())){
            this.validator.addError(field, 'rule', 'integer', message || 'The value entered is not an integer');
            return false;
        }

        return true;
    }

    async ip(field, value, message){
        if(!v.isIP(value)){
            this.validator.addError(field, 'rule', 'ip', message || 'The value entered is not an IP Address');
            return false;
        }

        return true;
    }

    async json(field, value, message){
        if(!v.isJSON(value)){
            this.validator.addError(field, 'rule', 'json', message || 'The value entered is not a JSON string');
            return false;
        }

        return true;
    }

    async max(field, value, maxNum, message){
        if(!v.isInt(maxNum)){
            this.validator.addError(field, 'rule', 'max', message || 'The rule arguements for max fields needs to be an integer');
            return false;
        }else if(parseInt(value) > parseInt(maxNum)){
            if(message){
                message.replace(':max', maxNum)
            }
            this.validator.addError(field, 'rule', 'max', message || 'The value of the field is greater than the max arguement');
            return false;
        }

        return true;
    }

    async maxLength(field, value, maxNum, message){
        if(!v.isInt(maxNum)){
            this.validator.addError(field, 'rule', 'max', message || 'The rule arguements for max fields needs to be an integer');
            return false;
        }else if(value.toString().length > parseInt(maxNum)){
            if(message){
                message.replace(':maxLength', maxNum)
            }
            this.validator.addError(field, 'rule', 'maxLength', message || 'The size of the field is greater than the max arguement');
            return false;
        }

        return true;
    }

    async min(field, value, minNum, message){
        if(!v.isInt(minNum)){
            this.validator.addError(field, 'rule', 'min', message || 'The rule arguements for min fields needs to be an integer');
            return false;
        }else if(parseInt(value) < parseInt(minNum)){
            if(message){
                message.replace(':min', minNum)
            }

            this.validator.addError(field, 'rule', 'min', message || 'The value of the field is lesser than the min arguement');
            return false;
        }

        return true;
    }

    async minLength(field, value, minNum, message){
        if(!v.isInt(minNum)){
            this.validator.addError(field, 'rule', 'min', 'The rule arguements for min fields needs to be an integer');
            return false;
        }else if(value.toString().length < parseInt(minNum)){
            if(message){
                message.replace(':minLength', minNum)
            }

            this.validator.addError(field, 'rule', 'minLength', message || 'The size of the field is lesser than the min arguement');
            return false;
        }

        return true;
    }

    async notContains(field, value, inString, message){
        if(typeof inString !== "string"){
            this.validator.addError(field, 'rule', 'notContains', 'The number of arguements provided is invalid. Please provide one single string');
            return false;
        }else{
            if(v.contains(value, inString)){
                if(message){
                    message.replace(':substring', inString);
                }

                this.validator.addError(field, 'rule', 'notContains', message || 'The value of the field can only contain letters and numbers');
                return false;
            }
        }

        return true;
    }

    async notIn(field, value, args, message){
        if(!Array.isArray(args)) args = [args];

        let noMatch = true;

        for(let i = 0; i < args.length; i++){
            if(value == args[i]){
                noMatch = false;
            }
        }

        if(!noMatch){
            this.validator.addError(field, 'rule', 'notIn', message || 'The value entered exists in the arguements supplied');
            return false;
        }

        return true;
    }

    async numeric(field, value, message){
        if(!v.isNumeric(value.toString())){
            this.validator.addError(field, 'rule', 'numeric', message || 'The value entered is not numeric');
            return false;
        }

        return true;
    }

    async regex(field, value, regexp, message){
        if(!(regexp instanceof RegExp)){
            this.validator.addError(field, 'rule', 'regex', message || 'The regex arguement is not a valid regular expression');
            return false;
        }else if(!regexp.test(value)){
            if(message){
                message = message.replace(':regexp', regexp);
            }

            this.validator.addError(field, 'rule', 'regex', message || 'The value provided did not match with the regex format');
            return false;
        }

        return true;
    }

    async same(field, value, otherField, message){
        if(typeof otherField !== 'string'){
            this.validator.addError(field, 'rule', 'same', message || 'The number of arguements provided is invalid. Please provide one single string');
            return false;
        }else{
            otherField = otherField.split('.').filter(function(e){ return e !== ''; });
            let otherValue;
            let self = this;

            otherField.map(function(item){
        		if(typeof otherValue === 'undefined'){
        			otherValue = self.validator.fields && self.validator.fields[item];
        		}else{
        			otherValue = otherValue[item];
        		}
        	});

            if(typeof otherValue === 'undefined'){
                this.validator.addError(field, 'rule', 'same', message || 'The field you are comparing the value against does not exist');
                return false;
            }else if(otherValue != value){
                this.validator.addError(field, 'rule', 'same', message || 'The field you are comparing the value against are different');
                return false;
            }
        }

        return true;
    }

    async string(field, value, message){
        if(typeof value !== 'string'){
            this.validator.addError(field, 'rule', 'string', message || 'The value provided is not a string');
            return false;
        }

        return true;
    }

    async timezone(field, value, message){
        if(!moment.tz.zone(value)){
            this.validator.addError(field, 'rule', 'timezone', message || 'The value provided is not a valid timezone');
            return false;
        }

        return true;
    }

    async url(field, value, message){
        if(!v.isURL(value)){
            this.validator.addError(field, 'rule', 'url', message || 'The value provided is not a URL');
            return false;
        }

        return true;
    }
}

module.exports = Rules;
