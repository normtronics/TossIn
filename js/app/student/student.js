define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'text!app/student/right-pane-prompt.htm',
    'stringutil',
    'texteditor',
	'wordbank',
    'mocks'
], function ($, markup, rightPaneMarkup, stringutil) {
    var PING_INTERVAL = 2000;

    var $element = $(markup),
        $rightPane = $(rightPaneMarkup);

    var $studentList = $element.find('#student-list'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLights = $element.find('#status-lights'),
        $chatBox = $element.find('#chat-box'),
        $assignmentBody = $rightPane.find('#assignment-body');

    var assignment;

    var waitForActiveAssignment = function () {
        $.get('/assignments/active').done(function (response) {
            if (response) {
                response = _.isString(response) ?
                    JSON.parse(response) : response;
                assignment = response;
                assignmentActivated();
            } else setTimeout(function () {
                waitForActiveAssignment();
            }, PING_INTERVAL);
        });
    };

    var assignmentActivated = function () {
        $wordBank.wordbank('addWords', assignment.words);
        $textArea.texteditor('toggle', true);
        $assignmentBody.text(assignment.prompt);
    };

    $studentList.append($rightPane);

    var api = {
        show : function () {
            $textArea.texteditor().texteditor('toggle', false);
			$wordBank.wordbank({ controller : api });

            var $content = $('#content-inner');
            $content.empty().append($element);

            waitForActiveAssignment();
        },
        wordSelected : function (word) {
            console.log("Word selected:", word);
        },
    };

    return api;
});
