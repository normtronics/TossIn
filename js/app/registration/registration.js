define([
    'jquery',
    'text!app/registration/registration.htm',
    'app/instructor/instructor'
], function ($, markup, instructorView) {
    var $element = $(markup);

    var $username = $element.find('#username'),
        $password1 = $element.find('#pass1'),
        $password2 = $element.find('#pass2'),
        $ID = $element.find('#id'),
        $email = $element.find('#email'),
        $firstName = $element.find('#firstname'),
        $lastName = $element.find('#lastname');

    var $regBtn = $element.find('#register-submit');
    /*$regBtn.on('click', function (event) {
            
            if(!$username.val() || !$ID.val() 
                || !$email.val() || !$firstName.val() 
                    || !$lastName.val() || !password1.val() || !password2.val()){
                window.alert('All feilds required');
                return;
            }

            if ($password1 != $password2) {
                window.alert('Passwords must be equal');
            }else{
                instructorView.show("0");
            };
    });*/


    var api = {
        show : function () {
            var $content = $('#content-inner');
            $content.empty().append($element);
        },
    };

    return api;
});