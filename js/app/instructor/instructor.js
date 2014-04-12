define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'studentlist',
    'texteditor'
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
            $textArea.texteditor();

            var $content = $('#content-inner');
            $content.empty().append($element);
        }
    };

    return api;
});
