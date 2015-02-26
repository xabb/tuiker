jQuery(function(){ //DOM Ready

	// Initialize every autocomplete
//console.log("INIT: autocomplete");

//	$(".autocomplete").each(function (i) {
		
//		console.log(this.name);
		
//	    $(this).autocomplete({
//	      source: $(this).attr("data-url"),
//	      minLength: $(this).attr("data-min-length")
//	      minLength: 2
	      //create: function( event, ui ) { alert("creating");}
//	    });
		
//	});


	// Datepicker configuration https://github.com/eternicode/bootstrap-datepicker


	/**
	 * Launch edit on grid click 
	 */
	if($(".grid").length) {
		$(".grid").bootstrapTable().on('click-row.bs.table', function (e, row, $element) {
	
	//		alert('Event: click-row.bs.table, data: ' + JSON.stringify(row));

			// If not data-edit-url ignore
			if(typeof $(this).attr("data-edit-url") == "undefined") {
				return;
			}
	
			if($element.context.className != "bs-checkbox") {
				// Build url for edit/view
				var url = $(this).attr("data-edit-url");
				if (typeof url == 'undefined') {
					url = $(this).attr("data-url");
				}
				
				if(url.slice(-1) == "/") {
					// Remove
					url = url.substring(0, url.length-1);			
				}
		
				// Get field working as id
				var id_field = $(this).attr("data-key-field");
				
				// Get field content from row
				
				url += "/" + row[id_field];
				window.location.href = url;
				
			}
			
		});
		
	}



	// http://stackoverflow.com/questions/1225102/jquery-event-to-trigger-action-when-a-div-is-made-visible
	var _oldShow = $.fn.show;

	$.fn.show = function(speed, oldCallback) {
		return $(this).each(function() {
      		var obj = $(this), newCallback = function() {
           		if ($.isFunction(oldCallback)) {
	           		oldCallback.apply(obj);
	           	}
 	         	obj.trigger('afterShow');
        	};

	      	// you can trigger a before show if you want
    	  	obj.trigger('beforeShow');

	      	// now use the old function to show the element passing the new callback
    	  	_oldShow.apply(obj, [speed, newCallback]);
    	});
  };




});

/**
 * Grid formatter (list type) 
 * 
 * We will format like a list using the "name" property as label
 * @param {Object} value
 * @param {Object} row
 */
function listFormatter(value, row, index) {
//console.log(JSON.stringify(value));	
//console.log(JSON.stringify(row));	
//console.log(JSON.stringify(index));	

	var field = "name";
//	if(options.index) {
//		field = options.index;
//	}

	// Loop through values

	// Loop through config and set values
	var rlen = value.length;
	var ri = 0;

	// Create a UL element
	var $ul = $(document.createElement('ul'));

	
	// If data present
	if(rlen > 0) {
		// Loop through data			
		while(ri < rlen) {

			var $el_value = value[ri];
			var $value = $el_value[field];
								
// console.log($value);

			var $li = $(document.createElement('li'))
				.attr("title", $value)
				.html($value)
				.appendTo($ul); 

			ri++;
		}
		
	}

	// Just set the value in a span
	var v = $(document.createElement('span')); 
	$ul.appendTo(v);
	return v.html();		

}


function linkFormatter(value, row, index) {
// console.log(JSON.stringify(value));	
// console.log(JSON.stringify(row));	
// console.log(JSON.stringify(index));	

	var field = "name";
//	if(options.index) {
//		field = options.index;
//	}

	// Loop through values

	// Loop through config and set values
	var rlen = value.length;
	var ri = 0;

	// Create a href element
	var $href = $(document.createElement('a'));
	$href.attr("href", value.url);
	$href.text(value.name);

	// Just set the value in a span
	var v = $(document.createElement('span')); 
	$href.appendTo(v);
	return v.html();		

}






// Set language (from menu)
function set_language(lang_code) {
	
	// Search for hidden input
	$("#language").val(lang_code);

	// Submit form
	$("form#langform").submit();
	
}


