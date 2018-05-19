'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlashcardApp = function () {
	function FlashcardApp() {
		var _this = this;

		var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';

		_classCallCheck(this, FlashcardApp);

		this.onBtnClick = function (e) {
			e.preventDefault();
			var btnText = e.target.innerHTML.toString().toLowerCase();

			if (btnText === _this.correctAnswer) {
				_this.nextQuestion();
				_this.totalCorrect = _this.totalCorrect + 1;
				_this.playCorrectSound();
			} else {
				_this.wrongAnswer();
				_this.nextQuestion();
				_this.playIncorrectSound();
			}
		};

		// state
		this.url = url;
		this.data = [];
		this.questionNumber = 0;
		this.questionsCount = 0;
		this.correctAnswer = '';
		this.totalCorrect = 0;
		this.totalWrong = 0;

		// HTML elements
		this.deckHolder = document.querySelector('.js-deck-wrapper');
		this.flashcardHolder = document.querySelector('.js-flashcard');
		this.questionTextHolder = document.querySelector('.js-flashcard__text');
		this.answersWrapperHolder = document.querySelector('.js-flashcard__buttons-wrapper');
		this.answersHolder = document.querySelectorAll('.js-flashcard__btn');
		this.resultsHolder = document.querySelector('.c-results');

		// sounds
		this.correctSound = document.querySelector('.js-correct-sound');
		this.incorrectSound = document.querySelector('.js-incorrect-sound');
		this.resultsSound = document.querySelector('.js-results-sound');

		// bind events
		this.answersHolder.forEach(function (element) {
			return element.addEventListener('click', _this.onBtnClick);
		});

		this.init();
	}

	_createClass(FlashcardApp, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			var url = this.url;


			fetch(url).then(function (data) {
				return data.json();
			}).then(function (data) {
				return _this2.data = data;
			}).then(function () {
				return _this2.insertQuestionText();
			}).then(function () {
				return _this2.insertAnswers();
			}).then(function () {
				return _this2.updateAnswersInState();
			}).then(function () {
				return _this2.bindClickEvent();
			}).then(function () {
				return _this2.countQuestions();
			}).catch(function (error) {
				return console.log(error);
			});
		}
	}, {
		key: 'insertQuestionText',
		value: function insertQuestionText() {
			var data = this.data,
			    questionNumber = this.questionNumber,
			    questionTextHolder = this.questionTextHolder;

			var questionText = data[questionNumber].question;

			questionTextHolder.innerHTML = questionText;
		}
	}, {
		key: 'insertAnswers',
		value: function insertAnswers() {
			var data = this.data,
			    questionNumber = this.questionNumber,
			    answersWrapperHolder = this.answersWrapperHolder;

			var answers = data[questionNumber].answers;

			var buttons = answers.map(function (element, index) {
				return '\n\t\t\t\t<button class="c-flashcard__btn js-flashcard__btn">' + element.answer + '</button>\n\t\t\t';
			});

			answersWrapperHolder.innerHTML = '';

			buttons.forEach(function (element, index) {
				answersWrapperHolder.innerHTML += buttons[index];
			});

			this.updateAnswersInState();
			this.bindClickEvent();
			this.setCorrectAnswer(answers);
		}
	}, {
		key: 'bindClickEvent',
		value: function bindClickEvent() {
			var _this3 = this;

			this.answersHolder.forEach(function (element) {
				return element.addEventListener('click', _this3.onBtnClick);
			});
		}
	}, {
		key: 'updateAnswersInState',
		value: function updateAnswersInState() {
			this.answersHolder = document.querySelectorAll('.js-flashcard__btn');
		}
	}, {
		key: 'countQuestions',
		value: function countQuestions() {
			var data = this.data;

			var sum = data.length;

			this.questionsCount = sum;
		}
	}, {
		key: 'setCorrectAnswer',
		value: function setCorrectAnswer(answers) {
			var correctAnswer = answers.filter(function (element) {
				return element.correct == true;
			});
			correctAnswer = correctAnswer[0].answer.toLowerCase();

			this.correctAnswer = correctAnswer;
		}
	}, {
		key: 'nextQuestion',
		value: function nextQuestion() {
			if (this.questionNumber !== this.questionsCount - 1) {
				this.questionNumber = this.questionNumber + 1;
				this.insertAnswers();
				this.insertQuestionText();
			} else {
				this.showResult();
			}
		}
	}, {
		key: 'wrongAnswer',
		value: function wrongAnswer() {
			var questionNumber = this.questionNumber,
			    questionsCount = this.questionsCount,
			    totalWrong = this.totalWrong,
			    data = this.data;

			// find wrong answered question

			var thisQuestion = data.filter(function (element, index) {
				return index === questionNumber;
			});
			// convert this question from Array to Object
			var thisQuestionObject = Object.assign.apply(Object, [{}].concat(_toConsumableArray(thisQuestion)));

			data.push(thisQuestionObject);
			this.questionsCount = this.questionsCount + 1;
			this.totalWrong = this.totalWrong + 1;
		}
	}, {
		key: 'showResult',
		value: function showResult() {
			var resultsHolder = this.resultsHolder,
			    deckHolder = this.deckHolder,
			    totalWrong = this.totalWrong,
			    totalCorrect = this.totalCorrect;

			deckHolder.remove();

			resultsHolder.innerHTML = '\n\t\t\t<p class="c-results__correct">Number of correct answers: ' + (totalCorrect + 1) + '</p>\n\t\t\t<p class="c-results__wrong">Number of wrong answers: ' + totalWrong + '</p>\n\t\t';

			this.playResultsSound();
		}

		// sounds

	}, {
		key: 'playCorrectSound',
		value: function playCorrectSound() {
			var correctSound = this.correctSound;


			correctSound.currentTime = 0;
			correctSound.play();
		}
	}, {
		key: 'playIncorrectSound',
		value: function playIncorrectSound() {
			var incorrectSound = this.incorrectSound;


			incorrectSound.currentTime = 0;
			incorrectSound.play();
		}
	}, {
		key: 'playResultsSound',
		value: function playResultsSound() {
			var resultsSound = this.resultsSound;


			resultsSound.currentTime = 0;
			resultsSound.play();
		}

		// events

	}]);

	return FlashcardApp;
}();

var flashcardApp = new FlashcardApp('https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json');