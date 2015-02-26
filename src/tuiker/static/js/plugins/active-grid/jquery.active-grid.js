/*!
 * atlantico active grid jquery plugin
 * 
 * ai design studio 2013
 * 
 * Based on:
 * jQuery lightweight plugin boilerplate
 * 
 * References:
 * http://jqueryboilerplate.com/
 * http://f6design.com/journal/2012/05/06/a-jquery-plugin-boilerplate/
 * 
 * http://www.learningjquery.com/2007/10/a-plugin-development-pattern
 * http://stefangabos.ro/jquery/jquery-plugin-boilerplate-revisited/
 * 
 * http://extraordinarythoughts.com/2011/08/20/understanding-jquery-plugins/
 * 
 * http://docs.jquery.com/Plugins/Authoring
 * 
 * http://quirksmode.org/css/user-interface/textoverflow.html
 * 
 * ------------------------------------------------------------------------------------
 * 
 * TODO:
 * 		- columns length
 * 		- formula ?
 * 
 * 
 */

;(function ( $, window, document, undefined ) {


	$.cellUtils = {};

	$.extend($.cellUtils,{
		isBoolean : function(o) {
			return typeof o === 'boolean';
		},
		isObject : function(o) {
			return (o && (typeof o === 'object' || $.isFunction(o))) || false;
		},
		isString : function(o) {
			return typeof o === 'string';
		},
		isNumber : function(o) {
			return typeof o === 'number' && isFinite(o);
		},
		isNull : function(o) {
			return o === null;
		},
		isUndefined : function(o) {
			return o === undefined;
		},
		isValue : function (o) {
			return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
		},
		isEmpty : function(o) {
			if(!this.isString(o) && this.isValue(o)) {
				return false;
			}
			if (!this.isValue(o)){
				return true;
			}
			o = $.trim(o).replace(/\&nbsp\;/ig,'').replace(/\&#160\;/ig,'');
			return o==="";	
		},
		NumberFormat : function(nData,opts) {
			if(!$.cellUtils.isNumber(nData)) {
				nData *= 1;
			}
			if($.cellUtils.isNumber(nData)) {
				var bNegative = (nData < 0);
				var sOutput = String(nData);
				var sDecimalSeparator = opts.decimalSeparator || ".";
				var nDotIndex;
				if($.cellUtils.isNumber(opts.decimalPlaces)) {
					// Round to the correct decimal place
					var nDecimalPlaces = opts.decimalPlaces;
					var nDecimal = Math.pow(10, nDecimalPlaces);
					sOutput = String(Math.round(nData*nDecimal)/nDecimal);
					nDotIndex = sOutput.lastIndexOf(".");
					if(nDecimalPlaces > 0) {
					// Add the decimal separator
						if(nDotIndex < 0) {
							sOutput += sDecimalSeparator;
							nDotIndex = sOutput.length-1;
						}
						// Replace the "."
						else if(sDecimalSeparator !== "."){
							sOutput = sOutput.replace(".",sDecimalSeparator);
						}
					// Add missing zeros
						while((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
							sOutput += "0";
						}
					}
				}
				if(opts.thousandsSeparator) {
					var sThousandsSeparator = opts.thousandsSeparator;
					nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
					nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
					var sNewOutput = sOutput.substring(nDotIndex);
					var nCount = -1, i;
					for (i=nDotIndex; i>0; i--) {
						nCount++;
						if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
							sNewOutput = sThousandsSeparator + sNewOutput;
						}
						sNewOutput = sOutput.charAt(i-1) + sNewOutput;
					}
					sOutput = sNewOutput;
				}
				// Prepend prefix
				sOutput = (opts.prefix) ? opts.prefix + sOutput : sOutput;
				// Append suffix
				sOutput = (opts.suffix) ? sOutput + opts.suffix : sOutput;
				return sOutput;
				
			}
			return nData;
		}
		
	});




	/**
	 * Calls the appropiate cellBuilder for representing cell 
	 */
	$.cellBuilder = function(type, options, value) {

		if(_formats[type] !== "undefined") {
			options = $.extend({}, _formats[type], options);
		}

		try {
			var v = $.cellBuilder[type].call(this, value, options);
		} catch(fe){
			
			// Show error
//			showError(fe);
			// return empty element
			var v = $(document.createElement('span'))
				.attr("title", value)
				.html(value); 
		}
		return v;
		
	};

	/**
	 * Default formatter 
	 */
	$.cellBuilder.basic = function(value, options) {
		
		// Just set the value in a span
		var v = $(document.createElement('span'))
			.attr("title", value)
			.html(value); 

		return v;		
	};

	/**
	 * Builds a cell with a link for edition
	 */
	$.cellBuilder.edit = function(value, options) {
		
		// Just set the value in a span
		var v = $(document.createElement('a'))
			.attr("href", options.editUrl)
			.attr("title", value)
			.html(value); 

		return v;		
	};


	/**
	 * Buils a cell with date format 
	 * Expects a iso 8601 format
	 */
	$.cellBuilder.date = function (value, options) {

		if($.cellUtils.isEmpty(value)) {
			var $value = "";
		} else {
			var $myDate = new Date(value);
			// TODO: move to option defaults
			var dateFormat = "d/m/Y";
			if(options.dateFormat) {
				dateFormat = options.dateFormat;
			}
			var $value = $myDate.format(dateFormat);
		}

		var v = $(document.createElement('span'))
			.attr("title", $value)
			.html($value); 

		return v;		


	};

	/**
	 * Builds a cell with time format hh:mm:ss 
	 */
	$.cellBuilder.time = function (value, options) {

		if($.cellUtils.isEmpty(value)) {
			var $value = "";
		} else {

			var sec_num = parseInt(value, 10); // don't forget the second param
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours   < 10) {hours   = "0" + hours;}
			if (minutes < 10) {minutes = "0" + minutes;}
			if (seconds < 10) {seconds = "0" + seconds;}
			var $value = hours + ':' + minutes + ':' + seconds;
			
		}

		var v = $(document.createElement('span'))
			.attr("title", $value)
			.html($value); 

		return v;		

	};


	/**
	 * Loop through the list of objects and present a list 
	 */
	$.cellBuilder.list = function(values, options) {

//console.log("CELL: LIST");
//console.log("----------------------------------------");
//console.log(options);
//console.log(values);

		var field = "name";
		if(options.index) {
			field = options.index;
		}

		// Loop through values

		// Loop through config and set values
		var rlen = values.length;
		var ri = 0;

		// Create a UL element
		var $ul = $(document.createElement('ul'));

	
		// If data present
		if(rlen > 0) {



			
			// Loop through data			
			while(ri < rlen) {

				var $el_value = values[ri];
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

		return v;		
	};






	/**
	 * Calls the appropiate row builder depending on type 
	 */
	$.rowBuilder = function(type, node, columns, group_by, edit_url, options) {

		try {
			var v = $.rowBuilder[type].call(this, node, columns, group_by, edit_url, options);
		} catch(fe){
			
			// Show error
			showError(fe);
			
			// return empty element
			var v = $(document.createElement('span'))
				.html(""); 
		}
		return v;
	};


	$.rowBuilder.list = function(node, columns, group_by, edit_url, options) {


		// Create a row
		var $grow = $(document.createElement("tr"))
			.addClass("atg-row");

//		// Attach on click event
//		$grow.on( "click", function(e) {
//			if($(this).hasClass("atg-row-selected")) {
//				$(this).removeClass("atg-row-selected");
//			} else {
//				$(this).addClass("atg-row-selected");
//			}
//
//			// prevent event propagation to children
//			e.stopPropagation();
//				
//		});

		// Add data-id to row
		var $row_id = getRowId(columns, node);
		
		// TODO control errors for "undefined" ids
		$grow.attr("data-id", $row_id);

		// Iterate through columns and use id to get node data
		// TODO: quite unefficient...
		var cols = columns.length;
		var i = 0;

		while (i < cols) {

			var $col = columns[i];

			// Set format to grid data
			var $formatter = "default";
			var $format = getColumnFormat($col);
			
			// Formatter
			if(typeof($format) != "undefined" && typeof($format.formatter) != "undefined") {
				$formatter = $format.formatter;
			}

			// Create cell div
			var $cell = $(document.createElement("td"))
//			.addClass("atg-content-ellipsis")
			.addClass("atg-cell");		

			// Dirty trick:
			// "ellipsis" only works "well" with TD so add when content is:
			//	- Default
			//	- Edit
			if($formatter == "basic" || $formatter == "edit") {
				$cell.addClass("atg-content-ellipsis");
			}

			// Set cell properties
			if($col.hidden == true || $col.hidden == 'true') {
				$cell.hide();
			}

			if(typeof $col.align != "undefined") {
				$cell.addClass("text-" + $col.align);
			}

			// Set width
			if(typeof $col.width != "undefined") {
				$cell.css("width", $col.width);
			}

			// Set value (always inside a span)
//			$val_span = $(document.createElement("span"))
//				.html(node[$col.index])
//				.appendTo($cell);


			// Add custom edit url
			if($formatter == "edit") {
				if ($.isFunction(options.buildEditUrlFunction )) {
					$format.editUrl = options.buildEditUrlFunction.call(this, $row_id, options);
				} else {
					$format.editUrl = buildEditUrl($row_id, options);
				}
				
			}

			// Format cell value
			var $cell_value = $.cellBuilder($formatter, $format, node[$col.index]);
			$cell_value.appendTo($cell);

			$cell.appendTo($grow);

			// Format column

		
			i++;	
		}


		return $grow;
		
	};


	/**
	 * Builds a row with empty elements 
	 */
	$.rowBuilder.emptyList = function(node, columns, group_by, edit_url, options) {

		// Create a row
		var $grow = $(document.createElement("tr"))
			.addClass("atg-empty-row");

		// Iterate through columns and use id to get node data
		// TODO: quite unefficient...
		var cols = columns.length;
		var i = 0;

		while (i < cols) {

			var $col = columns[i];

			// Create cell div
			var $cell = $(document.createElement("td"))
				.html("&nbsp;")
				.addClass("atg-empty-cell");		

			// Set cell properties
			if($col.hidden == true || $col.hidden == 'true') {
				$cell.hide();
			}

			$cell.appendTo($grow);
		
			i++;	
		}


		return $grow;
		
	};



	/**
	 * Allowed formats 
	 */	
	var _formats = {
		integer : {thousandsSeparator: " ", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0.00'},
		bool : { defaultValue: 'false'},
		currency : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'}
	};


	
    // Create the defaults once
    var pluginName = "activeGrid",
        defaults = {
        	
			url: "",			// URL for receiving data
			configUrl: "",		// Configuration url (for receiving column definition)
			
			editUrl: "",		// Edit url (clicking on an edit element will redirect to the edit window)
			addUrl: "",			// Add url (clicking on an edit element will redirect to the edit window)
			delUrl: "",			// Delete url (clicking on an edit element will redirect to the edit window)

			data: "",			// Direct data injection
			dataCount: 0,		// Total elements in query
			
			title:		"",		// Grid caption. not shown if empty
//			tree:		false,	// Indicates if it's tree

			viewMode: "list",	// Indicates viewmode
								// list - typical list with rows and columns
								// icons - active tiles (icon view)
								// tree - treeview of the data (expects special format)
			filter: null,			// Filter to pass to the service

			query: [],			// Query to pass to the service (buildUrl)


			keepHeight: true,	// Keep grid height (maintains number of rows even with empty data) 

			dynamicLoading: false,	// Ignore pagination and load dinamically on scroll

			showCheckboxes: true,	// First column will be checkboxes for element selection

			pageSize: 10,		// Number of elements per page
			
			orderBy: "",			// name of the index for sorting
			groupBy: "",			// list of fields for grouping

			showHeader: true,	// Indicates if the header should be shown

			columns: [],			// Columns definition

			dynamic: false,		// Show or hide the navigation bar

			cellEdit: false,		// Indicates if cells can be edited inline

			// External functions
			buildUrlFunction: 'buildUrl',
			buildEditUrlFunction: 'buildEditUrl',
			buildDeleteUrlFunction: 'buildDeleteUrl',
			
			fillDataFunction: 'fillData',

			timeout:	3000,	// Basic timeout for AJAX requests
			datatype:	"json",	// data type. By now only JSON allowed
			httptype: 	"GET"	// ajax http type of communication (GET, POST)
        };


	/**
	 * Recover stored instance parameters 
	 */
	var getInstance = function(el) {
		return $.data(el, 'plugin_' + pluginName);
	};


	/**
	 * Show error 
	 */
    var showError = function(error) {
	    
		// Enable reload, always
		$(".active-grid-error p")
			.html(error);
		
		$(".active-grid-error")
			.fadeIn();

    };


	var createErrorDiv = function(el) {
		
		var $e_div = $(document.createElement("div"))
			.addClass("alert")
			.addClass("alert-danger")
			.addClass("active-grid-error")
			.attr("role", "alert")
			.hide()
			.appendTo(el);
		
		$(document.createElement("p"))
			.appendTo($e_div);
		
	};

	/**
	 * Returns the format defined in a column
	 * Return undefined if no format specified
	 */
	var getColumnFormat = function(col) {
		
		var $format = undefined;
		// Formatter
		if(typeof(col.format) != "undefined") {
			$format = col.format;
		}

		return $format;
		
	};


	/**
	 * Get row id (search for "key=true" in columns definition) 
	 */
	var getRowId = function(colModel, node) {

		var $id = undefined;
		
		// Loop through columns looking for keys
		var ni = 0;					
		var cols = colModel.length;
		while (ni < cols) {

			if(typeof(colModel[ni].key) != "undefined" && (colModel[ni].key == true || colModel[ni].key == 'true')) {
				name = colModel[ni].index;
				$id = node[name];
				return $id;
			}

			ni++;
		}

		return $id;
		
	};


	/**
	 * Creates toolbar
	 * TODO: create button groups (i.e. edit, search, pagination...) 
	 */
	var createToolbar = function(el, params, instance) {

// console.log("createToolbar " + $(el).attr("id"));
// console.dir(instance.options);

		var instance_id = $(instance.el).attr("id");
// console.log("    instance ID: " + instance_id);


		// Create toolbar
		var $toolbar = $(document.createElement("div"))
			.addClass("atg-toolbar")
			.addClass("btn-toolbar")
			.appendTo(el);

		// Dynamic will only present a "load more" button
		if(params.dynamic) {
			
			instance.options.dynamic = true;
			
			var $tb_more = $(document.createElement("button"))
				.attr("id", "bt-sh-desc")
				.attr("type", "button")
				.addClass("btn")
				.addClass("btn-default")
				.addClass("btn-xs")
				.appendTo($toolbar);
	
			$(document.createElement("span"))
				.addClass("glyphicon")
				.addClass("glyphicon-refresh")
				.appendTo($tb_more);
	
			$tb_more.append("&nbsp;" + gettext("Load more"));	
	
			$tb_more.on( "click", function() {
				
// console.log("#Load more " + $(instance).attr("id") + " ----> " + instance.page_info.page);

				instance.page_info.page += 1;
				loadData(instance.el, instance.options, instance.page_info);
				
			});
			
			
		} else {

			// Select toolbar buttons
			if(params.add) {
				var $tb_new = $(document.createElement("button"))
					.attr("id", "bt-add-node")
					.attr("type", "button")
					.addClass("btn")
					.addClass("btn-default")
					.addClass("btn-xs")
					.appendTo($toolbar);
		
				$(document.createElement("span"))
					.addClass("glyphicon")
					.addClass("glyphicon-plus-sign")
					.appendTo($tb_new);
		
				$tb_new.append("&nbsp;" + gettext("New"));	

				// Attach click event
				var $addUrl = instance.options.addUrl;
				if ($addUrl == "") {
					// Build add url using "edit" url + "add"
					$addUrl = instance.options.editUrl;
					if($addUrl.slice(-1) == "/") {
						// Remove
						$addUrl = $addUrl.substring(0, $addUrl.length-1);			
					}
			
					$addUrl += "/add/";
				}

				$tb_new.on( "click", function() {

// console.log("#NEW " + $(instance).attr("id"));

					// Redirect to new url
					window.location.href = $addUrl;
					
				});


				
			}
	
			if(params.edit) {
				
			}
	
			if(params.del) {
				
				var $tb_delete = $(document.createElement("button"))
					.attr("id", "bt-del-node")
					.attr("type", "button")
					.addClass("disabled")
					.addClass("btn")
					.addClass("btn-default")
					.addClass("btn-xs")
					.appendTo($toolbar);
		
				$(document.createElement("span"))
					.addClass("glyphicon")
					.addClass("glyphicon-minus-sign")
					.appendTo($tb_delete);
		
				$tb_delete.append("&nbsp;" + gettext("Delete"));	
				
			}
	
			// Never allow refresh if direct data injection
			if(params.refresh && instance.options.data =="") {
	
				// Separator
				$(document.createElement("div"))
					.addClass("btn")
					.addClass("disabled")
					.appendTo($toolbar);
	
				var $tb_refresh = $(document.createElement("button"))
					.attr("id", "bt-sh-desc")
					.attr("type", "button")
					.addClass("btn")
					.addClass("btn-default")
					.addClass("btn-xs")
					.appendTo($toolbar);
		
				$(document.createElement("span"))
					.addClass("glyphicon")
					.addClass("glyphicon-refresh")
					.appendTo($tb_refresh);
		
				$tb_refresh.append("&nbsp;" + gettext("Refresh"));	
		
				$tb_refresh.on( "click", function() {

// console.log("#Refresh " + $(instance).attr("id"));
					
					// Refresh grid (init filters and reload)
					instance.page_info.orderBy = instance.options.orderBy;
					instance.page_info.page = 1;
					// Reload data
					
					loadData(instance.el, instance.options, instance.page_info);
					
				});
				
			}
	
			if(params.search) {
	
				// Separator
				$(document.createElement("div"))
					.addClass("btn")
					.addClass("disabled")
					.appendTo($toolbar);
				
			}

			if(params.pagination) {
	
				// Separator
				$(document.createElement("div"))
					.addClass("btn")
					.addClass("disabled")
					.appendTo($toolbar);
	
				if(instance.options.data == "") {
	
					var $tb_first = $(document.createElement("button"))
						.attr("id", "bt-sh-desc")
						.attr("type", "button")
						.addClass("atg-tb-first")
						.addClass("disabled")
						.addClass("btn")
						.addClass("btn-default")
						.addClass("btn-xs")
						.appendTo($toolbar);
			
					$(document.createElement("span"))
						.addClass("glyphicon")
						.addClass("glyphicon-fast-backward")
						.appendTo($tb_first);
			
					$tb_first.append("&nbsp;" + gettext("First"));	
			
					$tb_first.on( "click", function() {
						
						instance.page_info.page = 1;
						loadData(instance.el, instance.options, instance.page_info);
				
						
					});
	
				}
	
	
	
				var $tb_prev = $(document.createElement("button"))
					.attr("id", "bt-sh-desc")
					.attr("type", "button")
					.addClass("atg-tb-prev")
					.addClass("disabled")
					.addClass("btn")
					.addClass("btn-default")
					.addClass("btn-xs")
					.appendTo($toolbar);
		
				$(document.createElement("span"))
					.addClass("glyphicon")
					.addClass("glyphicon-backward")
					.appendTo($tb_prev);
		
				$tb_prev.append("&nbsp;" + gettext("Prev"));	
		
				$tb_prev.on( "click", function() {

					instance.page_info.page--;
					if(instance.page_info.page < 1) {
						instance.page_info.page = 1;
					}
					loadData(instance.el, instance.options, instance.page_info);

				});
	
	
				if(instance.options.data == "") {
					// Page indicator
					$(document.createElement("span"))
						.addClass("atg-page-indicator")
						.html(gettext("Page x of y"))
						.appendTo($toolbar);
				} else {
					$(document.createElement("div"))
						.addClass("btn")
						.addClass("disabled")
						.appendTo($toolbar);
	
				}
	
				var $tb_next = $(document.createElement("button"))
					.attr("id", "bt-sh-desc")
					.attr("type", "button")
					.addClass("atg-tb-next")
					.addClass("disabled")
					.addClass("btn")
					.addClass("btn-default")
					.addClass("btn-xs")
					.appendTo($toolbar);
		
				$(document.createElement("span"))
					.addClass("glyphicon")
					.addClass("glyphicon-forward")
					.appendTo($tb_next);
		
				$tb_next.append("&nbsp;" + gettext("Next"));	
		
				$tb_next.on( "click", function() {

					instance.page_info.page++;
					if(instance.page_info.page > instance.page_info.pages) {
						instance.page_info.page = instance.page_info.pages;
					}
					loadData(instance.el, instance.options, instance.page_info);

				});
	
	
				if(instance.options.data == "") {
	
					var $tb_last = $(document.createElement("button"))
						.attr("id", "bt-sh-desc")
						.attr("type", "button")
						.addClass("atg-tb-last")
						.addClass("disabled")
						.addClass("btn")
						.addClass("btn-default")
						.addClass("btn-xs")
						.appendTo($toolbar);
			
					$(document.createElement("span"))
						.addClass("glyphicon")
						.addClass("glyphicon-fast-forward")
						.appendTo($tb_last);
			
					$tb_last.append("&nbsp;" + gettext("Last"));	
			
					$tb_last.on( "click", function() {
//console.log("#LAST " + instance_id);
//console.log("    ID " + $(el).attr("id"));
//console.log("    instance ");
//console.dir(instance);
						instance.page_info.page = instance.page_info.pages;
						loadData(instance.el, instance.options, instance.page_info);
										
					});
	
				}
				
			}
	
	
			// Separator
			$(document.createElement("div"))
				.addClass("btn")
				.addClass("disabled")
				.appendTo($toolbar);
	
			// Number of Registers indicator
			$(document.createElement("span"))
				.addClass("atg-registers-indicator")
				.html(gettext("Registers: X"))
				.appendTo($toolbar);

			
		}


		
	};




	/**
	 * Create table header 
	 */
	var createHeader = function(table, el,  cols, options, page_info) {
		
		// Header
		var $thead = $(document.createElement("thead"))
			.addClass("atg-header")
			.appendTo(table);

		// Cells. Defined in _options.columns
		var len = cols.length;
		var i = 0;

		var c_id_preffix = "t_" + $(el).attr("id") + "_th_";

		// Add checkboxes column
		if(options.showCheckboxes) {
			// Add a column, add a checkbox
		}

		if(len > 0) {
			
			// Loop through columns
			while(i < len) {

				var $column = cols[i];

				var $column_cell = $(document.createElement("th"))
					.addClass("atg-cell")
					.attr("id", c_id_preffix + $column.index)
//					.html($column.label)
					.appendTo($thead);

				// Add styles, visibility, align...
				if($column.hidden == true || $column.hidden == 'true') {
					$column_cell.hide();
				}

				if(typeof $column.align != "undefined") {
					$column_cell.addClass("text-" + $column.align);
				}

				// Set width
				if(typeof $column.width != "undefined") {
					$column_cell.css("width", $column.width);
				}


				// Add column content inside a span
				var $column_content = $(document.createElement('span'))
					.html($column.label)
					.appendTo($column_cell); 


				// Decode column sortable
				if(typeof $column.sortable != "undefined") {

					if ($column.sortable == true || $column.sortable == 'true') {

						// Column will have a link with ordering arrows
						var $column_sort = $(document.createElement('span'))
							.addClass("atg-header-margin")
							.addClass("glyphicon")
							.addClass("glyphicon-sort")
							.appendTo($column_cell); 

						$column_cell.addClass("atg-header-sortable");
						
						
						// Add event for reordering
						$column_cell.on( "click", function() {

							var order_by = page_info.orderBy;
							var c_id = $(this).attr("id").substring(c_id_preffix.length);
							
//console.log("#Column SORT click " + " current orderBy ----> " + order_by);
//console.log("column.id " + " ----> " + c_id);

							// Check current order by
							var s_i = order_by.indexOf(c_id);

							switch(s_i) {
								case 0:
									// Is the same field, will send a -field
									order_by = "-" + c_id;
									break;
								case 1:
									order_by = c_id;
									break;
								default:
									order_by = c_id;
									break;
							}

							// Delete icon from each header and attach
							// new icon depending on order
							//updateOrderIcon(el, order_by);

							page_info.orderBy = order_by;
							page_info.page = 1;
						
							loadData(el, options, page_info);
				
						});


						
					}

					
				}
				

				





				i++;
			}
		}


	};


	/***
	 * Update order by icon depending on field 
	 */
	var updateOrderIcon = function(el, order_by) {

//console.log("updateOrderIcon ORDER: " + order_by);			


		var c_id_preffix = "t_" + $(el).attr("id") + "_th_";
		var $headers = $(el).find("thead > th");

		var $field = order_by;
		var $order = "";

		var s_i = order_by.indexOf("-");

		if(s_i != -1) {
			$order = "-";
			$field = order_by.substring(1);
		}

//console.log("updateOrderIcon FIELD: " + $field);			
//console.log("updateOrderIcon ORDER: " + $order);			

		$headers.each(function(index, value) {

			// Get the icon span
			$icon = $(this).find(".glyphicon");

			
			$icon.removeClass("glyphicon-sort");			
			$icon.removeClass("glyphicon-arrow-up");			
			$icon.removeClass("glyphicon-arrow-down");			
			

			var c_id = $(this).attr("id").substring(c_id_preffix.length);
//console.log("updateOrderIcon TH id: " + c_id);			

			if(c_id == $field) {
				
				// Add sort icon
				if($order == "-") {
					$icon.addClass("glyphicon-arrow-up");
				} else {
					$icon.addClass("glyphicon-arrow-down");
				}
				
			} else {

				// Check if it's sortable
				if($(this).hasClass("atg-header-sortable")) {
					$icon.addClass("glyphicon-sort");
				}
				
			}
			
		});
		
	};




	/**
	 * Creates the basic structure for a list 
	 */
	var createListStructure = function (el, options, page_info) {

//console.log("createListStructure " + $(el).attr("id"));
		
		// Create master div
		var $table_div = $(document.createElement("table"))
			.addClass("atg-table")
			.addClass("table")
//			.addClass("table-responsive")
//			.addClass("table-striped")
//			.attr("id", "t_" + _id)
			.attr("id", "t_" + $(el).attr("id"))
			.appendTo(el);


		if(options.showHeader == true) {
			createHeader($table_div, el, options.columns, options, page_info);
		}
		
		// Create body
		var $tbody = $(document.createElement("tbody"))
			.addClass("atg-body")
			.appendTo($table_div);


//		createFooter($table_div);


		
	};


	/**
	 * Creates basic iconview structure 
	 */
	var createIconStructure = function (el, options) {
		
	};




	/**
	 * Creates the grid structure (fixed and custom columns) 
	 */
	var createStructure = function (el, options, fields, page_info) {

//console.log("Create structure " + $(el).attr("id"));

		// Add class table responsive
		$(el).addClass("table-responsive");


		// Store columns in its own variable
//		if(options.columns.length == 0) {
//			_columns = options.colums;
//		}

		// Create Loading div
		// TODO: improve loading div...
		$(document.createElement("div"))
			.addClass("atg-loading-div")
			.html(gettext("Loading") + "...")
			.appendTo(el)
			.hide();
		

		// print depending on mode
		if(options.viewMode == "list") {
			createListStructure(el, options, page_info);
		} else if(options.viewMode == "icons") {
			createIconStructure(el, options);
		} else {
			// show error
			showError(gettext("unrecognized view option: ") + options.viewMode);
			return false;
		}

	};


	/**
	 * Set pagination variables and activate deactivate controls 
	 */
	var setPagination = function(el, data) {

//console.log("setPagination " +$(el).attr("id"));
//console.dir(el);

		var instance = getInstance(el);

//console.dir(instance);

		// Recover pagination params
		instance.page_info.total = parseInt(data.records);

		instance.page_info.page = parseInt(data.page);
		instance.page_info.pages = parseInt(data.total);

		// Set pages label
		// TODO improve pages label
		$(".atg-page-indicator").html(gettext("Page") + "&nbsp;" + instance.page_info.page + "&nbsp;" + gettext("of") + "&nbsp;" + instance.page_info.pages);

		// Set total registers label
		// TODO improve registers label
		$(".atg-registers-indicator").html(gettext("Registers") + ":&nbsp;" + instance.page_info.total);

		// Activate/deactivate buttons
		if(instance.page_info.page==1 || instance.page_info.page === 0) {
			$(".atg-tb-first").addClass("disabled");
			$(".atg-tb-prev").addClass("disabled");
		} else {
			$(".atg-tb-first").removeClass("disabled");
			$(".atg-tb-prev").removeClass("disabled");
			
		}
		if(instance.page_info.page==instance.page_info.pages || instance.page_info.page === 0) {
			$(".atg-tb-next").addClass("disabled");
			$(".atg-tb-last").addClass("disabled");
		} else {
			$(".atg-tb-next").removeClass("disabled");
			$(".atg-tb-last").removeClass("disabled");
		}

		
	};




	/**
	 * Fill the grid with data depending on format
	 * in this case will be:
	 * {"records": 509, "total": 51, "rows": [], , "page": 1 }
	 */
	var fillData = function (el, data, options) {
		
//console.log("filldata " + $(el).attr("id"));
//console.log("    data ");
//console.dir(data);
//console.log("    options ");
//console.dir(options);

		// Get body
		var $body = $(el).find(".atg-body");

		if(!options.dynamic) {
			$body.html("");
		}

		var rows = [];

		// If no pagination data will be an array
		if(data instanceof Array) {
			rows = data;
		} else {
			rows = data.rows;
			setPagination(el, data);
		}

		_visible_columns = getVisibleColumns(options.columns);

// console.dir(rows);


//		// Group?
//		if(_options.groupBy != "") {
//			grouped_data = _.groupBy(rows, _options.groupBy);
//console.dir(grouped_data);			
//		}

		// Loop through config and set values
		var rlen = rows.length;
		var ri = 0;
	
		// If data present
		if(rlen > 0) {
			
			// Loop through data			
			while(ri < rlen) {

				var $node = rows[ri];

// TODO Change to external function
				// First check if group_by specified
				if(options.groupBy != "") {
					
					// Check if a row with the given value exists
					var group_row_id = $node[options.groupBy];
		
					var $group_row = $body.find("#gr_id_" + group_row_id);	
		
					if($group_row.length == 0) {
						// Add a row with the given group			
						$group_row = $(document.createElement("tr"))
							.attr("id", "gr_id_" + group_row_id)
							.addClass("atg-group-row");
							
						var $group_cell = $(document.createElement("td"))
									.addClass("atg-cell");		
									
						// Do a colspan to extend the cell to the end of the table
						$group_cell.attr("colspan", _visible_columns);
									
						var $g = $(document.createElement('span'))
						.attr("title", group_row_id)
						.html(group_row_id); 
			
						$g.appendTo($group_cell);
			
									
						$group_cell.appendTo($group_row);
	
	
						$group_row.appendTo($body);
						
					}							
		
						
				}

// END Change to external function



				// Create the row
				var $row = $.rowBuilder(options.viewMode, $node, options.columns, options.groupBy, options.editUrl, options);
				$row.appendTo($body);

				ri++;
			}
			
		}

		if(options.keepHeight == true) {
			// Add extra empty rows if grid not full
			var nlen = options.pageSize - rlen;
			var ni = 0;

			while (ni < nlen) {
				// Create a row
				var $row = $.rowBuilder("emptyList", null, options.columns, options.groupBy, options.editUrl, options);
					
				$row.appendTo($body);
				
				ni++;
			}

		}

		
	};



	/**
	 * Build url for loading data concatenating url parts 
	 * Ignore "prev" and "next" urls and build custom url
	 */
	var buildUrl = function (el, options, page_info, extra_params) {

//console.log("buildUrl " + $(el).attr("id"));

		var url = options.url;
		var url_params = [];

		var p = "";

		if(options.viewMode != "tree") {
			// Send pagination stuff
			
			// TODO: control not valid value
			url_params["_rows"] = options.pageSize;
			url_params["_page"] = page_info.page;
			
			if(page_info.orderBy != "") {
				url_params["_orderby"] = page_info.orderBy;
			}
			
			if(options.groupBy != "") {
				url_params["_groupby"] = options.groupBy;
			}

		}

		// Add filter params
		if(options.filter != null) {

//console.dir(options.filter);

			for (key in options.filter) {
				url_params[key] = options.filter[key];
			}
		}


//console.dir(url_params);
//console.dir(extra_params);

		if(Object.keys(url_params).length > 0) {
			for (key in url_params) {
				if(p != "") {
					p += "&";
				}

				p += key + "=" + url_params[key];
			}
		}

		// Send extra params
		if(typeof extra_params != "undefined") {
			for(key in extra_params) {
				if(p != "") {
					p += "&";
				}
				p += key + "=" + extra_params[key];
			}
		}


//console.log(p);

		url += "?" + p;

//console.log(url);

		return url;		
	};


	/**
	 * Build url for redirecting when clicking on element 
	 */
	var buildEditUrl = function (id, options) {

// console.log("buildEditUrl " + id);

		var url = options.editUrl;

		// By default will be editurl/id
		if(url == "") {
			// Assign "url"
			url = options.url;
		}		

		if(url.slice(-1) == "/") {
			// Remove
			url = url.substring(0, url.length-1);			
		}

		url += "/" + id;

// console.log(url);

		return url;		
	};




	/**
	 * Returns the number of visible columns 
	 * TODO: improve with regex (maybe)
	 */
	var getVisibleColumns = function(columns) {
		var vc = 0;

		var cols = columns.length;
		var i = 0;

		while (i < cols) {

			var $col = columns[i];

			// Set cell properties
			if(!($col.hidden == true) || !($col.hidden == 'true')) {
				vc++;				
			}

			i++;	
		}

		return vc;
	};


	/**
	 * Load data from given url
	 */
	var loadData = function(el, options, page_info, params) {

//console.log("loadData " + $(el).attr("id"));
//console.log("    Pageinfo ");
//console.dir(page_info);

		// Hide error window
		$(".active-grid-error")
			.hide();

		var data_url = "";
		
		// Create url
		if ($.isFunction(options.buildUrlFunction )) {
			data_url = options.buildUrlFunction.call(this, el, options, page_info, params);
		} else {
			data_url = buildUrl(el, options, page_info, params);
		}

//console.log("loadData - url " + data_url);

		var $load_div = $(el).find(".atg-loading-div");


		$.ajax({
		        url: data_url,
		        context: this,
		        async: true,
		        dataType: options.datatype,
		        beforeSend: function(obj){
		        	// Show loading div
		        	$load_div.show();
		        },

		        complete: function(obj, success){
		        	$load_div.hide();
		        },

		        error: function(obj, msg, obj2){
		        	$load_div.hide();

		        	// check if error 404 (NOT FOUND) and ignore
		        	if(obj.status != 404) {
			        	showError(gettext("Error") + "&nbsp;" + obj2);
		        	} else {
		        		// Show no data on status line
		        	}
		        },
		        global: true,
		        ifModified: false,
		        processData:true,
		        success: function(data){
//console.log("Loading data " + $(el).attr("id"));		        	
//console.dir(el);
//					_rows = data;

					// Launch event for allowing to preprocess data
					$(el).trigger("beforeLoad", data);

					if ($.isFunction(options.fillDataFunction )) {
						data_url = options.fillDataFunction.call(this, el, data, page_info);
					} else {
						data_url = fillData(el, data, options, page_info);
					}

					// Delete icon from each header and attach
					// new icon depending on order
					updateOrderIcon(el, page_info.orderBy);

					// Launch event after loading
					$(el).trigger("afterLoad", data);
					
					
//					fillRows(el, data);
					// TMP - launch a trigger
//					$(el).trigger("data.loaded");
		        },
		        timeout: options.timeout,
		        type: options.httptype
		});

    	
	};




    // The actual plugin constructor
    function Plugin( element, options ) {
    	
		// References to DOM and jQuery versions of element.
		this.el = element;

//		_el = element;
//		$_el = $(element);    	

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
//        _options = $.extend( {}, defaults, options);
//		_id = $_el.attr("id");
		
		this._id = $(element).attr("id");
        this.options = $.extend( {}, defaults, options) ;

		// Global variables for pagination
		this.page_info = {
			total : 0,		// Number of registers
			page : 1,		// Current page
			pages : 0,		// Number of pages
			orderBy: this.options.orderBy
		};

        
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
        
    }

    Plugin.prototype = {


		init: function() {
			
//console.log("Loading: " + this._id);

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).


			// Create error div
			createErrorDiv(this.el);
            
			// Store ID				
//			this._id = $(this.element).attr("id");
			
			// Store options
//			_options = this.options;


			// Recover pagination parameters
//			_page_size = _options.pageSize;
			
			// Load columns definition (if config url defined)
			if(this.options.configUrl != "") {
//				loadConfig();				
			} else {
				_columns = this.options.columns;
			}


			// Create Grid structure
			createStructure(this.el, this.options, _columns, this.page_info);
            
            // Load data
            if(this.options.data != "") {

            	this.total = this.options.dataCount;
            	
            	// TODO: load pagination params
            	
            	// Direct data loading
            	// Convert data to datatype
				// TODO: do XML conversion and so on. By now only JSON
				if(this.options.datatype == "json") {
					this.rows = $.parseJSON(this.options.data);
				}
            	
//            	fillRows(this.element, rdata);
            	
            	
            } else if(this.options.url != "") {
            	loadData(this.el, this.options, this.page_info);
            }
            
            
        },



		/**
		 * Reload grid data
		 * with the data inside grid
		 */
		reload: function () {
			
			var instance = getInstance(this);

			// Clear
			var $body = $(instance.el).find(".atg-body");

			if($body.length > 0) {
				$body.html("");
			}	

			// Reload			
			instance.page_info.page = 1;
			loadData(instance.el, instance.options, instance.page_info);
			
		},

		/**
		 * Set filter and reload grid 
		 */
		setFilter: function (filter, reload) {

			// Optional parameter reload
			reload = (typeof reload === "undefined") ? true : reload;
			
			var instance = getInstance(this);

			instance.options.filter = filter;

			if(reload == true) {
				// Clear
				var $body = $(instance.el).find(".atg-body");
	
				if($body.length > 0) {
					$body.html("");
				}	
	
				// Reload			
				instance.page_info.page = 1;
				loadData(instance.el, instance.options, instance.page_info);
			}

			
		},







		/**
		 * Set option to the given value 
		 */
		setOption: function (name, value) {
			
			var instance = getInstance(this);
			instance.options[name] = value;
			
		},

		/**
		 * Set data an reload grid 
		 */
		setData: function (data) {
			
			var instance = getInstance(this);

			if ($.isFunction(instance.options.fillDataFunction )) {
				data_url = instance.options.fillDataFunction.call(this, instance.el, data, instance.page_info);
			} else {
				data_url = fillData(instance.el, data, instance.options, instance.page_info);
			}

		},

		/**
		 * Clear data from grid 
		 */
		clear: function () {
			
			var instance = getInstance(this);

			// Get body
			var $body = $(instance.el).find(".atg-body");

			if($body.length > 0) {
				$body.html("");
				
			}	
		},





		/**
		 *  Builds toolbar
		 *  	elem: html div for creating toolbar
		 * 		params: toolbar params
		 */
		toolbar: function (elem, params) {
			buttons = $.extend( {},
				{
					dynamic: false,	// If true, pagination will be eliminated and a button for dynamic loading will appear
					add: true,
					edit: false,
					del: true,
					search: true,
					refresh: true,
					pagination: true,
					next: "",
					previous: ""
				},
				params);
				
			// options from data
			var instance = getInstance(this);
			
			// Build toolbar
			createToolbar(elem, buttons, instance);
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


