define([
    'jquery',
    'jqueryui'
], function ($) {
    $.widget('tossin.studentlist', {
        options: {},
        _create : function () {
            this.element.addClass('studentlist');
            this.element.text('This is the student list widget');
        },
        _destroy : function () {
            this.element.removeClass('studentlist');
        }

    });
});
