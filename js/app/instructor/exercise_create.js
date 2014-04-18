'use strict';

var EXERCISE_CREATE = {};

var WORD_BANK = '';
var STATUS = '';
var CHAT_BOX = '';

EXERCISE_CREATE.word_count = 1;

//Initializes the exercise create widget
EXERCISE_CREATE.initExerciseCreate =
	function () {
		this.initVisibility();
		this.buildView();
		console.log("Loaded exercise create module");
	};
	
//Alters visibility of page elements to display only exercise create panels
EXERCISE_CREATE.initVisibility =
	function () {
		WORD_BANK = $('#word-bank');
		STATUS = $('#status-lights');
		CHAT_BOX = $('#chat-box');
		
		$('#student-list').css('visibility', 'hidden');
		$('#text-area').css('display', 'none');
		//$('#ex-main-pane').show();
	};
	
//Loads the .htm files into the page elements 
EXERCISE_CREATE.buildView =
	function () {
		$('#exercise-create').load('js/app/instructor/exercise_create.htm', function () {
			$('#right-pane').load('js/app/instructor/exercise_list.htm', function () {
				EXERCISE_CREATE.loadSavedExercises();
			});
		});
	};
	
//Removes a word from the word bank, delete button passes itself in and deletes the nears <li>
EXERCISE_CREATE.remove_word =
	function (button) {
		//Never delete last word bank in list
		if( $('#wordlist-pane li').length == 1) {
			$('#wordlist-pane input').val('');
			return;
		}
		//Remove the word bank
		$(button).closest('li').detach();
		//Remove add-button and append to last entry
		$('#wordlist-pane li').find('.add-button').detach();
		$('#wordlist-pane li:last').append( EXERCISE_CREATE.get_add_button );
	};
	
//Removes an exercise from the list
EXERCISE_CREATE.removeExercise =
	function (button) {
		$(button).closest('div').detach();
	};
	
//Returns the html for an add button
EXERCISE_CREATE.get_add_button =
	function () {
		return '<button type="button" class="btn btn-success add-button" onclick="EXERCISE_CREATE.add_word(this)"><i class="glyphicon glyphicon-plus"/></button>';
	};

//Returns an li stubb for the saved exercises list
EXERCISE_CREATE.get_exercise_div =
	function (se) {
		return '<div data-pk="' + se.pk +'" class="row-fluid">'
					+'<span class="saved-exercise-name">'+se.name+'</span>'
					+'<button type="button" class="btn btn-success" onclick="EXERCISE_CREATE.loadExercise(this)">'
						+'<i class="glyphicon glyphicon-pencil" />'
					+'</button>'
					+'<button type="button" class="btn btn-warning" onclick="EXERCISE_CREATE.launchExercise(this)">'
						+'<i class="glyphicon glyphicon-plane"/>'
					+'</button>'
					+'<button type="button" class="btn btn-danger" onclick="EXERCISE_CREATE.removeExercise(this)">'
						+'<i class="glyphicon glyphicon-trash" />'
					+'</button>'
				+'</div>'
				;
	};
	
//Adds a word bank to the word list
EXERCISE_CREATE.add_word =
	function () {
		var li = $('#wordlist-pane ol').find('li:last').clone();
		$('#wordlist-pane li').find('.add-button').detach();
		$('#wordlist-pane ol').append(li);
	};	
	
EXERCISE_CREATE.initTeacherExerciseView =
	function () {
		$('#text-area').show();
		$('#student-list').css('visibility', '');
		$('#ex-saved-pane,#ex-main-pane').hide();
		$('#right-pane').append(WORD_BANK).append(STATUS).append(CHAT_BOX);
	};
	
//This loads the current list of saved exercises into the data structure
EXERCISE_CREATE.loadSavedExercises =
	function () {
		EXERCISE_CREATE.savedExercises = {
			'Ex. 1' : {
				name : 'Ex. 1',
				random : true,
				description : 'First exercise',
				words : ['paddle', 'a fruit', 'a number', 'boat', 'a famous actor', 'an animal', 'desk']
			},
			'Nouns?' : {
				name : 'Nouns?',
				random : false,
				description : 'Nouns FTW!',
				words : ['garden gnome', 'pretzel', 'Philadelphia', 'house', 'Margaret Thatcher']
			}
		};
		
		var se = EXERCISE_CREATE.savedExercises;
		
		for(var key in se) {
			var div = EXERCISE_CREATE.get_exercise_div(se[key]);
			$('.saved-list').append(div);
		}
	};
	
//Saves current exercise
EXERCISE_CREATE.saveExercise =
	function () {
		var data = {
			name : $('#ex-name').val(),
			description : $('#ex-description').val(),
		};
		
		var newExercise = (EXERCISE_CREATE.savedExercises[data.name] == undefined);
		
		var words = [];
		$('.word-list li input').each(function () {
			words.push(this.value);
		});
		
		data.words = words;
		EXERCISE_CREATE.savedExercises[data.name] = data;
		if(newExercise) {
			var div = this.get_exercise_div(data);
			$('.saved-list').append(div);
		}
	};
	
//Loads a saved exercise and populates the edit fields
EXERCISE_CREATE.loadExercise =
	function (button) {
		//Pull key out of div to locate data
		var key = $(button).closest('div').find('.saved-exercise-name').html();
		var loaded = EXERCISE_CREATE.savedExercises[key];
		
		console.log(loaded.words);
		
		/** Populate editable fields with loaded exercise data **/
		$('#ex-name').val(loaded.name);
		$('#ex-description').val(loaded.description);
		$('#rndm-order').attr('checked', loaded.random);
		
		//Clear current list
		$('.word-list li:not(:last)').detach();
				
		//Populate word list
		$('.word-list input:last').val(loaded.words[0]);
		for(var x = 1; x < loaded.words.length; x++) {
			EXERCISE_CREATE.add_word();
			$('.word-list input:last').val(loaded.words[x]);
		}
	};