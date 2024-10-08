let countries = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        countries = data.map(country => ({
            name: country.name.common,
            capital: country.capital ? country.capital[0] : 'No Capital'
        })).filter(country => country.capital !== 'No Capital');
        startQuiz();
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < countries.length) {
        const currentCountry = countries[currentQuestionIndex];
        document.getElementById('question').innerText = `What is the capital of ${currentCountry.name}?`;
        populateAnswers(currentCountry.capital);
    } else {
        document.getElementById('quiz-container').innerHTML = `<h2>Quiz Complete! Your score is ${score}.</h2>`;
    }
}

function populateAnswers(correctAnswer) {
    const answersForm = document.getElementById('answers');
    answersForm.innerHTML = '';

    const answers = [correctAnswer];
    while (answers.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!answers.includes(randomCountry.capital)) {
            answers.push(randomCountry.capital);
        }
    }
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const div = document.createElement('div');
        div.classList.add('answer');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = answer;

        const label = document.createElement('label');
        label.innerText = answer;

        div.appendChild(radio);
        div.appendChild(label);
        answersForm.appendChild(div);
    });
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        if (selectedAnswer.value === countries[currentQuestionIndex].capital) {
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    } else {
        alert("Please select an answer!");
        return; // Don't proceed if no answer is selected
    }

    currentQuestionIndex++;
    showQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
});

fetchCountries();