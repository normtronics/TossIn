define([
    'text!mock/users.json',
    'text!mock/inputs.json',
    'mockjax'
], function (usersJSON, inputsJSON) {
    
    var users = JSON.parse(usersJSON),
        inputs = JSON.parse(inputsJSON);

    // get all students
    $.mockjax({
        url: /\/users\/students/,
        type: 'GET',
        responseTime: 0,
        responseText: users.students
    });
	
	$.mockjax({
        url: /\/users\/words/,
        type: 'GET',
        responseTime: 0,
        responseText: users.words
    });

    // get student's input for given assignment
    $.mockjax({
        url: /\/assignments\/([\d]+)\/input\/([\d]+)/,
        urlParams: ['assignmentId', 'studentId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var assignmentId = settings.urlParams.assignmentId,
                studentId = settings.urlParams.studentId;

            this.responseText = JSON.stringify(inputs[assignmentId][studentId]);
        }
    });
});
