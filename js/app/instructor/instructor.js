define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'studentlist'
], function ($, markup) {
    var $element = $(markup);

    var $studentList = $element.find('#student-list'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLights = $element.find('#status-lights'),
        $chatBox = $element.find('#chat-box');

    var api = {
        show : function () {
            $studentList.studentlist();

            var $content = $('#content-inner');
            $content.empty().append($element);
        }
    };

    return api;
});
