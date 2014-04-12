define(function () {
    return {
        format : function (str /* arg1, arg2, ... */) {
            var args = Array.prototype.slice.call(arguments, 1);
            return str.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                    ? args[number] : match;
            });
        }
    };
});
