define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'stringutil',
	'wordbank',
	'studentlist',
    'texteditor',
	'mocks'
], function ($, markup, stringutil, wordbank) {
    var $element = $(markup);

    var $studentList = $element.find('#student-list'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLights = $element.find('#status-lights'),
        $chatBox = $element.find('#chat-box');

    var assignmentId;

    var api = {
        show : function (assgnmntId) {
            $studentList.studentlist({controller : api});
            $textArea.texteditor();
			$wordBank.wordbank({controller : api});
			//$wordBank.wordbank()
            assignmentId = assgnmntId;

            var $content = $('#content-inner');
            $content.empty().append($element);
        },
        wordSelected : function (wordId) {
            console.log("Selected word with ID: " + wordId);
        },
        studentSelected : function (studentId) {
            var url = stringutil.format('/assignments/{0}/input/{1}',
                    parseInt(assignmentId, 10), studentId);

            $.get(url).done(function (response) {
                var resp = _.isString(response)
                    ? JSON.parse(response) : repsonse;
                $textArea.texteditor('updateText', resp.input);
            });
        }
    };

    return api;
});
