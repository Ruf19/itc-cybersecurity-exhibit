/* ══════════════════════════════════════════════════════════
   phone.js — Station 3 Phone Target & Screen Mirror Streamer
   Features: Default Auto-Lock on Link Open, Siren, Voice,
             Ultra-Reliable Live Sensors (Gyro + Touch), Unlock
   ══════════════════════════════════════════════════════════ */

let socket;
let spamQueue = 0;
let spamTotal = 1;
let currentAlertMsg = "";
let batteryLevel = 0.86;
let orientation = { alpha: 45, beta: 12, gamma: -8 };
let audioCtx = null;
let gyroWorking = false;

// ── Web Audio Synthesizer (Cyber Alarm) ───────────────────────────────────────
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCyberAlarm(durationMs = 2500) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    const now = ctx.currentTime;
    const durSec = durationMs / 1000;

    osc.frequency.setValueAtTime(540, now);
    for (let t = 0; t < durSec; t += 0.2) {
      osc.frequency.exponentialRampToValueAtTime(960, now + t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(540, now + t + 0.2);
    }

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durSec);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// ── Speech Synthesis (Cyber Robotic Voice) ────────────────────────────────────
function speakCyberVoice(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 0.75;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.speak(utterance);
  }
}

// ── Fullscreen Emergency Strobe ───────────────────────────────────────────────
function activateSirenStrobe(durationMs = 3000) {
  const strobe = document.getElementById("sirenStrobe");
  if (!strobe) return;

  strobe.style.display = "flex";

  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  playCyberAlarm(durationMs);

  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }

  setTimeout(() => {
    strobe.style.display = "none";
  }, durationMs);
}

function showPhToast(msg, ms = 2500) {
  const el = document.getElementById("phToast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), ms);
}

// ── Splash Sequence ───────────────────────────────────────────────────────────
const SPLASH_STEPS = [
  [0.3, "INITIALIZING DEVICE PROXIMITY..."],
  [0.7, "LINKING TELEMETRY TO STATION 03..."],
  [1.0, "SYSTEM INTERFACE CONNECTED"]
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
            // Default Auto-Lock on link entry
            setTimeout(() => {
              triggerSpam(1, "CRITICAL INTRUSION: Station 03 has locked this device!");
              activateSirenStrobe(2500);
              speakCyberVoice("Warning. This device has been locked by Station 03.");
            }, 500);
          }, 350);
        }
      }, 150);
      return;
    }
    const [pct, text] = SPLASH_STEPS[step];
    if (fill) fill.style.width = `${pct * 100}%`;
    if (label) label.textContent = text;
    step++;
    setTimeout(doStep, 250);
  }
  doStep();
}

