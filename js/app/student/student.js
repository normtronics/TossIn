define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'text!app/student/right-pane-prompt.htm',
    'stringutil',
    'texteditor',
	'wordbank',
    'mocks'
], function ($, markup, rightPaneMarkup, stringutil) {
    var $element = $(markup),
        $rightPane = $(rightPaneMarkup);

    var $studentList = $element.find('#student-list'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLights = $element.find('#status-lights'),
        $chatBox = $element.find('#chat-box'),
        $assignmentBody = $rightPane.find('#assignment-body');

    var assignmentId;

    var api = {
        show : function () {
            $textArea.texteditor().texteditor('disable');
			$wordBank.wordbank();

            var $content = $('#content-inner');
            $content.empty().append($element);

            $.get('/assignments/active').done(function (response) {

            });
        }
    };

    return api;
});
