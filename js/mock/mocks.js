define([
    'moment',
    'underscore',
    'text!mock/users.json',
    'text!mock/inputs.json',
    'text!mock/assignments.json',
    'mockjax'
], function (moment, _, usersJSON, inputsJSON, assignmentsJSON) {
    
    var users = JSON.parse(usersJSON),
        inputs = JSON.parse(inputsJSON),
        assignments = JSON.parse(assignmentsJSON),
        activeStatus = {
            monitoredStudent : "-1",
            requestedHelp : [],
            students : {}
        };

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
        },
        getInstructor = function (id) {
            return _.find(users, function (user) {
                return user.id == id && user.type == 'INSTRUCTOR';
            });
        };

    var getStudentActiveInput = function (assignmentId, studentId) {
        if (_.isUndefined(inputs[assignmentId]))
            inputs[assignmentId] = {};
        if (_.isUndefined(inputs[assignmentId][studentId]))
            inputs[assignmentId][studentId] = { input : '' };

        return inputs[assignmentId][studentId].input;
    };

    var getStudentActiveStatus = function (studentId) {
        if (_.isUndefined(activeStatus.students[studentId])) {
            var student = getUser(studentId);
            activeStatus.students[studentId] = {
                fromChat : [{name:student.name,msg:'Hello, Professor'}],
                toChat : []
            };
        }
        return activeStatus.students[studentId];
    };
    
    // TODO enforce uniqueness
    var nextId;
    var getNextId = function () { return nextId++; }

    // get all students
    $.mockjax({
        url: /^\/users\/students$/,
        type: 'GET',
        responseTime: 0,
        responseText: JSON.stringify(_.filter(users, function (user) {
            return user.type == 'STUDENT';
        }))
    });

    // get all words for an assignment
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

    // validate username-password combination
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

    // create a user
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
        url: /^\/assignments$/,
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
                    started: moment().format()
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
        response: function (settings) {
            this.responseText = activeAssignment ?
                JSON.stringify(activeAssignment) : '';
        }
    });

    // get a student's status in the active assignment
    $.mockjax({
        url: /^\/users\/([\d]+)\/status$/,
        urlParams: ['studentId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var studentId = settings.urlParams.studentId,
                userStatus = activeStatus.students[studentId];
            if (_.isUndefined(userStatus)) {
                this.status = 404;
                this.responseText = '';
            } else {
                this.responseText = JSON.stringify({
                    monitored : studentId == activeStatus.monitoredStudent,
                    helpRequested : _.contains(
                        activeStatus.requestedHelp, studentId),
                    newChatMessages : activeStatus.students[studentId].toChat
                });
                activeStatus.students[studentId].toChat = [];
            }
        }
    });

    // get an instructor-level status of the active assignment
    $.mockjax({
        url: /^\/instructors\/([\d]+)\/status$/,
        urlParams: ['instructorId'],
        type: 'GET',
        responseTime: 0,
        response: function (settings) {
            var monitoredId = activeStatus.monitoredStudent;
            this.responseText = JSON.stringify({
                input : getStudentActiveInput(activeAssignment.id, monitoredId),
                newChatMessages : getStudentActiveStatus(monitoredId).fromChat,
                helpRequested : _.contains(
                    activeStatus.requestedHelp, monitoredId)
            });
            activeStatus.students[monitoredId].fromChat = [];
        }
    });

    // send new message to a student
    $.mockjax({
        url: /^\/users\/([\d]+)\/chat\/([\d]+)$/,
        urlParams: ['studentId', 'instructorId'],
        type: 'POST',
        responseTime: 0,
        response: function (settings) {
            var studentId = settings.urlParams.studentId,
                instructorId = settings.urlParams.instructorId,
                instructor = getInstructor(instructorId);

            if (_.isUndefined(instructor)) {
                this.status = 404;
            } else {
                activeStatus.students[studentId].toChat.push({
                    name : instructor.name,
                    msg : settings.data.msg
                });
            }

            this.responseText = '';
        }
    });

    // send new message to instructor
    $.mockjax({
        url: /^\/instructors\/([\d]+)\/chat$/,
        urlParams : ['instructorId'],
        type: 'POST',
        responseTime: 0,
        response: function (settings) {
            var instructorId = settings.urlParams.instructorId,
                studentId = settings.data.senderId;
            getStudentActiveStatus(studentId).fromChat.push(settings.data.msg);
            this.responseText = '';
        }
    });

    // say that a student is being monitored
    $.mockjax({
        url: /^\/users\/([\d]+)\/monitored$/,
        urlParams: ['studentId'],
        type: 'PUT',
        responseTime: 0,
        response: function (settings) {
            activeStatus.monitoredStudent = settings.urlParams.studentId;
        }
    });

    // request help from instructor
    $.mockjax({
        url: /^\/users\/([\d]+)\/requesthelp$/,
        urlParams: ['studentId'],
        type: 'PUT',
        responseTime: 0,
        response: function (settings) {
            var studentId = settings.urlParams.studentId;
            if (studentId != activeStatus.monitoredStudent &&
                    !_.contains(activeStatus.requestedHelp, studentId)) {
                activeStatus.requestedHelp.push(studentId);
            }
            this.responseText = '';
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
                var studentInput =
                    getStudentActiveInput(assignment.id, student.id);
                this.responseText = studentInput;
            }
        }
    });
});
