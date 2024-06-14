//alert("PLZ, SELECT MODE FIRST");
var MOD = "STOPWATCH",
  startTime = 0,
  instantaneousTime = 0,
  timerOn = false,
  IntervalID,
  HTML = ``,
  num = 0,
  seconds = 0.0,
  minutes = 0,
  hours = 0,
  timeOut = true,
  saved;

let RecordList = [];
//stopwatch mode button
const stopWatchElement = document.querySelector(".stopWatch-button");
const countDownElement = document.querySelector(".countDown-button");

const inputDisplay = document.querySelector(".input-display");
const resetButton = document.querySelector(".reset-button");
const startStopButton = document.querySelector(".start-button");
const saveButton = document.querySelector(".save-button");

//display input value
const setTimer = document.querySelector(".set-timer-button");

//display output value
const showSecond = document.querySelector(".seconds");
const showMinute = document.querySelector(".minutes");
const showHour = document.querySelector(".hours");
// alarm element
const Alarm = document.querySelector(".alarm");

//input elements
const hourElement = document.querySelector(".hours-input");
const minuteElement = document.querySelector(".minutes-input");
const secondElement = document.querySelector(".seconds-input");

stopWatchMode("STOPWATCH");

//clicking stopwatch mode;
stopWatchElement.addEventListener("click", () => {
  if (!timerOn) {
    stopWatchMode("STOPWATCH");
    stopWatchElement.setAttribute("title", "Stop Watch Mode");
  } else Indicator();
});

//clicking count down mode
countDownElement.addEventListener("click", () => {
  if (!timerOn) {
    stopWatchMode("COUNTDOWN");
    countDownElement.setAttribute("title", "Count Down Mode");
  } else Indicator();
});

startStopButton.addEventListener("click", () => {
  if (MOD === "STOPWATCH") {
    StopWatch("up");

    timerOn
      ? countDownElement.setAttribute("title", "Stop first the Stop watch")
      : countDownElement.setAttribute("title", "Count Down Mode");

    timerOn
      ? countDownElement.classList.add("forbidden")
      : countDownElement.classList.remove("forbidden");
  } else if (MOD === "COUNTDOWN") {
    if (!(seconds === 0 && minutes === 0 && hours === 0)) {
      StopWatch("down");

      timerOn
        ? stopWatchElement.setAttribute("title", "Stop first the Timer")
        : stopWatchElement.setAttribute("title", "Stop Watch Mode");

      timerOn
        ? stopWatchElement.classList.add("forbidden")
        : stopWatchElement.classList.remove("forbidden");

      timerOn
        ? setTimer.classList.add("forbidden")
        : setTimer.classList.remove("forbidden");
    } else alert("No time configured!, please enter valid time");
  }
});

resetButton.addEventListener("click", () => {
  resetFunction();
});

setTimer.addEventListener("click", () => {
  if (!timerOn) {
    settingTimer();
    console.log("clicked");
  } else Indicator();
});

saveButton.addEventListener("click", saveTime);

function saveTime() {
  let checker1 = !(seconds === 0 && minutes === 0 && hours === 0);
  if (checker1) {
    if (RecordList.length < 5) {
      if (RecordList.length === 0) HTML = "";
      saved = {
        seconds: seconds < 10 ? "0" + seconds.toFixed(1) : seconds.toFixed(1),
        minutes: minutes < 10 ? "0" + minutes : minutes,
        hours: hours < 10 ? "0" + hours : hours,
      };
      RecordList.push(saved);
    } else {
      saveButton.removeEventListener("click", saveTime);
    }
    LoopDisplay();
  }
}

function LoopDisplay() {
  let accumulator = "";
  RecordList.forEach((record, index) => {
    accumulator += `<div class="saved-records">
      <p class="saved-time">${index + 1}).${record.hours}:${record.minutes}:${
      record.seconds
    }<hr>
      </p>
      <button class="delete-records">delete</button>
    </div>`;
  });
  document.querySelector(".saved-time-container").innerHTML = accumulator;

  DeletingRecord();
}

function DeletingRecord() {
  document.querySelectorAll(".saved-records").forEach((button, index) => {
    button.querySelector(".delete-records").addEventListener("click", () => {
      RecordList.splice(index, 1);
      LoopDisplay();
    });
  });
  saveButton.addEventListener("click", saveTime);
}

document.querySelector(
  ".saved-time-container"
).innerHTML = `<div class="saved-records"><p class="saved-time"> 1).00:00:00.0</p><button class="delete-records forbidden">delete</button></div>`;

