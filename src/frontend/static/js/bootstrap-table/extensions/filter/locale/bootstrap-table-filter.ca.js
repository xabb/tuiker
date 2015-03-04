/**
 * Bootstrap Table Filter Spanish translation
 * Author: Impalah (impalah@gmail.com)
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTableFilter.defaults, {
        formatRemoveFiltersMessage: function () {
            return 'Esborrar filtres';
        },
        formatSearchMessage: function () {
            return 'Buscar';
        },
        	
    });


    $.fn.bootstrapTableFilter.filterSources.range.rows[0].i18n.msg = 'Menor que';
    $.fn.bootstrapTableFilter.filterSources.range.rows[1].i18n.msg = 'Major que';
    $.fn.bootstrapTableFilter.filterSources.range.rows[2].i18n.msg = 'Igual a';

    $.fn.bootstrapTableFilter.filterSources.search.rows[0].i18n.msg = 'Igual';
    $.fn.bootstrapTableFilter.filterSources.search.rows[1].i18n.msg = 'Diferent';
    $.fn.bootstrapTableFilter.filterSources.search.rows[2].i18n.msg = 'Conté';
    $.fn.bootstrapTableFilter.filterSources.search.rows[3].i18n.msg = 'No Conté';
    $.fn.bootstrapTableFilter.filterSources.search.rows[4].i18n.msg = 'Està buit';
    $.fn.bootstrapTableFilter.filterSources.search.rows[5].i18n.msg = 'No està buit';

})(jQuery);