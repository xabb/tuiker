/**
 * Bootstrap Table Filter Spanish translation
 * Author: Impalah (impalah@gmail.com)
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTableFilter.defaults, {
        formatRemoveFiltersMessage: function () {
            return 'Remove filters';
        },
        formatSearchMessage: function () {
            return 'Search';
        },
        	
    });


    $.fn.bootstrapTableFilter.filterSources.range.rows[0].i18n.msg = 'Less than';
    $.fn.bootstrapTableFilter.filterSources.range.rows[1].i18n.msg = 'More than';
    $.fn.bootstrapTableFilter.filterSources.range.rows[2].i18n.msg = 'Equals';

    $.fn.bootstrapTableFilter.filterSources.search.rows[0].i18n.msg = 'Equals';
    $.fn.bootstrapTableFilter.filterSources.search.rows[1].i18n.msg = 'Not equals';
    $.fn.bootstrapTableFilter.filterSources.search.rows[2].i18n.msg = 'Contains';
    $.fn.bootstrapTableFilter.filterSources.search.rows[3].i18n.msg = 'Doesn\'t contain';
    $.fn.bootstrapTableFilter.filterSources.search.rows[4].i18n.msg = 'Is empty';
    $.fn.bootstrapTableFilter.filterSources.search.rows[5].i18n.msg = 'Is not empty';

})(jQuery);