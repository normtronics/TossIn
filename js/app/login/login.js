define([
    'jquery',
    'hash',
    'stringutil',
    'text!app/login/login.htm',
	'app/exercise-create/exercisecreate',
    'app/registration/registration'
], function ($, hash, stringutil, markup, exerciseCreateView,
        registrationView) {
    var $element = $(markup);

    var $username = $element.find('input[type=text]'),
        $password = $element.find('input[type=password]');

    var validationUrlTemplate = '/users/validation?username={0}&pass={1}';

    var $loginBtn = $element.find('#login-submit');
    $loginBtn.on('click', function (event) {
        var url = stringutil.format(validationUrlTemplate,
                                    $username.val(),
                                    hash.hex_sha1($password.val()));
        $.get(url).done(function (response) {
            if(response != '') {
                var user = JSON.parse(response);
                if(user.type === 'INSTRUCTOR') {
                    exerciseCreateView.show();		
                } else if (user.type === 'STUDENT') {
                    //Show student view
                    console.log('TODO: show student view');
                }	
            } else {
                console.log('Invalid credentials');
                $username.val('');
                $password.val('');
            }
        });
    });


    var $regBtn = $element.find('#reg');
    $regBtn.on('click', function (event) {
        registrationView.show();
    });

    // each view should empty and build '#content-inner'
    var $content = $('#content-inner');
    $content.empty()
    $content.append($element);
});
