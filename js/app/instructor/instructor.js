define([
    'jquery',
    'text!app/instructor/instructor.htm',
    'stringutil',
    'moment',
	'wordbank',
	'studentlist',
    'texteditor',
    'timer',
	'mocks'
], function ($, markup, stringutil, moment) {
    var PING_INTERVAL = 2000;

    var $element = $(markup);

    var $studentList = $element.find('#student-list'),
        $topMiddlePane = $element.find('#top-middle-pane'),
        $textArea = $element.find('#text-area'),
        $wordBank = $element.find('#word-bank'),
        $statusLightsAndLogout = $element.find('#status-lights-and-logout'),
        $statusLights = $statusLightsAndLogout.find('#status-lights'),
        $logoutBtn = $statusLightsAndLogout.find('#tossin-logout'),
        $chatBox = $element.find('#chat-box');

    var instructor, assignment;
    
    var pingForStatus = function () {
        $.get('/instructors/' + instructor.id + '/status')
            .done(function (response) {
                response = _.isString(response) ?
                    JSON.parse(response) : response;
               
                $textArea.texteditor('updateText', response.input);
                
                // TODO cache message log, probably in chatbox widget
                _.each(response.newChatMessages, function (details) {
                    $chatBox.chatbox('addMessage', details.name, details.msg);
                });

                setTimeout(function () { pingForStatus(); }, PING_INTERVAL);
            });
    };

    var api = {
        show : function (someInstructor) {
            $.get('/assignments/active').done(function (response) {
                instructor = someInstructor;
                response = _.isString(response) ?
                    JSON.parse(response) : response;

                $studentList.studentlist({controller : api});
                $wordBank.wordbank({
                    controller : api,
                    allAtOnce : true
                }).wordbank('addWords', response.words);
                $chatBox.chatbox({user : instructor});

                $topMiddlePane.timer({
                    started : moment(response.started),
                    totalSec : response.timeLimit
                }).timer('start');
                $textArea.texteditor();
                assignment = _.isString(response) ?
                    JSON.parse(response) : response;
                
                $logoutBtn.on('click', function () {
                    window.location = window.location;
                });

                $studentList.studentlist('loaded').done(function () {
                    $.ajax({
                        url: '/users/' + $studentList.studentlist('selected') +
                                '/monitored',
                        type: 'PUT'
                    });
                    pingForStatus();
                });

                var $content = $('#content-inner');
                $content.empty().append($element);
            }).fail(function () {
                window.console.log("No active assignment.");
            });
        },
        wordSelected : function (wordId) {
            console.log("Selected word with ID: " + wordId);
        },
        studentSelected : function (studentId) {
            var url = stringutil.format('/assignments/{0}/input/{1}',
                    parseInt(assignment.id, 10), studentId);
            $.get(url).done(function (response) {
                $textArea.texteditor('updateText', response || '');
            });

            $.ajax({
                url: '/users/' + studentId + '/monitored',
                type: 'PUT'
            });
            $chatBox.chatbox('setRecipientId', studentId);
        }
    };

    return api;
});
