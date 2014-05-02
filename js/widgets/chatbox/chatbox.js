define([
    'jquery',
    'underscore',
    'text!widgets/chatbox/chatbox.htm',
    'moment'
], function ($, _, markup, moment) {
    var msgTemplate = _.template(
        '<div class="message">' +
            '<div class="tossin-name-label"><b><%=name%></b></div>' +
            '<div class="tossin-message-content"><%=content%></div>' +
        '</div>');

    var timestampFormat = 'h:m a';

    var messageCache = {};

    var $chatWindow, $submitBtn, $chatInput,
        lastSpeaker, recipientId;

    var addMessage = function (name, content, sent, cached) {
        var $el = $(msgTemplate({ name : name, content : content }));
        if (lastSpeaker == name) $el.find('.tossin-name-label').remove();
        $el.addClass(sent ? 'sent' : 'received');
        $chatWindow.append($el);
        $chatWindow[0].scrollTop = $chatWindow[0].scrollHeight;
        lastSpeaker = name;

        if (!cached)
            messageCache[recipientId].push({
                name: name,
                content: content,
                sent: sent
            });
    };

    $.widget('tossin.chatbox', {
        options: {
            user : {}
        },
        _create : function () {
            var that = this;
            this.element.append($(markup));

            // TODO disable when loaded, enable when active assignment

            $chatWindow = this.element.find('#tossin-chat-window');
            $submitBtn = this.element.find('#tossin-chat-submit');
            $chatInput = this.element.find('#tossin-chat-input');

            $submitBtn.on('click', $.proxy(this._submit, this));
            $chatInput.on('keydown', function (e) {
                if (e.keyCode == 13) that._submit();
            });
        },
        addMessage : function (name, content) {
            addMessage(name, content, false);
        },
        setRecipientId : function (id) {
            recipientId = id;
            if (_.isUndefined(messageCache[recipientId]))
                messageCache[recipientId] = [];
            $chatWindow.empty();
            _.each(messageCache[recipientId], function (details) {
                addMessage(details.name, details.content, details.sent, true);
            });
        },
        _submit : function () {
            if ($chatInput.val() != '' && recipientId) {
                var content = $chatInput.val();
                $chatInput.val('');

                var that = this,
                    url = this.options.user.type == 'INSTRUCTOR' ?
                    '/users/' + recipientId + '/chat/' + this.options.user.id :
                    '/instructors/' + recipientId + '/chat';

                $.post(url, {
                    senderId : this.options.user.id,
                    msg : content
                }).done(function () {
                    addMessage(that.options.user.name, content, true);
                });
            }
        }
    });

});
