define(function () {
	// stoping recursive calls of a observer might be a good idea for future
	var observe = function (wake) { 

		var present_value = wake.object[wake.property];

		if (!wake.object.observers) {

			observe.prototype.define_object_descriptor_property({
				object   : wake.object, 
				property : "observers",
				value    : {}
			});
		}

		if (!wake.object.observers[wake.property]) wake.object.observers[wake.property] = [];

		for ( var index in wake.object.observers[wake.property] ) { 
			if ( wake.object.observers[wake.property][index] === wake.observer ) return;
		}

		wake.object.observers[wake.property].push({ 
			observer : wake.observer, 
			context  : { self : wake.self, parent : wake.parent } 
		});

		observe.prototype.define_object_accessor_property({
			object   : wake.object,
			property : wake.property,
			get      : function () {
				return present_value;
			},
			set 	 : function (new_value) {
				var old_value = present_value; 
				present_value = new_value;
				observe.prototype.call_observers_of_an_object({
					action   : "set",
					old      : old_value,
					"new"    : new_value,
					object   : wake.object,
					property : wake.property
				});
			}
		});
	};

	observe.prototype.define_object_accessor_property = function (wake) { 
		try { 
			Object.defineProperty(wake.object, wake.property, {
				enumerable   : true,
				configurable : true,
				get       	 : wake.get,
				set          : wake.set
			});
		} catch (error) {
			try { 
				Object.prototype.__defineSetter__(wake.object, wake.property, wake.set );
				Object.prototype.__defineGetter__(wake.object, wake.property, wake.get );
			} catch (error) { 
				throw new Error("Browsers does not support defining object accessors");
			}
		}
	}

	observe.prototype.define_object_descriptor_property = function (wake) { 
		try {
			Object.defineProperty(wake.object, wake.property, {
				configurable : true,
				enumerable   : false, 
				writable     : false, 
				value        : wake.value
			});
		} catch (error) { 
			wake.object[wake.property] = wake.value;
		}
	};

	observe.prototype.call_observers_of_an_object = function (wake) {
		for (var observer in wake.object.observers[wake.property] ) {
			wake.object.observers[wake.property][observer].observer.call(wake.object.observers[wake.property][observer].context, wake);
		}
	};

	return observe;

});