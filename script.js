const clock = document.getElementById("clock");
const alarmInput = document.getElementById("alarmTime");
const status = document.getElementById("status");

let alarmTime = null;
let voiceIntervalId = null;
let preAlarmTimeoutId = null;
let isPaused = false;

const voicePrompts = [
  "Hey! It's time to wake up!",
  "Rise and shine!",
  "Don't miss your morning!",
  "Get ready for the day!",
  "Wake up! Opportunities await!",
  "Time is ticking! Let's go!",
  "Hey sleepyhead, time to rise!"
];

// Update digital clock every second
setInterval(() => {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();

  if (alarmTime && !isPaused) {
    const [h, m] = alarmTime.split(":");
    const alarmDate = new Date();
    alarmDate.setHours(+h);
    alarmDate.setMinutes(+m);
    alarmDate.setSeconds(0);

    if (now >= alarmDate) {
      finalAlarm();
      clearInterval(voiceIntervalId);
      alarmTime = null;
    }
  }
}, 1000);

// Set Alarm
function setAlarm() {
  if (!alarmInput.value) {
    alert("Please choose a time");
    return;
  }

  stopAlarm(); // Reset everything if already running

  alarmTime = alarmInput.value;
  const [h, m] = alarmTime.split(":");

  const now = new Date();
  const alarmDate = new Date();
  alarmDate.setHours(+h);
  alarmDate.setMinutes(+m);
  alarmDate.setSeconds(0);

  const preAlarmStart = new Date(alarmDate.getTime() - 60 * 60 * 1000); // 1 hour before

  const timeUntilStart = preAlarmStart - now;

  if (timeUntilStart > 0) {
    status.textContent = `✅ Alarm set for ${alarmTime}. Will start reminders 1 hour before.`;
    preAlarmTimeoutId = setTimeout(startVoicePrompts, timeUntilStart);
  } else {
    // Already inside the 1-hour window
    status.textContent = `✅ Alarm set for ${alarmTime}. Starting reminders immediately.`;
    startVoicePrompts();
  }
}

// Start voice reminders
function startVoicePrompts() {
  if (isPaused) return;
  speakRandomVoice(); // speak immediately
  voiceIntervalId = setInterval(() => {
    if (!isPaused) speakRandomVoice();
  }, 1* 60 * 1000); // every 5 mins
}

// Speak a random prompt
function speakRandomVoice() {
  const msg = new SpeechSynthesisUtterance(getRandomPrompt());
  msg.pitch = 1;
  msg.rate = 1;
  speechSynthesis.speak(msg);
}

function getRandomPrompt() {
  const index = Math.floor(Math.random() * voicePrompts.length);
  return voicePrompts[index];
}

// Final alarm voice
function finalAlarm() {
  const finalMsg = new SpeechSynthesisUtterance("This is your final wake-up alarm! Time to get up now!");
  finalMsg.pitch = 1.2;
  finalMsg.rate = 1;
  speechSynthesis.speak(finalMsg);
  status.textContent = "🔔 Final Alarm Ringing!";
}

// Pause
function pauseAlarm() {
  isPaused = true;
  speechSynthesis.cancel();
  status.textContent = "⏸️ Alarm Paused";
}

// Stop
function stopAlarm() {
  isPaused = false;
  speechSynthesis.cancel();
  clearInterval(voiceIntervalId);
  clearTimeout(preAlarmTimeoutId);
  voiceIntervalId = null;
  preAlarmTimeoutId = null;
  status.textContent = "🛑 Alarm Stopped";
}

// Reset
function resetAlarm() {
  stopAlarm();
  alarmTime = null;
  alarmInput.value = "";
  status.textContent = "🔄 Alarm Reset";
}
