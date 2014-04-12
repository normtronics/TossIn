define([
    'jquery',
    'text!widgets/student-list/student-list.htm',
    'jqueryui'
], function ($, markup) {
    $.widget('tossin.studentlist', {
        options: {},
        _create : function () {
            var $element = $(markup);

            this.element.addClass('studentlist');

            this.element.append($element);
        },
        _destroy : function () {
            this.element.removeClass('studentlist');
        }

    });
});
