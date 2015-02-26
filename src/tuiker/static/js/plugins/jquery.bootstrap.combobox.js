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
		var pluginName = "combobox",
				defaults = {
					values: [],						// Values for the combo
					help_text: "Toggle dropdown",	// Help for screen readers
//					blank_element: true				// Include a blank element (not selectable)
		};


		/**
		 * Recover stored instance parameters 
		 */
		var getInstance = function(el) {
			return $.data(el, 'plugin_' + pluginName);
		};


		/**
		 * creates a list button
		 */
		var createOption = function(el, ul,key, text) {

			var $li = $(document.createElement("li"))
				.attr("data-key", key);

			// Attach event
			$li.click(function(e) {
				var $text = $(this).find("a").html();
				var $key = $(this).attr("data-key");
				
				
				if($(el).find(".combo-text").html() != $text) {
					
					$(el).find(".combo-text").html($text);
					// Lauch event
//console.log("listClick: " + $key + " " + $text);	
					$(el).trigger("change", [$key, $text]);
					
				}
				e.preventDefault();
			});

			var $a = $(document.createElement("a"))
				.html(text)
				.attr("href", "#")
				.appendTo($li);

			$li.appendTo($(ul));
			
		};

		/**
		 * Clear values from combo 
		 */
		var clear = function(el) {

//console.log("clear");
//console.dir(el);

			var $list_id = $(el).attr("id") + "_menu";
			$("#" + $list_id).html("");

			$(el).find(".combo-text").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

			
		};





		/**
		 * Render the element
		 * @param {Object} el
		 * @param {Object} options
		 */
		var render = function(el, options) {

//console.log("render");
//console.dir(options);
			
			// Add class
			$(el).addClass("btn-group");

			// Add text button
			var $bt_text = $(document.createElement("button"))
				.attr("id", $(el).attr("id") + "_text_button")
				.attr("type", "button")
				.addClass("btn")
				.addClass("btn-default")
				.addClass("combo-text")
				//.addClass("btn-xs")
				.appendTo($(el));
			
			// TODO: add default selected
			// .html({% trans "This week" %})
			$bt_text.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

			// Add dropdown
			var $bt_dd = $(document.createElement("button"))
				.attr("id", $(el).attr("id") + "_dd_button")
				.attr("type", "button")
				.attr("data-toggle", "dropdown")
				.addClass("btn")
				.addClass("btn-default")
				.addClass("dropdown-toggle")
				//.addClass("btn-xs")
				.appendTo($(el));

			$(document.createElement("span"))
				.addClass("caret")
				.appendTo($bt_dd);

			$(document.createElement("span"))
				.addClass("sr-only")
				.html(options.help_text)
				.appendTo($bt_dd);

			// Create menu options
			var $ul = $(document.createElement("ul"))
				.attr("id", $(el).attr("id") + "_menu")
				.attr("role", "menu")
				.addClass("dropdown-menu")
				.appendTo($(el));

			var len = options.values.length;
			var i = 0;
		

			if(len > 0) {
				// Loop through values
				while(i < len) {
					var $value = options.values[i];

					createOption(el, $ul, $value.key, $value.text);

					i++;
				}
			}
			
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
				this.values = this.settings.values;
				this.selected_key = "";
				this.selected_index = 0;
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
//console.log("combobox:init");
//console.dir(this);

					// Create the combo
					render(this.el, this.settings);



				},
				/***
				 * Set key for the combo 
				 * @param {Object} key blank key will show blank element selected
				 * @param {Object} launchEvent false by default
				 */
				setKey: function (key, launchEvent) {
//console.log("combobox:setKey --> " + key);

					// Optional parameter for launching event
					launchEvent = (typeof reload === "undefined") ? false : launchEvent;



					var instance = getInstance(this);

					// Check if key exists
					$el = $(this).find("ul > li[data-key='" + key +"']");
					if(key == "" || $el.length > 0) {
						// Element exists or key is "", set key
						instance.selected_key = key;
						
						var $text = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

						if(key != "") {
							$text = $el.find("a").html();
						}

						// Set value in control
						$(this).find(".combo-text").html($text);

						// TODO: launch event
						if(launchEvent == true) {
							$(instance.el).trigger("change", [key, $text]);
						}
						
					}

					
				},

				/**
				 * Change visibility 
				 * @param {Object} visible
				 */
				visible: function (visible) {
//console.log("combobox:visible --> " + visible);

					if(visible == true) {
						$(this).addClass("show");
						$(this).removeClass("hidden");
					} else {
						$(this).addClass("hidden");
						$(this).removeClass("show");
					}

				},


				/**
				 * Set values and render 
				 * @param {Object} values
				 */
				setValues: function (values) {
//console.log("combobox:setValues --> ");
//console.dir(values);

					var instance = getInstance(this);
					instance.settings.values = values;
					instance.selected_key = "";

					// clear options
					clear(instance.el);

					var $list_id = $(instance.el).attr("id") + "_menu";
					var $ul = $("#" + $list_id);

					var len = instance.settings.values.length;
					var i = 0;
				
					if(len > 0) {
						// Loop through values
						while(i < len) {
							var $value = instance.settings.values[i];
		
							createOption(instance.el, $ul, $value.key, $value.text);
		
							i++;
						}
					}
					
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
