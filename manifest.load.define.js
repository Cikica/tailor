define(function () {

	requirejs(["manifest.define"], 
	function (define) {
		
		var paths;

		paths = [];
		paths = paths.concat(
			define.main,
			"manifest/manifest",
			define.components, 
			define.other
		);

		requirejs(paths, function (application, thought) {

			var first_level_components, module_name, index, name, other, reference, name_index;

			other                  = {};
			first_level_components = {};

			for ( index = 0; index < define.components.length; index++ ) {
				name               = define.components[index].split("/");
				name               = name[name.length-1].split(".");
				module_name        = name[name.length-1];
				reference          = thought.prototype.components;
				if ( name.length > 1 ) {
					for ( name_index = 0; name_index < name.length-1; name_index++) {
						if ( !reference[name[name_index]].prototype.components ) {
							throw new Error( module_name +" can not be made a component of "+ name[name_index] +" becayse "+ name[name_index] +" does not have a \"components\" object in its prototype chain");
						} 
						reference = reference[name[name_index]].prototype.components;
					}
				} else {
				 	first_level_components[module_name] = arguments[2+index];
				}
				reference[module_name] = arguments[2+index];
			};

			for (index = 0; index < define.other.length; index++) {
				name               = define.other[index].split("/");
				name               = name[name.length-1].split(".");
				module_name        = name[0];
				other[module_name] = arguments[2+define.components.length+index];
			};

			application(thought, first_level_components, other);

		});
	});
	
});