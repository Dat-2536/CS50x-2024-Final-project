// Select DOM elements
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const pomodoroBtn = document.getElementById("pomodoroBtn");
const shortBreakBtn = document.getElementById("shortBreakBtn");
const longBreakBtn = document.getElementById("longBreakBtn");
const roundDisplay = document.getElementById("round");
const addTaskBtn = document.getElementById("addTaskBtn");
const body = document.body;

// Timer variables
let timerInterval = null;
let timeLeft = 25 * 60; // Default to 25 minutes
let isRunning = false;
let currentMode = "pomodoro"; // Modes: pomodoro, shortBreak, longBreak
let round = 1; // Current round

// Colors
const pomodoroColor = "var(--pomodoro)";
const breakColor = "var(--break)";

// Function to resize elements when device width is narrow
function buttonSize() {
    if (window.innerWidth < 500) {
        startBtn.style.fontSize = "80%";
        skipBtn.style.fontSize = "80%";
        pomodoroBtn.style.fontSize = "80%";
        shortBreakBtn.style.fontSize = "80%";
        longBreakBtn.style.fontSize = "80%";
    } else {
        startBtn.style.fontSize = "100%";
        skipBtn.style.fontSize = "100%";
        pomodoroBtn.style.fontSize = "100%";
        shortBreakBtn.style.fontSize = "100%";
        longBreakBtn.style.fontSize = "100%";
    }

    if (window.innerWidth < 409) {
        pomodoroBtn.textContent = "Pomo doro"
    }
    else {
        pomodoroBtn.textContent = "Pomodoro"
    }
}

// Call the function on window resize
window.addEventListener("resize", buttonSize);

// Call the function initially to set the correct size
buttonSize();

// Function to update the timer display in MM:SS format
function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Function to switch between modes
function switchMode(mode) {
    clearInterval(timerInterval); // Stop any running timer
    isRunning = false;
    startBtn.textContent = "START";
    setStartSkipBtnClasses(mode); // Update START and SKIP button classes

    // Update mode and timeLeft based on mode
    if (mode === "pomodoro") {
        currentMode = "pomodoro";
        timeLeft = 25 * 60;
        setUIClasses("pomodoro");
    } else if (mode === "shortBreak") {
        currentMode = "shortBreak";
        timeLeft = 5 * 60;
        setUIClasses("shortBreak");
    } else if (mode === "longBreak") {
        currentMode = "longBreak";
        timeLeft = 15 * 60;
        setUIClasses("longBreak");
    }

    updateTimerDisplay();
    updateTabTitle(); // Update the tab title
}

// Function to set the UI classes dynamically
function setUIClasses(mode) {
    const favicon = document.querySelector('link[rel="icon"]');
    const logoImg = document.getElementById('logo');

    if (mode === "pomodoro") {
        // Update images to red logos
        favicon.href = "/static/img/red_pomodoro_logo.png";
        logoImg.src = "/static/img/red_pomodoro_logo.png";

        setTimeout(function() {
        // Pomodoro mode
        body.style.backgroundColor = pomodoroColor;

        // Timer text
        timerDisplay.classList.replace("text-success", "text-danger");

        // Start/Skip buttons
        setStartSkipBtnClasses("pomodoro");

        // Buttons: pomodoro active, others inactive
        pomodoroBtn.classList.replace("btn-outline-success", "btn-danger");
        shortBreakBtn.classList.replace("btn-success", "btn-outline-danger");
        shortBreakBtn.classList.replace("btn-outline-success", "btn-outline-danger");
        longBreakBtn.classList.replace("btn-success", "btn-outline-danger");
        longBreakBtn.classList.replace("btn-outline-success", "btn-outline-danger");
        addTaskBtn.classList.replace("btn-outline-success", "btn-outline-danger");
        }, 200);

    } else if (mode === "shortBreak") {
        // Update images to green logos
        favicon.href = "/static/img/green_pomodoro_logo.png";
        logoImg.src = "/static/img/green_pomodoro_logo.png";

        setTimeout(function() {
        // Short Break
        body.style.backgroundColor = breakColor;

        // Timer text
        timerDisplay.classList.replace("text-danger", "text-success");

        // Start/Skip buttons
        setStartSkipBtnClasses("break");


        pomodoroBtn.classList.replace("btn-danger", "btn-outline-success");
        shortBreakBtn.classList.replace("btn-outline-danger", "btn-success");
        shortBreakBtn.classList.replace("btn-outline-success", "btn-success");
        longBreakBtn.classList.replace("btn-outline-danger", "btn-outline-success");
        longBreakBtn.classList.replace("btn-success", "btn-outline-success");
        addTaskBtn.classList.replace("btn-outline-danger", "btn-outline-success");
        }, 200);

    } else if (mode === "longBreak") {
        // Update images to green logos
        favicon.href = "/static/img/green_pomodoro_logo.png";
        logoImg.src = "/static/img/green_pomodoro_logo.png";

        setTimeout(function() {
        // Long Break
        body.style.backgroundColor = breakColor;

        // Timer text
        timerDisplay.classList.replace("text-danger", "text-success");

        // Start/Skip buttons
        setStartSkipBtnClasses("break");

        pomodoroBtn.classList.replace("btn-danger", "btn-outline-success");
        longBreakBtn.classList.replace("btn-outline-danger", "btn-success");
        longBreakBtn.classList.replace("btn-outline-success", "btn-success");
        shortBreakBtn.classList.replace("btn-outline-danger", "btn-outline-success");
        shortBreakBtn.classList.replace("btn-success", "btn-outline-success");
        addTaskBtn.classList.replace("btn-outline-danger", "btn-outline-success");
        }, 200);
    }
}

// Function to set START and SKIP button classes
function setStartSkipBtnClasses(mode) {
    if (mode === "pomodoro") {
        startBtn.classList.replace("btn-success", "btn-danger");
        skipBtn.classList.replace("btn-success", "btn-danger");
    } else {
        startBtn.classList.replace("btn-danger", "btn-success");
        skipBtn.classList.replace("btn-danger", "btn-success");
    }
}

// Function to start or pause the timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = "START";
        document.title = "Paused | Pomodoro Timer"; // Display paused status in tab
    } else {
        isRunning = true;
        startBtn.textContent = "PAUSE";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            updateTabTitle(); // Update tab title every second

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimerEnd();
            }
        }, 1000);
    }
}

// Update the time on the tab
function updateTabTitle() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    if (currentMode === "pomodoro") {
        document.title = `${minutes}:${seconds} | Focus Time ⏳`;
    } else if (currentMode === "shortBreak") {
        document.title = `${minutes}:${seconds} | Short Break ☕`;
    } else if (currentMode === "longBreak") {
        document.title = `${minutes}:${seconds} | Long Break 🌴`;
    }
}


// Function to handle timer end or skip
function handleTimerEnd() {
    if (currentMode === "pomodoro") {
        // After Pomodoro, decide the break
        if (round % 4 === 0) {
            switchMode("longBreak");
        } else {
            switchMode("shortBreak");
        }
    } else {
        // After breaks, go back to Pomodoro and increase the round
        round++;
        roundDisplay.textContent = `#${round}`;
        switchMode("pomodoro");
    }
}

// Event listeners
startBtn.addEventListener("click", toggleTimer);
skipBtn.addEventListener("click", handleTimerEnd);

pomodoroBtn.addEventListener("click", () => switchMode("pomodoro"));
shortBreakBtn.addEventListener("click", () => switchMode("shortBreak"));
longBreakBtn.addEventListener("click", () => switchMode("longBreak"));

// Initialize display
switchMode("pomodoro");
updateTimerDisplay();
