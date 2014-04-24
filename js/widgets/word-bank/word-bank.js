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
        options: {},
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
        _waitForActiveAssignment : function () {
            var that = this;
            $.get('/assignments/active').done(function (response) {
                if (response) {
                    response = _.isString(response) ?
                        JSON.parse(response) : response;
                    that.options.activeAssignmentId = response.id;

                    that.addWords(response.words);
                } else setTimeout(function () {
                    that._waitForActiveAssignment.call(that);
                }, 1000);
            });
        },
        _create : function () {
			var that = this;
            this.element.append($(markup)).addClass('wordbank'); 
            this._waitForActiveAssignment();
        },
        _destroy : function () {
            this.element.removeClass('wordbank');
        }

    });
});