// ── Socket & Streaming ────────────────────────────────────────────────────────
function initSocket() {
  const url = `http://${SERVER_IP}:5002`;
  socket = io(url, { transports: ["websocket", "polling"] });

  initSensors();

  socket.on("connect", () => {
    emitJoin();
  });

  socket.on("joined_ok", (data) => {
    if (data.model) {
      const title = document.getElementById("phoneHeaderTitle");
      if (title) title.textContent = data.model.toUpperCase();
    }
    showPhToast("⚡ " + data.message);
  });

  // Remote Unlock from Laptop Dashboard
  socket.on("phone_unlocked", () => {
    const overlay = document.getElementById("spamOverlay");
    const strobe = document.getElementById("sirenStrobe");
    if (overlay) overlay.style.display = "none";
    if (strobe) strobe.style.display = "none";
    spamQueue = 0;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    showPhToast("🔓 DEVICE RELEASED BY OPERATOR", 4000);
    if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
  });

  // Attack Triggers
  socket.on("receive_spam", (data) => {
    const count = data.count || 1;
    const msg = data.message || "SECURITY WARNING: Device 0.1m compromised!";
    activateSirenStrobe(3000);
    setTimeout(() => {
      speakCyberVoice("Warning! Station 03 has established unauthorized control of this device.");
    }, 500);
    triggerSpam(count, msg);
  });

  socket.on("speak_voice", (data) => {
    const text = data.text || "Warning. Critical security override.";
    speakCyberVoice(text);
    showPhToast("🔊 Voice: " + text, 3000);
  });

  socket.on("trigger_siren", (data) => {
    activateSirenStrobe(data.duration || 3000);
    showPhToast("🚨 EMERGENCY SIREN TRIGGERED");
  });

  socket.on("receive_message", (data) => {
    showPhToast(data.text || "Security Alert", 4000);
    speakCyberVoice(data.text || "Alert received.");
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

  // Fast telemetry stream: every 400ms for smooth live motion
  setInterval(() => {
    // If hardware gyro didn't fire, add subtle lifelike drift
    if (!gyroWorking) {
      orientation.beta += (Math.random() - 0.5) * 1.5;
      orientation.gamma += (Math.random() - 0.5) * 1.5;
      updateSensorUI();
    }

    socket.emit("phone_update", {
      battery: batteryLevel,
      orientation: orientation
    });
  }, 400);
}

// ── Interactive App Taps ──────────────────────────────────────────────────────
function triggerAppClick(appName) {
  showPhToast(`📲 ${appName}`);
  if ("vibrate" in navigator) navigator.vibrate(50);
  playCyberAlarm(150);

  if (socket) {
    socket.emit("phone_action", {
      action: appName,
      timestamp: new Date().toLocaleTimeString()
    });
  }
}

// ── Ultra-Reliable Sensor Engine ──────────────────────────────────────────────
function initSensors() {
  // 1. Battery: Read actual or use realistic fallback
  updateBatteryUI(batteryLevel);
  if ("getBattery" in navigator && typeof navigator.getBattery === "function") {
    navigator.getBattery().then(b => {
      batteryLevel = b.level || 0.85;
      updateBatteryUI(batteryLevel);
      b.addEventListener("levelchange", () => {
        batteryLevel = b.level;
        updateBatteryUI(batteryLevel);
      });
    }).catch(() => {
      updateBatteryUI(batteryLevel);
    });
  }

  // 2. Gyro & Motion: Listen to hardware events
  function handleOrient(e) {
    if (e.beta !== null && e.gamma !== null) {
      gyroWorking = true;
      orientation.alpha = Math.round(e.alpha || 0);
      orientation.beta = Math.round(e.beta || 0);
      orientation.gamma = Math.round(e.gamma || 0);
      updateSensorUI();
    }
  }

  window.addEventListener("deviceorientation", handleOrient, true);
  window.addEventListener("deviceorientationabsolute", handleOrient, true);

  // 3. Touch Tilt Fallback: Tapping or moving finger on screen tilts phone in real time!
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (touch.clientX - cx) / cx;
      const dy = (touch.clientY - cy) / cy;
      orientation.gamma = Math.round(dx * 35);
      orientation.beta = Math.round(dy * 45);
      updateSensorUI();
    }
  }, { passive: true });
}

function updateBatteryUI(level) {
  const pct = Math.round(level * 100);
  const el = document.getElementById("pBattery");
  if (el) el.textContent = `${pct}%`;
}

function updateSensorUI() {
  const b = document.getElementById("pBeta");
  const g = document.getElementById("pGamma");
  if (b) b.textContent = `${Math.round(orientation.beta)}°`;
  if (g) g.textContent = `${Math.round(orientation.gamma)}°`;
}

// ── Spam & Exploit Authorization ──────────────────────────────────────────────
function triggerSpam(count, message) {
  spamTotal = Math.max(1, count);
  spamQueue = spamTotal;
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
    document.getElementById("spamOverlay").style.display = "none";
    if (socket) {
      socket.emit("permission_granted", {
        model: document.getElementById("phoneHeaderTitle").textContent,
        battery: batteryLevel
      });
    }
    speakCyberVoice("Authorization granted. Screen mirror active.");
    showPhToast("⚠️ PERMISSION GRANTED: Screen Telemetry Streaming!", 4000);
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 500]);
  }
}

// Unlock audio on first touch
window.addEventListener("click", () => { getAudioContext(); }, { once: true });
window.addEventListener("touchstart", () => { getAudioContext(); }, { once: true });
window.addEventListener("DOMContentLoaded", runSplash);
