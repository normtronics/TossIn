define([
    'jquery',
    'underscore',
    'moment',
    'text!widgets/timer/timer.htm'
], function ($, _, moment, markup) {
    var timeStringTemplate = _.template("<%=minutes%>:<%=seconds%>");

    var getTimeString = function (seconds) {
        var secondPart = seconds % 60;
        return timeStringTemplate({
            minutes : Math.floor(seconds/60),
            seconds : secondPart < 10 ? "0" + secondPart : secondPart
        });
    };

    var tickInterval;

    $.widget('tossin.timer', {
        options: {
            totalSec : 300,
            elapsedSec : 0
        },
        _create : function () {
            var that = this;
            this.element.append($(markup)).addClass('tossin-timer');
            
            this.displayDiv = this.element.find('#tossin-timer-countdown');
        },
        _tick : function () {
            if (this.options.elapsedSec <= this.options.totalSec) {
                this.displayDiv.text(getTimeString(
                    this.options.totalSec - this.options.elapsedSec++));
            } else clearTimeout(tickInterval);
        },
        start : function (totalSeconds) {
            var that = this;
            if (!_.isUndefined(totalSeconds))
                this.options.totalSec = totalSeconds;

            that._tick();
            tickInterval = setInterval(function () {
                that._tick();
            }, 1000);
        },
        pause : function () {
            clearTimeout(tickInterval);
        }
    });

});
