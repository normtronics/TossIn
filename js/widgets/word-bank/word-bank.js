define([
    'jquery',
    'underscore',
    'text!widgets/word-bank/word-bank.htm',
    'stringutil',
    'jqueryui',
    'mocks'
], function ($, _, markup, stringutil) {
	var wordMarkup =
        '<div class="word-bank-item">{0}</div>';

    var DELAY_BETWEEN_WORDS = 5000, // in milliseconds
        NUM_INITIAL_WORDS = 2;

    $.widget('tossin.wordbank', {
        options: {
            allAtOnce : false
        },
        addWord : function (word) {
            var that = this,
                formatted = stringutil.format(wordMarkup, word);
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
                this.element.find('.selected').removeClass('selected');
                $wordBankItem.addClass('selected');
                this.options.controller.wordSelected($wordBankItem.text());
            }
        },
        addWords : function (words) {
            // add initial chunk
            if (this.options.allAtOnce)
                var numInitialWords = words.length;
            else
                var numInitialWords = NUM_INITIAL_WORDS < words.length ?
                    NUM_INITIAL_WORDS : words.length;

            for (var i = 0; i < numInitialWords; i++) this.addWord(words[i]);

            words.splice(0, numInitialWords);
            this.runWordPopulate(words);
        },
		runWordPopulate : function (words) {
			var that = this;
			
			if(words.length > 0) {
				setTimeout(function () {
					that.addWord(words[0]);
					words.splice(0,1);
					that.runWordPopulate(words);
				}, DELAY_BETWEEN_WORDS);	
			}
		},
        _create : function () {
			var that = this;
            this.element.append($(markup)).addClass('wordbank'); 
        },
        _destroy : function () {
            this.element.removeClass('wordbank');
        }

    });
});
