let myQuestions = [
  {
    id: 1,
    qoustion: "Which season is month of december in ? ",
    answers: {
      a: "Winter",
      b: "Autumn",
      c: "spring",
      d: "Summer",
    },
    corectAnswer: "a",
  },
  {
    id: 2,
    qoustion: "Which one is the correct? ",
    answers: {
      a: "joly",
      b: "jolai",
      c: "juleye",
      d: "July",
    },

    corectAnswer: "d",
  },
  {
    id: 3,
    qoustion: "which is teh coldest season? ",
    answers: {
      a: "Winter",
      b: "autumn",
      c: "spring",
      d: "summer",
    },
    corectAnswer: "a",
  },
  {
    id: 4,
    qoustion: "Which season is month of august in ? ",
    answers: {
      a: "Winter",
      b: "autumn",
      c: "spring",
      d: "summer",
    },
    corectAnswer: "d",
  },
];

let $ = document;
let infoDiv = $.getElementById("info");
let testDiv = $.getElementById("test");
let result = [];
let score = 0;

infoDiv.insertAdjacentHTML(
  "afterbegin",
  `
     <div class="col-md-9 align-self-start infoTest">
     <p class="text"> This test has 4 question, andeach question has 25 points. you have 35 seconds to answer all questions</p>
     <p> Please be aware if you close/change tab you will lose all your points</p>
     <button type="button" class="btn btn-secondary" onclick="testStart()" id="startBtn">Start The Test</button>
     </div>
  `
);
infoDiv.insertAdjacentHTML(
  "beforeend",
  `
    <div  class="col-md-3 timer" id="timer">
  
    </div>
    `
);

function testStart() {
  $.getElementById("startBtn").disabled = "true";

  showTimer();
  showQuestions();
}

let i = 0;
function nextQuestion(answer) {
  if (i < myQuestions.length - 1) {
    if (myQuestions[i].corectAnswer == answer) {
      score += 25;
    }
    i++;
    showQuestions();
  } else {
    $.getElementById("nextBtn").innerHTML = `
      <button class="btn btn-outline-dark FinishBtn" type="button" id="finishBtn" onclick="finishCal()"> Finish </button>`;
  }
}

function showQuestions() {
  testDiv.innerHTML = `
          <div class="col-sm-9 questionsCol" id="questionsCol${myQuestions[i].id}">
              <div class="row questionRow" id="questionRow">
                  <div class="col">
                  ${myQuestions[i].qoustion}
                  </div>
              </div>
            <div class="row answersRow" name="question" id= ${myQuestions[i].id}>
            
            </div>
          </div>
          `;

  showAnswers(myQuestions[i]);

  testDiv.insertAdjacentHTML(
    "beforeEnd",
    `
    <div class="col-sm-3  nextBtnCol" id="nextBtnCol">
        <div class="col mt-5  align-self-end  nextBtnDiv " >
            <button class="btn btn-outline-dark nextBtn" type="button" id="nextBtn" > Next</button>
        </div>
    </div>
    `
  );
}

function showAnswers(eachQuestion) {
  let answersRow = $.getElementById(eachQuestion.id);
  for (let letter in eachQuestion.answers) {
    answersRow.insertAdjacentHTML(
      "afterbegin",
      `
      <lable for="${letter} ">${letter} : ${eachQuestion.answers[letter]}
      <input id="${letter}" onclick="calResult()" type="radio" name="question" value=${letter}>
      </lable>
      `
    );
  }
}

function calResult() {
  result = event.target.value;
  console.log(result);
  nextQuestion(result);
}

function finishCal() {
  testDiv.innerHTML = `
  <div class="col">
   <p>your final reuslt is ${score}</p>
   </div>
  `;
  $.getElementById("startBtn").disabled = false;
  clearInterval(timerInterval);
}

// ------ on tab change -----
$.addEventListener("visibilitychange", function () {
  $.title = $.visibilityState;
  if ($.title === "hidden") {
    clearInterval(timerInterval);
    finishCal();
  }
});

// -------- timer -------

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

function showTimer() {
  let remainingPathColor = COLOR_CODES.info.color;
  let timer = $.getElementById("timer");
  timer.innerHTML = `
  <div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
    </div>
    `;

  startTimer();
}
function onTimesUp() {
  clearInterval(timerInterval);
  finishCal();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    $.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}
function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    $.getElementById("base-timer-path-remaining").classList.remove(
      warning.color
    );
    $.getElementById("base-timer-path-remaining").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    $.getElementById("base-timer-path-remaining").classList.remove(info.color);
    $.getElementById("base-timer-path-remaining").classList.add(warning.color);
  }
}
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  $.getElementById("base-timer-path-remaining").setAttribute(
    "stroke-dasharray",
    circleDasharray
  );
}
