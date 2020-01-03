import {_} from "canvax";

export default {
	_eval: function (code, target, paramName, paramValue) {
		return paramName
			? (new Function(paramName, code + `; return ${target};`))(paramValue)
			: (new Function(code + `; return ${target};`))();
	},

    parse: function(code, range, data, variablesFromComponent) {
		try {
			let isVariablesDefined = range && range.length && range.length === 2 && range[1] > range[0];

			// 若未定义
			if (!isVariablesDefined) {
				return this._eval(code, 'options');
			}
			
			let variablesInCode = this._eval(code, 'variables');
	
			if (typeof variablesInCode === 'function') {
				variablesInCode = variablesInCode(data) || {};
			}
	
			let variables = {};
	
			if (variablesFromComponent !== undefined) {
				variables = typeof variablesFromComponent === 'function'
					? variablesFromComponent(data)
					: variablesFromComponent;
			}
	
			variables = _.extend(true, {}, variablesInCode, variables);
			
			let codeWithoutVariables = code.slice(0, range[0]) + code.slice(range[1]);
	
			return this._eval(codeWithoutVariables, 'options', 'variables', variables);
		} catch (e) {
			console.log('parse error');
			return {};
		}

    }
}
