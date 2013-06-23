define(function () {

	var thought = function (wake) {
		this.parts      = wake.parts || null;
		this.thought    = wake.thought;
	};

	thought.prototype.manifest = function (space) {
		this.manifestor(space, this.thought);
	};

	thought.prototype.manifestor = function (space, thought) {

		if ( !space ) throw new Error("No manifestation destination has been defined, in order for your thought to manifested you must specifiy this value in your thought.manifest() call");

		var object_name, object;
		
		for (object_name in thought ) {

			object      = thought[object_name];
			object.self = this.create_node(object);
			space.appendChild(object.self);
			if ( object.instructions ) {
				for ( var instruction in object.instructions ) {
					if (!this.components[instruction]) throw new Error( instruction +" does not exist as a component, try and check if you have spelt it correctly or if the component inclusion name is the same as its call name"); 
					new this.components[instruction](object.instructions[instruction], object.self, this.parts);
				}
			}
			if ( object.children ) this.manifestor(object.self, object.children );
		}
	};

	thought.prototype.create_node = function (object) { 	
		if ( !object.self.replace(/^\s+|\s+$/, "") ) throw new Error("\"self\" is empty no element has been specified");

		var element, node_parts, attribute, index, single_tag_elements;

		single_tag_elements = [
			"area",
			"br",
			"hr",
			"embed",
			"track",
			"param",
			"img",
			"source",
			"input"
		];

		node_parts                 = {}
		node_parts.type            = object.self.match(/(^[a-z]+)/g);
		node_parts.type            = ( node_parts.type ? node_parts.type[0] : "div" );
		node_parts.attribute       = {};
		node_parts.attribute.name  = object.self.match(/(#[a-z]+)/g);
		node_parts.attribute.value = object.self.match(/\=[^.|@|#]+/g);
		node_parts.classes         = object.self.match(/\.[.a-zA-Z0-9_-]+/g);
		node_parts.content         = object.self.match(/@.+$/);

		if ( single_tag_elements.indexOf(node_parts.type) > -1 && node_parts.content ) throw new Error( node_parts.type +" can not accept content inside itself");

		element                    = document.createElement(node_parts.type);

		if ( node_parts.classes ) element.className = node_parts.classes[0].replace(/\./g, " ").slice(1);

		if ( node_parts.content ) element.innerHTML = node_parts.content[0].slice(1);

		if ( node_parts.attribute.name && node_parts.attribute.value ) {
			for ( index = 0; index < node_parts.attribute.name.length; index++ ) {
				element.setAttribute(node_parts.attribute.name[index].slice(1), node_parts.attribute.value[index].slice(1));
			}
		}
		
		return element;
	};

	thought.prototype.components = {};

	return thought;

});