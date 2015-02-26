/**
 * Bootstrap Table Spanish (Argentina) translation
 * Author: Felix Vera (felix.vera@gmail.com)
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        formatLoadingMessage: function () {
            return 'Carregant, esperi sisplau...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return pageNumber + ' registres per pàgina';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return 'Mostrant ' + pageFrom + ' a ' + pageTo + ' de ' + totalRows + ' files';
        },
        formatSearch: function () {
            return 'Buscar';
        },
        formatNoMatches: function () {
            return 'No s\'han trobat registres';
        },
		// Added by Impalah
        formatRefresh: function () {
            return 'Recarregar';
        },
        formatToggle: function () {
            return 'Alternar vista';
        },
        formatColumns: function () {
            return 'Columnes';
        },


        
    });
})(jQuery);