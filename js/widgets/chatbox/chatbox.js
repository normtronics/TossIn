define(['jquery', 'underscore'], function ($, _) {
    return function (opts) {
        var defaultOpts = {
            // whatever default options
        };

        var trueOpts = _.defaults(opts, defaultOpts);

        window.console.log("Chatbox being loaded");
    };
});
