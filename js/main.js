class FlashcardApp {
	constructor(url = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json') {
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
		this.answersHolder.forEach(element => element.addEventListener('click', this.onBtnClick));

		this.init();
	}

	init() {
		const {url} = this;

		fetch(url)
			.then(data => data.json())
			.then(data => this.data = data)
			.then(() => this.insertQuestionText())
			.then(() => this.insertAnswers())
			.then(() => this.updateAnswersInState())
			.then(() => this.bindClickEvent())
			.then(() => this.countQuestions())
			.catch(error => console.log(error))
	}

	insertQuestionText() {
		const {data, questionNumber, questionTextHolder} = this;
		const questionText = data[questionNumber].question;

		questionTextHolder.innerHTML = questionText;
	}

	insertAnswers() {
		const {data, questionNumber, answersWrapperHolder} = this;
		const answers = data[questionNumber].answers;

		const buttons = answers.map((element, index) => {
			return `
				<button class="c-flashcard__btn js-flashcard__btn">${element.answer}</button>
			`;
		});

		answersWrapperHolder.innerHTML = '';

		buttons.forEach((element, index) => {
			answersWrapperHolder.innerHTML += buttons[index];
		});

		this.updateAnswersInState();
		this.bindClickEvent();
		this.setCorrectAnswer(answers);
	}

	bindClickEvent() {
		this.answersHolder.forEach(element => element.addEventListener('click', this.onBtnClick));
	}

	updateAnswersInState() {
		this.answersHolder = document.querySelectorAll('.js-flashcard__btn');
	}

	countQuestions() {
		const {data} = this;
		const sum = data.length;

		this.questionsCount = sum;
	}

	setCorrectAnswer(answers) {
		let correctAnswer = answers.filter((element) => element.correct == true);
		correctAnswer = correctAnswer[0].answer.toLowerCase();

		this.correctAnswer = correctAnswer;
	}

	nextQuestion() {
		if (this.questionNumber !== this.questionsCount - 1) {
			this.questionNumber = this.questionNumber + 1;
			this.insertAnswers();
			this.insertQuestionText();
		} else {
			this.showResult();
		}
	}

	wrongAnswer() {
		const {questionNumber, questionsCount, totalWrong, data} = this;

		// find wrong answered question
		const thisQuestion = data.filter((element, index) => index === questionNumber);
		// convert this question from Array to Object
		const thisQuestionObject = Object.assign({}, ...thisQuestion);

		data.push(thisQuestionObject);
		this.questionsCount = this.questionsCount + 1;
		this.totalWrong = this.totalWrong + 1;
	}

	showResult() {
		const {resultsHolder, deckHolder, totalWrong, totalCorrect} = this;
		deckHolder.remove();

		resultsHolder.innerHTML = `
			<p class="c-results__correct">Number of correct answers: ${totalCorrect + 1}</p>
			<p class="c-results__wrong">Number of wrong answers: ${totalWrong}</p>
		`;

		this.playResultsSound();
	}

	// sounds
	playCorrectSound() {
		const {correctSound} = this;

		correctSound.currentTime = 0;
		correctSound.play();
	}

	playIncorrectSound() {
		const {incorrectSound} = this;

		incorrectSound.currentTime = 0;
		incorrectSound.play();
	}

	playResultsSound() {
		const {resultsSound} = this;

		resultsSound.currentTime = 0;
		resultsSound.play();
	}

	// events
	onBtnClick = (e) => {
		e.preventDefault();
		let btnText = e.target.innerHTML.toString().toLowerCase();

		if (btnText === this.correctAnswer) {
			this.nextQuestion();
			this.totalCorrect = this.totalCorrect + 1;
			this.playCorrectSound();
		} else {
			this.wrongAnswer();
			this.nextQuestion();
			this.playIncorrectSound();
		}
	}
}

const flashcardApp = new FlashcardApp('https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json');
