require(['js/requireConfig'], function () {
    require(['jquery'], function ($) {
        $(document).ready(function() {
            // whatever our main view ends up being
            require(['app/login/login']);
        });
    });
});
