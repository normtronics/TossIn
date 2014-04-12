define([
    'jquery',
    'text!widgets/student-list/student-list.htm',
    'stringutil',
    'jqueryui'
], function ($, markup, stringutil) {
    var studentMarkup =
        '<div data-name="{0}" class="student-list-item">{0}</div>';

    $.widget('tossin.studentlist', {
        options: {},
        addStudent : function (name) {
            var that = this,
                $studentListItem = $(stringutil.format(studentMarkup, name));

            $studentListItem.on('click', function () {
                if (!$studentListItem.hasClass('selected')) {
                    that.element.find('.selected').removeClass('selected');
                    $studentListItem.addClass('selected');
                }
            });
            this.element.append($studentListItem);
        },
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
