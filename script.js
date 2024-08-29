const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen"),
  resultScreen = document.querySelector(".result-container");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion = 0,
  timer = 1,
  attemptedQuestions = 0;

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;
  loadingAnimation();
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 0;  // Fix: should start from 0
        showQuestion(questions[currentQuestion]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [...question.incorrect_answers, question.correct_answer];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>
    `;
  });

  questionNumber.innerHTML = `Question <span class="current">${currentQuestion + 1}</span>
    <span class="total">/${questions.length}</span>`;

  // Add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = parseInt(timePerQuestion.value, 10); // Fix: ensure time is an integer
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAudio("comdown.wav"); // Fix: corrected function name
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      clearInterval(timer); // Fix: clear the timer when time runs out
      checkAnswer();
    }
  }, 1000);
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const feedbackDiv = document.querySelector(".feedback"),
  feedbackText = document.querySelector(".feedback-text");

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  let feedback = "";

  if (selectedAnswer) {
    attemptedQuestions++;
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion].correct_answer) { // Fix: currentQuestion index
      score++;
      selectedAnswer.classList.add("correct");
      feedback = "Correct! Well done.";
    } else {
      selectedAnswer.classList.add("wrong");
      feedback = `Incorrect. The correct answer was: ${questions[currentQuestion].correct_answer}`;
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    feedback = `Time's up! The correct answer was: ${questions[currentQuestion].correct_answer}`;
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }

  feedbackText.innerHTML = feedback;
  feedbackDiv.classList.remove("hide");

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  feedbackDiv.classList.add("hide");
  if (currentQuestion < questions.length - 1) { // Fix: ensure index does not go out of bounds
    currentQuestion++;
    showQuestion(questions[currentQuestion]);
  } else {
    showScore();
  }
};

const showScore = () => {
  const totalQuestions = questions.length;
  const correctAnswers = score;
  const wrongAnswers = attemptedQuestions - correctAnswers;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  document.getElementById("total-questions").innerText = totalQuestions;
  document.getElementById("attempted-questions").innerText = attemptedQuestions;
  document.getElementById("correct-questions").innerText = correctAnswers;
  document.getElementById("wrong-questions").innerText = wrongAnswers;
  document.getElementById("total-score").innerText = correctAnswers;
  document.getElementById("percentage").innerText = `${percentage}%`; // Fix: Use template literal

  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${percentage}%`; // Fix: Use template literal

  resultScreen.classList.remove("hide");
  quiz.classList.add("hide");
};

const restartBtn = document.getElementById("try-again");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

const homeBtn = document.getElementById("go-home");
homeBtn.addEventListener("click", () => {
  window.location.reload();
});

const playAudio = (src) => { // Fix: corrected function name
  const audio = new Audio(src);
  audio.play();
};

const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (remainingTime) => {
  const totalTime = parseInt(timePerQuestion.value, 10); // Fix: ensure totalTime is an integer
  const percentage = ((totalTime - remainingTime) / totalTime) * 100;
  progressBar.style.width = `${percentage}%`; // Fix: Use template literal
  progressText.innerHTML = `${remainingTime}`; // Fix: Use template literal
};

// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}



// [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

