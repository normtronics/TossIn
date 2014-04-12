define([
    'text!mock/users.json',
    'mockjax'
], function (usersJSON) {
    
    var users = JSON.parse(usersJSON);

    // get all students
    $.mockjax({
        url: '/users/students',
        type: 'GET',
        responseTime: 0,
        responseText: users.students
    });

});
