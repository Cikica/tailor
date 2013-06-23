define(function () {
	
	var tailor = function (wake, parent) {
		
		this.self  = parent;
		this.tail  = document.createElement("div");
		this.tail.className = "tailor_peek";
		document.body.insertBefore(this.tail, this.self);

		this.listen_for_when_the_cursor_is_near_the_left_edge_of_the_screen_and_peek();
		// this.bind_touch_listener_for_opening_the_window();

		return this;
	};

	tailor.prototype.listen_for_when_the_cursor_is_near_the_left_edge_of_the_screen_and_peek = function () { 

		var tail, tailor, wait_before_the_tail_peeks;

		tail   = this.tail;
		tailor = this;

		tail.instructions = {
			move    : false,
			moving  : false,
			showing : false
		};

		new this.set_animation({
			element    : tail, 
			animations : {
				show_tailor_peek : {
					from : {
						transform : "translateX(-20px)",
					},
					to   : {
						transform : "translateX(0px)",
					}
				},
				hide_tailor_peek : {
					from : {
						transform : "translateX(0px)",
					},
					to   : {
						transform : "translateX(-20px)",
					}
				}
			},
			support_checks : ["transform"]
		});

		window.addEventListener("mousemove", function (event) {

			if ( event.clientX < 20 && !wait_before_the_tail_peeks ) {
				wait_before_the_tail_peeks = setTimeout(function () {
					tail.instructions.showing = true;
					tail.animate(500, "show_tailor_peek");
				}, 600);
			}

			if ( event.clientX > 20 ) {
				if ( wait_before_the_tail_peeks ) clearTimeout( wait_before_the_tail_peeks );
				if ( tail.instructions.showing  ) tail.animate(500, "hide_tailor_peek");
				if ( tail.instructions.showing  ) tail.instructions.showing = false;
				wait_before_the_tail_peeks = false;
			}

		});

		this.tail.addEventListener("click", function () { 
			alert("open Seaseame");
		});
	};

	tailor.prototype.set_animation = function (paramaters) {

		if ( !paramaters.animations ) throw new Error("no animations given for the set animation method");

		var self            = this;
		this.element        = paramaters.element;
		this.support_checks = paramaters.support_checks || [];
		this.support_checks.push("animationName");
		
		this.check_if_properties_are_supported();

		this.element.animations = paramaters.animations;
		this.element.animate    = function (time, animation_name) {
			self.animate(self.element, time, animation_name);
		};
	};

	tailor.prototype.set_animation.prototype.check_if_properties_are_supported = function () {

		this.support = {
			vendors : ["moz", "webkit", "o", "ms"],
			prefix  : false,
			property: {}
		};

		for (var index = 0; index < this.support_checks.length; index++) {
			this.check_if_property_is_supported(this.support_checks[index]);
		};
	};

	tailor.prototype.set_animation.prototype.check_if_property_is_supported = function (property_name) {

		var capitalised_property_name, support;
		
		capitalised_property_name = property_name.charAt(0).toUpperCase() + property_name.slice(1);
		support = false;

		this.support.property[property_name] = {};

		if ( this.support.prefix ) {
			support = ( this.element.style[this.support.prefix + capitalised_property_name ] !== undefined );
			this.support.property[property_name].yes         = support;
			this.support.property[property_name].with_prefix = support;
		}

		if ( this.element.style[property_name] !== undefined ) {
			this.support.property[property_name].yes         = true;
			this.support.property[property_name].with_prefix = false;
		}
		
		if ( !this.support.property[property_name].yes ) {
			
			for (var index = 0; index < this.support.vendors.length; ++index) {

				if ( this.element.style[this.support.vendors[index] + capitalised_property_name] !== undefined ) { 
					this.support.property[property_name].yes         = true;
					this.support.property[property_name].with_prefix = true;
					this.support.prefix                              = this.support.vendors[index];
				}
			}
		}
	};

	tailor.prototype.set_animation.prototype.animate = function (element, time, animation_name) {
		
		var animation_prefix = "animation", property_value;

		if ( !element.animations[animation_name] )             throw new Error( element.className +" does not have an animation by the name of "+ animation_name );
		if ( this.support.property.animationName.with_prefix ) animation_prefix = this.support.prefix + "Animation";

		this.element.style[animation_prefix + "Duration"] = time +"ms";
		this.element.style[animation_prefix + "Name"]     = animation_name;
		this.element.style[animation_prefix + "PlayState"]= "running";

		for ( var property in this.element.animations[animation_name].to ) {

			property_value = element.animations[animation_name].to[property];
			if ( this.support.property[property] && this.support.property[property].with_prefix ) {
				property = this.support.prefix + property.charAt(0).toUpperCase() + property.slice(1);
			}
			this.element.style[property] = property_value;
		}
	};

	tailor.prototype.bind_touch_listener_for_opening_the_window = function () {
		
		var tailor = this.parent;

		// var transforms = "webkitTransform" || "transform" || "msTransform" || "OTransform";

		// for ( var index = 0; index < transforms.length; index++ ) {
		// 	this.parent.style[transforms[index]] = "translateX(0px)";
		// 	console.log(window.getComputedStyle(this.parent).getPropertyValue(transform[index]));
		// }
		console.log(this.parent.style.webkitTransform);

		window.addEventListener("touchstart", function (event) {
			console.log("touchstart");
			console.log(event.target);
			console.log(event.touches[0].clientX);
			console.log(event.touches[0].clientY);
		});

		window.addEventListener("touchmove", function (event) {
			if ( event.touches[0].clientX > 370 ) return;
			tailor.style.webkitTransform = "translateX("+ event.touches[0].clientX +"px)";
			console.log(tailor.style.webkitTransform);
			event.preventDefault();
			// console.log("touchmove");
			// console.log(event.touches);
		});

		window.addEventListener("touchend", function (event) {
			// console.log("touchend");
			// console.log(event.touches);
		});
	};

	tailor.prototype.components = {};

	return tailor;

});	