require(['js/requireConfig'], function () {
    require(['jquery'], function ($) {
        $(document).ready(function() {
            require(['app/login/login']);
        });
    });
});
