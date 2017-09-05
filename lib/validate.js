'use strict';

let FieldValidator = require('./fieldValidator');
let FileValidator = require('./fileValidator');
let RequiredRules = require('./requiredRules');
let Rules = require('./rules');
let Filters = require('./filters');
let FileRules = require('./fileRules');
let FileActions = require('./fileActions');

module.exports = function() {
	return async function(ctx, next) {
        let v;
		ctx.validateBody = async function(rules, messages, filters){
			let fields;

			if(ctx.request.body && ctx.request.body.fields) fields = ctx.request.body.fields;
			else if (ctx.request.body) fields = ctx.request.body;
			else fields = {};

			v = new FieldValidator(
				ctx,
				fields,
				rules,
				messages || {},
				filters || {}
			);

			await v.valid;
        };

        ctx.validateParams = async function(rules, messages, filters){
            v = new FieldValidator(
				ctx,
				ctx.params || {},
				rules,
				messages || {},
				filters || {}
			);

			await v.valid;
        };

        ctx.validateQueries = async function(rules, messages, filters){
            v = new FieldValidator(
				ctx,
				ctx.request.query || {},
				rules,
				messages || {},
				filters || {}
			);

			await v.valid;
        };

		ctx.validateHeaders = async function(rules, messages, filters){
			v = new FieldValidator(
				ctx,
				ctx.headers || {},
				rules,
				messages || {},
				filters || {}
			);

			await v.valid;
		};

		ctx.validateFiles = async function(rules, deleteOnFail, messages, actions) {
			var files = (ctx.request.body && ctx.request.body.files) ? ctx.request.body.files : {};
            
			v = new FileValidator(
				ctx,
				files,
				rules,
				deleteOnFail || false,
				messages || {},
				actions || {}
			);
			await v.valid;
		};

		await next();
	};
};

module.exports.RequiredRules = RequiredRules;
module.exports.Rules = Rules;
module.exports.FileRules = FileRules;
module.exports.Filters = Filters;
module.exports.FileActions = FileActions;
