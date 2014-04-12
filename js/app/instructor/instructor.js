define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'stringutil',
    'studentlist',
    'texteditor',
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
            $studentList.studentlist({controller : api});
            $textArea.texteditor();
            assignmentId = assgnmntId;

            var $content = $('#content-inner');
            $content.empty().append($element);
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
