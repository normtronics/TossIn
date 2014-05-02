define([
	'jquery',
	'text!app/instructor/instructor.htm',
	'text!app/exercise-create/exercise_create.htm',
	'stringutil',
	'app/instructor/instructor',
	'mocks',
], function ($, markup, ex_markup, stringutil, instructorView) {
	var $element = $(markup),
		$ex      = $(ex_markup);
		
	var $exercise = $element.find('#exercise-create'),
        $savedlist = $element.find('#ex-saved-pane');
		
	$ex.find('.save-button').click(function () {
		EXERCISE_CREATE.saveExercise();
	});

	$ex.find('.clear-button').click(function () {
		EXERCISE_CREATE.clearExercise();
	});
	
	var api = {
		/** Shows the exercise create interface **/
		show : function () {
			var $content = $('#content-inner');
			$content.empty().append($element);
			
			$('#exercise-create').append($ex);
			$('#ex-saved-pane').show();
			$('#word-bank,#status-lights,#chat-box').hide();
			$('#student-list').css('visibility','hidden');
            $('#middle-pane').remove();
			//Populate saved exercises list
			EXERCISE_CREATE.loadSavedExercises();
		},
	};
	
	var EXERCISE_CREATE = {

		/** Adds a word bank to the word list **/
		addWord : function () {
			var $li = $('#wordlist-pane ol').find('li:last').clone();
			$('#wordlist-pane li').find('.add-word').detach();
			
			this.bindWordListFunctions( $li );
			$('#wordlist-pane ol').append( $li );
		},
		
		/** Removes a word from list **/
		removeWord : function (button) {
			//Never delete last word bank in list
			if( $('#wordlist-pane li').length == 1) {
				$('#wordlist-pane input').val('');
				return;
			}
			
			var $rem_li = $(button).closest('li');
			
			//Remove the word list element
			$rem_li.detach();
			
			//Remove add button
			$('#wordlist-pane .add-word').detach();
			//Add button to end
			$('#wordlist-pane li:last').append( addWordMarkup ).find('.remove-word').unbind('click');
			EXERCISE_CREATE.bindWordListFunctions( $('#wordlist-pane li:last') );
		},
		
		/** Binds the addWord function to a button **/
		bindWordListFunctions : function ( $ctx ) {
			$ctx.find('.add-word').click(function () {
				EXERCISE_CREATE.addWord();
			});
			$ctx.find('.remove-word').click(function () {
				EXERCISE_CREATE.removeWord(this);
			});
		},

		/** This loads the current list of saved exercises into the data structure **/
		loadSavedExercises : function () {
            var that = this;
            $.get('/assignments').done(function (response) {
                response = _.isString(response) ?
                        JSON.parse(response) : response;
                _.each(response, function (exercise) {
					that.savedExercises[exercise.name] = exercise;
                    var div = savedExerciseMarkup;
                    var formatted = stringutil.format(div,
                        exercise.name, exercise.id);
                    $('.saved-list').append(formatted);
                });
			    that.bindSavedListFunctions( $('.saved-list') );
            });
		},
		
		/** Launches an exercise **/
		launchExercise : function (button) {
			var $div = $(button).closest('div'),
                exerciseId = $div.attr('data-id'),
				exerciseName = $div.find('.saved-exercise-name'),
				exercise = this.savedExercises[exerciseName];
            //$.post('/assignments/' + exerciseId + '/start');
			
			instructorView.show(exercise);
		},
		
		/** Binds the functions for the save list buttons **/
		bindSavedListFunctions : function ( $ctx ) {
			$ctx.find('.edit-saved').click( function () {
				EXERCISE_CREATE.loadExercise(this);
			});
			$ctx.find('.launch-saved').click( function () {
				EXERCISE_CREATE.launchExercise(this);
			});
			$ctx.find('.delete-saved').click( function () {
				EXERCISE_CREATE.removeExercise(this);
			});			
		},
		
		/** Removes an exercise from the list **/
		removeExercise : function (button) {
			if(!confirm("Are you sure you want to delete this exercise?")) {
				return ;
			}
			
			var $div = $(button).closest('div'),
                exerciseId = $div.attr('data-id');

            //$.delete('/assignments/' + exerciseId);
			$div.detach();
		},
			
		/** Saves current exercise **/
		saveExercise : function () {
			var data = {
				name : $('#ex-name').val(),
				description : $('#ex-description').val(),
                // timeLimit : 
                wordInterval : $('ex-interval').val()
			};
			
			var newExercise = (EXERCISE_CREATE.savedExercises[data.name] == undefined);
			
			var words = [];
			$('.word-list li input').each(function () {
				words.push(this.value);
			});
			
			data.words = words;

            //$.post('/assignments', data);
			this.savedExercises[data.name] = data;
	
            //Don't append a new listing if the exercise already exists
			if(newExercise) {
				var $formatted = $( stringutil.format(savedExerciseMarkup, data.name) );
				EXERCISE_CREATE.bindSavedListFunctions( $formatted );
				$('.saved-list').append( $formatted );
			}
		},
			
		/** Loads a saved exercise and populates the edit fields **/
		loadExercise : function (button) {
			//Pull key out of div to locate data
			var exerciseId = $(button).closest('div').attr('data-id');
			var exerciseName = $(button).closest('div').find('.saved-exercise-name').html();
			var response = this.savedExercises[exerciseName];
			
//            $.get('/assignments/' + exerciseId).done(function (response) {
//                response = _.isString(response) ?
//                        JSON.parse(response) : response;
                /** Populate editable fields with loaded exercise data **/
                $('#ex-name').val(response.name);
                $('#ex-description').val(response.description);
                $('#rndm-order')[0].checked = response.random;
                $('#ex-interval').val(response.wordInterval);
                
                //Clear current list
                $('.word-list li:not(:last)').detach();
                        
                //Populate word list
                $('.word-list input:last').val(response.words[0]);
                for(var x = 1; x < response.words.length; x++) {
                    EXERCISE_CREATE.addWord();
                    $('.word-list input:last').val(response.words[x]);
                }
//            });
		},
		
		/** Clears the edit pane to make way for new variables **/
		clearExercise : function () {
			$('#ex-name').val('');
			$('#ex-description').val('');
			$('#rndm-order')[0].checked = false;
            $('#ex-interval').val('');
			
			//Clear current list
			$('.word-list li:not(:last)').detach();
			$('.word-list li:last input').val('');
		},
		
		/** Initial Data **/
		savedExercises : {
			'Ex. 1' : {
				name : 'Ex. 1',
				random : true,
				description : 'First exercise',
				words : ['paddle', 'a fruit', 'a number', 'boat', 'a famous actor', 'an animal', 'desk']
			},
			'Nouns!' : {
				name : 'Nouns!',
				random : false,
				description : 'Nouns FTW!',
				words : ['garden gnome', 'pretzel', 'Philadelphia', 'house', 'Margaret Thatcher']
			},
			'Verbs!' : {
				name : 'Verbs!',
				random : true,
				description : 'Verbs are radical',
				words : ['bring', 'relax', 'remember', 'forget', 'punch']
			}
		},
	};
	
	EXERCISE_CREATE.bindWordListFunctions( $ex );
	
	var addWordMarkup =
		'<button type="button" class="btn btn-success add-word"><i class="glyphicon glyphicon-plus"/></button>';
		
	var savedExerciseMarkup =
		'<div data-id="{1}" }class="row-fluid">'
			+'<span class="saved-exercise-name">{0}</span>'
			+'<button type="button" class="btn btn-success edit-saved">'
				+'<i class="glyphicon glyphicon-pencil" />'
			+'</button>'
			+'<button type="button" class="btn btn-warning launch-saved">'
				+'<i class="glyphicon glyphicon-plane"/>'
			+'</button>'
			+'<button type="button" class="btn btn-danger delete-saved">'
				+'<i class="glyphicon glyphicon-trash" />'
			+'</button>'
		+'</div>'
	    ;
	
	return api;
});
