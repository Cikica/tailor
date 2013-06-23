define(function () {

	var app = function (thought, components, parts) {

		world = new thought({
			thought : {
				tailor : {
					self : ".tailor",
					instructions : {
						extend : {
							into : "tailor"
						}
					},
				},
				app : {
					self : ".app@loads of stuff and stuff"
				}
			}
		});
		
		console.log(thought.prototype);
		world.manifest(document.body);
	};

	return app;
});