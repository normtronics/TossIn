define([
    'jquery',
    'localizer',
    'hash',
    'stringutil',
    'text!app/login/login.htm',
	'app/exercise-create/exercisecreate',
    'app/registration/registration',
    'app/student/student',
    'jqueryui'
], function ($, localizer, hash, stringutil, markup, exerciseCreateView,
        registrationView, studentView) {
    var $element = $(_.template(markup)(localizer));

    var $username = $element.find('input[type=text]'),
        $password = $element.find('input[type=password]'),
        $loginBtn = $element.find('#login-submit'),
        $regBtn = $element.find('#reg'),

        $settingsBtn = $element.find('#tossin-settings-btn'),
        $settingsDialog = $element.find('#tossin-settings-dialog'),
        $settingsLanguageSelect = $element.find('#tossin-settings-language'),
        $settingsSaveBtn = $element.find('#tossin-settings-save-btn'),
        $settingsCancelBtn = $element.find('#tossin-settings-cancel-btn');

    var validationUrlTemplate = '/users/validation?username={0}&pass={1}';

    var api = {
        show : function () {
            $password.on('keyup', function (e) {
                if (e.keyCode == 13 /* ENTER */) {
                    $loginBtn.click();
                }
            });

            $loginBtn.on('click', function (event) {
                var url = stringutil.format(validationUrlTemplate,
                                            $username.val(),
                                            hash.hex_sha1($password.val()));
                $.get(url).done(function (response) {
                    if(response != '') {
                        var user = JSON.parse(response);
                        if(user.type === 'INSTRUCTOR') {
                            exerciseCreateView.show(user);		
                        } else if (user.type === 'STUDENT') {
                            studentView.show(user);
                        }	
                    } else {
                        console.log('Invalid credentials');
                        $username.val('');
                        $password.val('');
                    }
                });
            });

            $regBtn.on('click', function (event) {
                registrationView.show(api);
            });

            $settingsBtn.on('click', function () {
                $settingsDialog.removeClass('hide');
                $settingsDialog.slideToggle('fast');
            });

            $settingsLanguageSelect.val(localStorage.tossinLocale || 'en-us');

            $settingsSaveBtn.on('click', function () {
                localStorage.tossinLocale =
                    $settingsDialog.find('#tossin-settings-language').val();
                window.location = window.location;
            });

            $settingsCancelBtn.on('click', function () {
                $settingsDialog.slideToggle('fast');
            });

            var $content = $('#content-inner');
            $content.empty()
            $content.append($element);
        }
    };

    return api;
});
