define([
    'moment',
    'text!mock/users.json',
    'text!mock/inputs.json',
    'text!mock/assignments.json',
    'mockjax'
], function (moment, usersJSON, inputsJSON, assignmentsJSON) {
    
    var users = JSON.parse(usersJSON),
        inputs = JSON.parse(inputsJSON),
        assignments = JSON.parse(assignmentsJSON);

    var activeAssignment;

    var findById = function (collection, id) {
            return _.find(collection, function (item) {
                return item.id == id;
            });
        },
        getAssignment = function (id) {
            return findById(assignments, id);
        },
        getUser = function (id) {
            return findById(users, id);
        }
    
    // TODO enforce uniqueness
    var nextId;
    var getNextId = function () { return nextId++; }

    // get all students
    $.mockjax({
        url: /^\/users\/students$/,
        type: 'GET',
        responseTime: 0,
        responseText: users.students
    });
	
	$.mockjax({
        url: /^\/assignments\/([\d]+)\/words$/,
        urlParams: ['assignmentId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var assignment = getAssignment(settings.urlParams.assignmentId);
            this.responseText = assignment ?
                JSON.stringify(assignment.words) : '';
        }
    });

    $.mockjax({
        url: /^\/users\/validation\?username=([a-zA-Z0-9]+)&pass=([a-fA-F0-9]{40})$/,
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


    $.mockjax({
        url: /^\/users\/create$/,
        type: 'POST',
        responseTime: 0,
        response: function(settings){
            var user = _.find(users, function (user){
                return user.username == settings.data.username;
            });

            if (_.isUndefined(user)) {
                settings.data.id = "" + getNextId();
                users.push(settings.data);
                this.responseText = JSON.stringify(settings.data);
            }else{
                this.responseText = '';
                this.status = 500; // user already exists
            }
        }
    });

    // create an assignment
    $.mockjax({
        url: /^\/assignments\/$/,
        type: 'POST',
        responseTime: 0,
        response: function (settings) {
            var newAssignment = $.extend({}, settings.data, {
                id : getNextId()
            });
            assignments.push(newAssignment);
        }
    });

    // get all assignments
    $.mockjax({
        url: /^\/assignments$/,
        type: 'GET',
        responseTime: 0,
        responseText: JSON.stringify(assignments)
    });

    // get an assignment
    $.mockjax({
        url: /^\/assignments\/([\d]+)$/,
        urlParams: ['assignmentId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var assignment = getAssignment(settings.urlParams.assignmentId);
            if (_.isUndefined(assignment)) {
                this.responseText = '';
                this.status = 404;
            } else {
                this.responseText = JSON.stringify(assignment);
            }
        }
    });

    // delete an assignment
    $.mockjax({
        url: /^\/assignments\/([\d]+)$/,
        urlParams: ['assignmentId'],
        type: 'DELETE',
        responseTime: 0,
        response: function (settings) {
            assignments = _.filter(assignments, function (assignment) {
                return assignment.id != settings.urlParams.assignmentId;
            });
            this.responseText = '';
        }
    });

    // start an assignment
    $.mockjax({
        url: /^\/assignments\/([\d]+)\/start$/,
        urlParams: ['assignmentId'],
        type: 'POST',
        responseTime: 0,
        response: function (settings) {
            var assignment = getAssignment(settings.urlParams.assignmentId);
            if (_.isUndefined(assignment)) {
                this.responseText = '';
                this.status = 404; // tried to start a nonexistent assignment
            } else {
                activeAssignment = $.extend(true, {}, assignment, {
                    timeStarted: moment().format()
                });
                this.responseText = JSON.stringify(activeAssignment);
            }
        }
    });


    // get the active assignment
    $.mockjax({
        url: /^\/assignments\/active$/,
        type: 'GET',
        responseTime: 0,
        response: function () {
            this.responseText = activeAssignment ?
                JSON.stringify(activeAssignment) : '';
        }
    });

    // get student's input for given assignment
    $.mockjax({
        url: /^\/assignments\/([\d]+)\/input\/([\d]+)$/,
        urlParams: ['assignmentId', 'studentId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var assignment = getAssignment(settings.urlParams.assignmentId),
                student = getUser(settings.urlParams.studentId);

            if (_.isUndefined(assignment) || _.isUndefined(student)) {
                this.status = 404;
                this.responseText = '';
            } else {
                this.responseText =
                    JSON.stringify(inputs[assignment.id][student.id]);
            }
        }
    });
});
