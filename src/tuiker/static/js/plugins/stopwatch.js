// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "stopwatch",
				defaults = {
					format: '{HH}:{MM}:{SS}',
					delay: 1000
		};


		/**
		 * Recover stored instance parameters 
		 */
		var getInstance = function(el) {
			return $.data(el, 'plugin_' + pluginName);
		};


		/***
		 *Reset the timer 
		 */
		var reset = function(instance) {
			instance.clock = 0;
			render(instance.el, instance.clock);
		};


		/**
		 * Start clock 
		 * @param {Object} instance
		 */
		var start = function(instance) {
			if (!instance.interval) {
				reset(instance);
				instance.running = true;
				instance.offset   = Date.now();
				instance.start_time = new Date();
				instance.interval = setInterval(function () {
					
//console.log("update");
//console.log("    clock ------");
//console.log(instance.clock);					
//console.log("    offset ------");
//console.log(instance.offset);					

					instance.clock += delta(instance.offset);
					instance.offset   = Date.now();

//console.log("    clock ------");
//console.log(instance.clock);					
//console.log("    offset ------");
//console.log(instance.offset);					
					render(instance.el, instance.clock);
				},
				instance.settings.delay);
				
				// launch event
				$(instance.el).trigger( "stopwatch.start" , [instance.start_time]);
			}
		};

		var pad2 =function (number) {
			return (number < 10 ? '0' : '') + number;
		};
		
		var FormatMilliseconds = function(millis) {
			var x, seconds, minutes, hours;
			x = millis / 1000;
			seconds = Math.floor(x % 60);
			x /= 60;
			minutes = Math.floor(x % 60);
			x /= 60;
			hours = Math.floor(x % 24);
			// x /= 24;
			// days = Math.floor(x);
			return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
		};




		/**
		 * Render clock in the element
		 * @param {Object} el
		 * @param {Object} clock
		 */
		var render = function(el, clock) {
			$(el).html(FormatMilliseconds(clock)); 
		};


		/**
		 * Stop the clock 
		 * @param {Object} instance
		 */
		var stop = function(instance) {
			if (instance.interval) {
				var stop_time = new Date();
				instance.running = false;
				clearInterval(instance.interval);
				instance.interval = null;
				// launch event
				$(instance.el).trigger( "stopwatch.stop", [instance.start_time, stop_time] );
			}
			
		};


		var delta = function(offset) {
//console.log("delta");
//console.dir(offset);
			var now = Date.now();
			var d   = now - offset;
	    
//			var offset = now;
			
//console.log("offset.date: d");
//console.dir(d);
			return d;
		};




		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.el = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
//console.log("stopwatch:init");
//console.dir(this);
					this.start_time = null;
					this.offset = null;
					this.interval = null;
					this.running = false;
					this.clock = 0;
				},
				start: function () {
//console.log("stopwatch:start");
					var instance = getInstance(this);
					start(instance);
				},
				stop: function () {
//console.log("stopwatch:stop");
					var instance = getInstance(this);
					stop(instance);
				},
				reset: function () {
//console.log("stopwatch:reset");
					var instance = getInstance(this);
					reset(instance);
				},
				isRunning: function () {
//console.log("stopwatch:isRunning");
					
					var instance = getInstance(this);
					return instance.running;
				},
				
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {

	    // If the first parameter is a string, treat this as a call to
	    // a public method.
	    if (typeof arguments[0] === 'string') {
	      var methodName = arguments[0];
	      var args = Array.prototype.slice.call(arguments, 1);
	      var returnVal;
	      this.each(function() {
	        // Check that the element has a plugin instance, and that
	        // the requested public method exists.
	        if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
	          // Call the method of the Plugin instance, and Pass it
	          // the supplied arguments.
	          returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
	        } else {
	          throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
	        }
	      });
	      if (returnVal !== undefined){
	        // If the method returned a value, return the value.
	        return returnVal;
	      } else {
	        // Otherwise, returning 'this' preserves chainability.
	        return this;
	      }
	    // If the first parameter is an object (options), or was omitted,
	    // instantiate a new instance of the plugin.
	    } else if (typeof options === "object" || !options) {
	      return this.each(function() {
	        // Only allow the plugin to be instantiated once.
	        if (!$.data(this, 'plugin_' + pluginName)) {
	          // Pass options to Plugin constructor, and store Plugin
	          // instance in the elements jQuery data object.
	          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
	        }
	      });
	    }


    };

})( jQuery, window, document );
