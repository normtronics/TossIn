

var USER_CREDENTIALS = {
	'admin' : {
		userType : 'instructor',
		password : ''
	},
	'student' : {
		userType : 'student',
		password : ''
	},
	'' : {
		userType : 'instructor',
		password : ''
	}
};


define([
    'jquery',
    'text!app/login/login.htm',
    'app/instructor/instructor'
], function ($, markup, instructorView) {
    var $element = $(markup);

    var $username = $element.find('input[type=text]'),
        $password = $element.find('input[type=password]');

    var $loginBtn = $element.find('#login-submit');
    $loginBtn.on('click', function (event) {
        //Get user from struct
		var user = USER_CREDENTIALS[$username.val()];
		if(user != undefined && $password.val() === user.password) {
			//Show view as defined by userType
	        if(user.userType === 'instructor') {
				instructorView.show("0");
				EXERCISE_CREATE.loadSavedExercises();		
			} else if (user.userType === 'student') {
				//Show student view
			}	
		}
    });

    // each view should empty and build '#content-inner'
    var $content = $('#content-inner');
    $content.empty()
    $content.append($element);
});
