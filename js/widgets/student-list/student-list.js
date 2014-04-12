define([
    'jquery',
    'underscore',
    'text!widgets/student-list/student-list.htm',
    'stringutil',
    'jqueryui',
    'mocks'
], function ($, _, markup, stringutil) {
    var studentMarkup =
        '<div data-id="{0}" class="student-list-item">{1}</div>';

    $.widget('tossin.studentlist', {
        options: {},
        addStudent : function (student) {
            var that = this,
                formatted = stringutil.format(
                    studentMarkup, student.id, student.name);
                $studentListItem = $(formatted);

            $studentListItem.on('click', function () {
                that.selectStudent($(this));
            });
            this.element.append($studentListItem);
        },
        selectFirstStudent : function () {
            this.selectStudent(this.element.find('.student-list-item').first());
        },
        selectStudent : function ($studentListItem) {
            if (!$studentListItem.hasClass('selected')) {
                var studentId = $studentListItem.attr('data-id');
                this.element.find('.selected').removeClass('selected');
                $studentListItem.addClass('selected');
                this.options.controller.studentSelected(studentId);
            }
        },
        _create : function () {
            var that = this;
            this.element.append($(markup)).addClass('studentlist');

            $.getJSON('/users/students').done(function (response) {
                _.each(response, function (student) {
                    that.addStudent(student);
                });
                that.selectFirstStudent();
            });
        },
        _destroy : function () {
            this.element.removeClass('studentlist');
        }

    });
});
