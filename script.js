let setSeconds = 30; // 設定した時間（秒）。リセットしたときに戻る値
let remaining = setSeconds; // 残り秒数
let timerId = null;         // 動作中のタイマーの番号（止まっているときは null）

const display = document.getElementById("display");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const messageInput = document.getElementById("messageInput");

// 残り秒数を「分:秒」の形にして画面に表示する
function updateDisplay() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  display.textContent = minutes + ":" + seconds;
}

// ブラウザの音声合成機能で、文字を声に出して読み上げる
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP"; // 日本語で読み上げる
  speechSynthesis.speak(utterance);
}

// 入力欄の「分」「秒」から設定時間を読み取り、表示に反映する
function applySetting() {
  const minutes = Math.max(0, parseInt(minutesInput.value, 10) || 0);
  const seconds = Math.max(0, parseInt(secondsInput.value, 10) || 0);
  setSeconds = minutes * 60 + seconds;
  remaining = setSeconds;
  updateDisplay();
}

// 動作中は入力欄を触れないようにする
function setInputsDisabled(disabled) {
  minutesInput.disabled = disabled;
  secondsInput.disabled = disabled;
}

function start() {
  if (timerId !== null || remaining === 0) return; // 二重スタートを防ぐ
  setInputsDisabled(true);
  timerId = setInterval(function () {
    remaining--;
    if (remaining === 0) {
      speak(messageInput.value.trim() || "時間です"); // 空欄のときは「時間です」
      remaining = setSeconds; // 自動でリセットして、そのまま繰り返す
    }
    updateDisplay();
  }, 1000); // 1000ミリ秒 = 1秒ごとに実行
}

function stop() {
  clearInterval(timerId);
  timerId = null;
  setInputsDisabled(false);
}

function reset() {
  stop();
  remaining = setSeconds;
  updateDisplay();
}

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("stopBtn").addEventListener("click", stop);
document.getElementById("resetBtn").addEventListener("click", reset);
minutesInput.addEventListener("input", applySetting);
secondsInput.addEventListener("input", applySetting);

applySetting();
