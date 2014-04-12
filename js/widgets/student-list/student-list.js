define([
    'jquery',
    'underscore',
    'text!widgets/student-list/student-list.htm',
    'stringutil',
    'jqueryui',
    'mocks'
], function ($, _, markup, stringutil) {
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
            var that = this;
            this.element.append($(markup)).addClass('studentlist');

            $.getJSON('/users/students').done(function (response) {
                _.each(response, function (student) {
                    that.addStudent(student.name);
                });
            });
        },
        _destroy : function () {
            this.element.removeClass('studentlist');
        }

    });
});
