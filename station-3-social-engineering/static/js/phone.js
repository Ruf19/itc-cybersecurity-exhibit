/* ══════════════════════════════════════════════════════════
   phone.js — Station 3 Phone Target & Screen Mirror Streamer
   ══════════════════════════════════════════════════════════ */

let socket;
let spamQueue = 0;
let spamTotal = 5;
let currentAlertMsg = "";
let batteryLevel = 0.85;
let orientation = { alpha: 0, beta: 0, gamma: 0 };

function showPhToast(msg, ms = 2500) {
  const el = document.getElementById("phToast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), ms);
}

// ── Splash Sequence ───────────────────────────────────────────────────────────
const SPLASH_STEPS = [
  [0.2, "SEARCHING FOR EXHIBIT STATIONS..."],
  [0.5, "PROXIMITY RADAR: 0.1m TO STATION 03"],
  [0.8, "AUTHENTICATING WIRELESS TELEMETRY..."],
  [1.0, "CONNECTED"]
];

function runSplash() {
  const fill = document.getElementById("splashProgress");
  const label = document.getElementById("splashLabel");
  let step = 0;

  function doStep() {
    if (step >= SPLASH_STEPS.length) {
      setTimeout(() => {
        const splashEl = document.getElementById("splash");
        if (splashEl) {
          splashEl.classList.add("fade-out");
          setTimeout(() => {
            splashEl.style.display = "none";
            document.getElementById("phoneMain").style.display = "flex";
            initSocket();
          }, 400);
        }
      }, 200);
      return;
    }
    const [pct, text] = SPLASH_STEPS[step];
    if (fill) fill.style.width = `${pct * 100}%`;
    if (label) label.textContent = text;
    step++;
    setTimeout(doStep, 350);
  }
  doStep();
}

// ── Socket & Streaming ────────────────────────────────────────────────────────
function initSocket() {
  const url = `http://${SERVER_IP}:5002`;
  socket = io(url, { transports: ["websocket", "polling"] });

  socket.on("connect", () => {
    requestBattery();
    requestOrientation();
    emitJoin();
  });

  socket.on("joined_ok", (data) => {
    if (data.model) {
      const title = document.getElementById("phoneHeaderTitle");
      if (title) title.textContent = data.model.toUpperCase();
    }
    showPhToast("⚡ " + data.message);
  });

  socket.on("receive_spam", (data) => {
    const count = data.count || 5;
    const msg = data.message || "SECURITY WARNING: Unauthorized device nearby!";
    triggerSpam(count, msg);
  });

  socket.on("receive_message", (data) => {
    showPhToast(data.text || "Security Alert", 4000);
    if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
  });

  socket.on("vibrate", (data) => {
    const pattern = data.pattern || [200, 100, 200];
    if ("vibrate" in navigator) navigator.vibrate(pattern);
    showPhToast("📳 Haptic pulse received");
  });
}

function emitJoin() {
  socket.emit("phone_join", {
    ua: navigator.userAgent,
    battery: batteryLevel
  });

  // Telemetry stream every 1.5s
  setInterval(() => {
    socket.emit("phone_update", {
      battery: batteryLevel,
      orientation: orientation
    });
  }, 1500);
}

// ── Interactive App Taps ──────────────────────────────────────────────────────
function triggerAppClick(appName) {
  showPhToast(`📲 ${appName}`);
  if ("vibrate" in navigator) navigator.vibrate(50);

  // Instantly send to laptop dashboard mirror!
  if (socket) {
    socket.emit("phone_action", {
      action: appName,
      timestamp: new Date().toLocaleTimeString()
    });
  }
}

// ── Battery & Orientation ─────────────────────────────────────────────────────
function requestBattery() {
  if ("getBattery" in navigator) {
    navigator.getBattery().then(battery => {
      batteryLevel = battery.level;
      updateBatteryUI(battery.level);
      battery.addEventListener("levelchange", () => {
        batteryLevel = battery.level;
        updateBatteryUI(battery.level);
      });
    }).catch(() => {});
  }
}

function updateBatteryUI(level) {
  const pct = Math.round(level * 100);
  const el = document.getElementById("pBattery");
  if (el) el.textContent = `${pct}%`;
}

function requestOrientation() {
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(state => { if (state === "granted") attachOrientation(); })
      .catch(() => {});
  } else {
    attachOrientation();
  }
}

function attachOrientation() {
  window.addEventListener("deviceorientation", (e) => {
    orientation = { alpha: e.alpha || 0, beta: e.beta || 0, gamma: e.gamma || 0 };
    const b = document.getElementById("pBeta");
    const g = document.getElementById("pGamma");
    if (b) b.textContent = `${Math.round(e.beta || 0)}°`;
    if (g) g.textContent = `${Math.round(e.gamma || 0)}°`;
  }, true);
}

// ── Spam & Exploit Authorization ──────────────────────────────────────────────
function triggerSpam(count, message) {
  spamTotal = count;
  spamQueue = count;
  currentAlertMsg = message;
  showNextSpam();
}

function showNextSpam() {
  if (spamQueue <= 0) return;
  const overlay = document.getElementById("spamOverlay");
  const counter = document.getElementById("spamCounter");
  const msgEl = document.getElementById("spamMsg");

  if (msgEl) msgEl.textContent = currentAlertMsg;
  if (counter) counter.textContent = `ALERT ${spamTotal - spamQueue + 1} OF ${spamTotal}`;

  overlay.style.display = "flex";
  if ("vibrate" in navigator) navigator.vibrate([150, 50, 150]);
}

function dismissSpam() {
  spamQueue--;
  if (spamQueue > 0) {
    setTimeout(showNextSpam, 150);
  } else {
    // Permission granted! Activate Mirror on Laptop
    document.getElementById("spamOverlay").style.display = "none";
    if (socket) {
      socket.emit("permission_granted", {
        model: document.getElementById("phoneHeaderTitle").textContent,
        battery: batteryLevel
      });
    }
    showPhToast("⚠️ PERMISSION GRANTED: Screen Telemetry Streaming!", 4000);
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 500]);
  }
}

window.addEventListener("DOMContentLoaded", runSplash);
