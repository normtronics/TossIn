define([
    'jquery',
    'localizer',
    'text!app/instructor/instructor.htm',
    'text!app/student/right-pane-prompt.htm',
    'stringutil',
    'moment',
    'texteditor',
	'wordbank',
    'timer',
    'chatbox',
    'mocks'
], function ($, localizer, markup, rightPaneMarkup, stringutil, moment) {
    var PING_INTERVAL = 2000;

    var $element = $(_.template(markup)(localizer)),
        $rightPane = $(_.template(rightPaneMarkup)(localizer));

    var $studentList = $element.find('#student-list'),
        $topMiddle = $element.find('#top-middle-pane'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLightsAndLogout = $element.find('#status-lights-and-logout'),
        $statusLights = $statusLightsAndLogout.find('#status-lights'),
        $logoutBtn = $statusLightsAndLogout.find('#tossin-logout'),
        $chatBox = $element.find('#chat-box'),
        $assignmentBody = $rightPane.find('#assignment-body');

    var user, assignment;

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

    var pingForStatus = function () {
        $.get('/users/' + user.id + '/status')
            .done(function (response) {
                response = _.isString(response) ?
                    JSON.parse(response) : response;

                // TODO being monitored light
                // TODO help requested light

                _.each(response.newChatMessages, function (details) {
                    $chatBox.chatbox('addMessage', details.name, details.msg);
                });

                setTimeout(function () { pingForStatus(); }, PING_INTERVAL);
            });
    };

    var assignmentActivated = function () {
        $topMiddle.removeClass('waiting').find('.label').remove();
        $wordBank.wordbank('addWords', assignment.words);
        $textArea.texteditor('toggle', true);
        $chatBox.chatbox('setRecipientId', assignment.instructorId);
        $assignmentBody.text(assignment.description);
        $topMiddle.timer({
            totalSec : assignment.timeLimit,
            started: moment(assignment.started)
        }).timer('start');

        pingForStatus();
    };

    $studentList.append($rightPane);

    var api = {
        show : function (someUser) {
            $textArea.texteditor().texteditor('toggle', false);
			$wordBank.wordbank({ controller : api });
            $topMiddle.addClass('waiting');
            $topMiddle.append(_.template(
                '<div class="label"><%=student_waiting%></div>'
            )(localizer));
            $chatBox.chatbox();

            $logoutBtn.on('click', function () {
                window.location = window.location;
            });

            var $content = $('#content-inner');
            $content.empty().append($element);

            user = someUser;
            waitForActiveAssignment();
        },
        wordSelected : function (word) {
            console.log("Word selected:", word);
        },
    };

    return api;
});
