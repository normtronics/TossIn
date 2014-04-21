define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'stringutil',
    'studentlist',
    'texteditor',
	'wordbank',
    'mocks'
], function ($, markup, stringutil) {
    var $element = $(markup);

    var $studentList = $element.find('#student-list'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLights = $element.find('#status-lights'),
        $chatBox = $element.find('#chat-box');

    var assignmentId;

    var api = {
        show : function (assgnmntId) {
            $textArea.texteditor().texteditor('disable');
			$wordBank.wordbank();
            assignmentId = assgnmntId;

            var $content = $('#content-inner');
            $content.empty().append($element);
        }
    };

    return api;
});