//control timeflow cycles
function StopWatch(count) {
  if (!timerOn) {
    IntervalID = setInterval(() => {
      TimeEngine(count);
    }, 100);
    startStopButton.innerHTML = "STOP";
    timerOn = true;
  } else {
    clearInterval(IntervalID);
    startStopButton.innerHTML = "START";
    timerOn = false;
  }
}

function stopWatchMode(MODE) {
  MOD = MODE;
  saveButton.addEventListener("click", saveTime);
  RecordList.splice(0);
  if (MOD === "STOPWATCH") {
    stopWatchElement.classList.add("stopWatch-mode");
    countDownElement.classList.remove("countDown-mode");
    inputDisplay.classList.add("disappear");
  } else if (MOD === "COUNTDOWN") {
    countDownElement.classList.add("countDown-mode");
    stopWatchElement.classList.remove("stopWatch-mode");
    inputDisplay.classList.remove("disappear");
  }
  resetFunction();
}

// controls the time intervals to be displayeed
function TimeEngine(comand) {
  if (comand === "up") {
    seconds = (instantaneousTime += 1) / 10;
    if (seconds === 60) {
      instantaneousTime = 0;
      minutes = Number(minutes) + 1;
      seconds = 0;
    }
    if (minutes === 60) {
      hours = Number(hours) + 1;
      minutes = 0;
    }
    UpdateTime();
  } else if ((comand = "down")) {
    if (Number(seconds) === 0 && Number(hours) === 0 && Number(minutes) === 0) {
      clearInterval(IntervalID);
      startStopButton.innerHTML = "START";

      Alarm.currentTime = 28.5;
      Alarm.play();

      setTimer.classList.remove("forbidden");
      stopWatchElement.classList.remove("forbidden");
      timerOn = false;
    } else if (seconds === 0 && minutes != 0) {
      seconds = 59;
      minutes -= 1;
    } else if (seconds === 0 && minutes === 0 && hours != 0) {
      seconds = 59;
      minutes = 59;
      hours -= 1;
    } else if (minutes === 0 && hours != 0 && seconds === 0) {
      hours = Number(hours) - 1;
      minutes = 59;
    } else {
      seconds = (Number(seconds) * 10 - 1) / 10;
    }
    UpdateTime();

    if (
      Number(seconds) <= 10 &&
      Number(hours) === 0 &&
      Number(minutes) === 0 &&
      timeOut
    ) {
      document.querySelector(".seconds").classList.add("finalSeconds");
      setTimeout(() => {
        document.querySelector(".seconds").classList.remove("finalSeconds");
        timeOut = true;
      }, 500);
      timeOut = false;
    }
  }
}
function resetFunction() {
  hours = minutes = seconds = instantaneousTime = num = 0;
  clearInterval(IntervalID);
  timerOn = false;
  startStopButton.innerHTML = "START";
  RecordList.splice(0);
  LoopDisplay();
  UpdateTime();
  ClearInput();
  saveButton.addEventListener("click", saveTime);
  stopWatchElement.classList.remove("forbidden");
  countDownElement.classList.remove("forbidden");
  setTimer.classList.remove("forbidden");
  document.querySelector(".saved-time-container").innerHTML = `
<div class="saved-records"><p class="saved-time"> 1).00:00:00.0</p><button class="delete-records forbidden">delete</button></div>`;
}

function UpdateTime() {
  showMinute.innerHTML = minutes < 10 ? "0" + minutes : minutes;
  showSecond.innerHTML =
    seconds < 10 ? "0" + seconds.toFixed(1) : seconds.toFixed(1);
  showHour.innerHTML = hours < 10 ? "0" + hours : hours;
}

function settingTimer() {
  if (
    Number(secondElement.value) === 0 &&
    Number(minuteElement.value) === 0 &&
    Number(hourElement.value) === 0
  ) {
    alert("No Time configured, please enter valid time");
  } else if (
    Number(secondElement.value) >= 0 &&
    Number(minuteElement.value) >= 0 &&
    Number(hourElement.value) >= 0
  ) {
    seconds = Number(secondElement.value);
    minutes = Number(minuteElement.value);
    hours = Number(hourElement.value);

    UpdateTime();
    ClearInput();
  } else {
    alert("Invalid!, Please enter valid time");
    ClearInput();
  }
  startStopButton.innerHTML = "START";
  clearInterval(IntervalID);
}

function ClearInput() {
  secondElement.value = "";
  minuteElement.value = "";
  hourElement.value = "";
}
function Indicator() {
  setTimeout(() => {
    startStopButton.classList.remove("indicator");
  }, 100);
  startStopButton.classList.add("indicator");
}
