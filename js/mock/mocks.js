define([
    'text!mock/users.json',
    'text!mock/inputs.json',
    'text!mock/words.json',
    'mockjax'
], function (usersJSON, inputsJSON, wordsJSON) {
    
    var users = JSON.parse(usersJSON),
        inputs = JSON.parse(inputsJSON),
        words = JSON.parse(wordsJSON);

    // get all students
    $.mockjax({
        url: /\/users\/students/,
        type: 'GET',
        responseTime: 0,
        responseText: users.students
    });
	
	$.mockjax({
        // TODO make this per-assignment
        url: /\/users\/words/,
        type: 'GET',
        responseTime: 0,
        responseText: words
    });

    $.mockjax({
        url: /\/users\/validation\?username=([a-zA-Z0-9]+)&pass=([a-fA-F0-9]{40})/,
        urlParams: ['username', 'passwordHash'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var user = _.find(users, function (user) {
                return user.username == settings.urlParams.username;
            });

            if (_.isUndefined(user)) {
                this.responseText = '';
            } else if (user.passwordHash == settings.urlParams.passwordHash) {
                this.responseText = JSON.stringify(_.omit(user,'passwordHash'));
            }
        }
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
