define(function () {

	var extend = function (paramaters, element_to_extend, parts) {

		var extension;
		paramaters.pass = paramaters.pass || false;

		if ( !paramaters.into )                                          throw new Error("the \"into\" paramater for the extend component has not been specified");
		if ( !paramaters.into.replace(/^\s+|\s+$/, "") )                 throw new Error("the \"into\" paramater for the extend component is empty");
		if ( !this.components[paramaters.into] )                         throw new Error("the \""+ paramaters.into +"\" extension does not exist, try checking if you have spelt it right or included it in the manifest.define");
		if ( this.components[paramaters.into].constructor !== Function ) throw new Error(" the \""+ paramaters.into +"\" extension is not a function as such it can not be used, extensions can only be functions");

		new this.components[paramaters.into](paramaters.pass, element_to_extend, parts);
		// element_to_extend.appendChild(extension.body);
	};

	extend.prototype.components = {};

	return extend;

});