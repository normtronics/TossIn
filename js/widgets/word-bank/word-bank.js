define([
    'jquery',
    'underscore',
    'text!widgets/word-bank/word-bank.htm',
    'stringutil',
    'jqueryui',
    'mocks'
], function ($, _, markup, stringutil) {
	var wordMarkup =
        '<div data-id="{0}" class="word-bank-item">{1}</div>';

    $.widget('tossin.wordbank', {
        options: {},
        addWord : function (word) {
            var that = this,
                formatted = stringutil.format(
                    wordMarkup, word.id, word.name);
                $wordBankItem = $(formatted);

            $wordBankItem.on('click', function () {
                that.selectWord($(this));
            });
            this.element.append($wordBankItem);
        },
        selectFirstWord : function () {
            this.selectWord(this.element.find('.word-bank-item').first());
        },
        selectWord : function ($wordBankItem) {
            if (!$wordBankItem.hasClass('selected')) {
                var wordId = $wordBankItem.attr('data-id');
                this.element.find('.selected').removeClass('selected');
                $wordBankItem.addClass('selected');
                this.options.controller.wordSelected(wordId);
            }
        },
        _create : function () {
            var that = this;
            this.element.append($(markup)).addClass('wordbank');

            $.getJSON('/users/words').done(function (response) {
                _.each(response, function (word) {
					console.log(word);
                    that.addWord(word);		//Possibly add pause here for time
                });
                that.selectFirstWord();
            });
        },
        _destroy : function () {
            this.element.removeClass('wordbank');
        }

    });
});