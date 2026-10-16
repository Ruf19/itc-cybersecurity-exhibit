/* ════════════════════════════════════════════════════════════════════
   app.js — Station 04: GHOST-IN-THE-LENS (Adversarial Biometrics)
   Triad Multi-Vector FGSM Attack Engine & Live Biometric Checkpoint
   ════════════════════════════════════════════════════════════════════ */

let currentSubject = "hacker";
let visionMode = "human"; // "human" or "ai"
let cachedAdversarialImg = "";
let cachedHeatmapImg = "";

let triadAmp = 0;
let triadFreq = 0;
let triadAlign = 0;

let isAudioEnabled = true;
let audioCtx = null;
let previousStatus = "ACCESS_DENIED";
let debounceTimer = null;
let webcamStream = null;
let lastSpokenStatus = null;

// ── Web Audio Synthesizer (Checkpoint Security Sounds) ─────────────────────
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSecuritySound(type) {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "granted") {
      // Pleasant futuristic high-tech double-chime (Access Granted)
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);        // D5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === "denied") {
      // Harsh low security buzzer (Access Denied)
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.28);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  } catch (e) {
    console.warn("Audio chime error:", e);
  }
}

// ── Robotic AI Voice Announcements ─────────────────────────────────────────
function speakSecurityAnnouncement(text) {
  if (!isAudioEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05;
    utt.pitch = 0.82; // Deep authoritative AI voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en") && 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("Zira")));
    if (enVoice) utt.voice = enVoice;
    window.speechSynthesis.speak(utt);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}

function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  const btn = document.getElementById("btnAudio");
  if (btn) {
    btn.textContent = isAudioEnabled ? "🔊 AUDIO & VOICE: ENABLED" : "🔇 AUDIO & VOICE: MUTED";
    btn.style.borderColor = isAudioEnabled ? "var(--cyan)" : "var(--muted)";
  }
}

function simulateGateChime() {
  playSecuritySound(previousStatus === "ACCESS_GRANTED" ? "granted" : "denied");
}

// ── Logging ────────────────────────────────────────────────────────────────
function logAudit(msg, type = "info") {
  const el = document.getElementById("auditLog");
  if (!el) return;
  const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${ts}] ${msg}`;
  el.prepend(entry);
  while (el.children.length > 50) el.removeChild(el.lastChild);
}

// ── Vision Mode Switcher (Human vs AI Heatmap) ─────────────────────────────
function setVisionMode(mode) {
  visionMode = mode;
  const bHuman = document.getElementById("btnHumanVision");
  const bAi = document.getElementById("btnAiVision");
  if (bHuman) bHuman.classList.toggle("active", mode === "human");
  if (bAi) bAi.classList.toggle("active", mode === "ai");

  const subImg = document.getElementById("subjectImg");
  if (!subImg) return;

  if (mode === "ai" && cachedHeatmapImg) {
    subImg.src = cachedHeatmapImg;
  } else if (cachedAdversarialImg) {
    subImg.src = cachedAdversarialImg;
  }
  logAudit(`Vision sensor switched: ${mode === "ai" ? "AI NEURAL ACTIVATION HEATMAP" : "HUMAN PERCEPTION"}`, "info");
}

// ── Triad Sliders & Convergence Engine ─────────────────────────────────────
function onTriadSliderChange() {
  const sAmp = document.getElementById("sliderAmp");
  const sFreq = document.getElementById("sliderFreq");
  const sAlign = document.getElementById("sliderAlign");

  triadAmp = parseInt(sAmp.value, 10);
  triadFreq = parseInt(sFreq.value, 10);
  triadAlign = parseInt(sAlign.value, 10);

  // Update slider label readouts
  const epsEst = ((triadAmp / 100.0) * 0.12).toFixed(3);
  document.getElementById("dispAmp").textContent = `ε = ${epsEst} [${triadAmp}%]`;
  
  const freqLabel = triadFreq < 30 ? "DISPERSED" : (triadFreq < 70 ? "CONTOUR FOCUS" : "LANDMARK MASK");
  document.getElementById("dispFreq").textContent = `${triadFreq}% (${freqLabel})`;

  const alignLabel = triadAlign < 30 ? "ORTHOGONAL" : (triadAlign < 70 ? "APPROACHING" : "CEO LOCK");
  document.getElementById("dispAlign").textContent = `${triadAlign}% (${alignLabel})`;

  // Immediate Client-Side Convergence Preview
  const s1 = triadAmp / 100.0;
  const s2 = triadFreq / 100.0;
  const s3 = triadAlign / 100.0;
  const cEst = Math.pow(s1 * s2 * s3, 0.75) * 100.0;
  updateConvergenceMeter(cEst);

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runAdversarialInference, 30);
}

function updateConvergenceMeter(convPct) {
  const cVal = document.getElementById("convergenceVal");
  const cFill = document.getElementById("convergenceFill");
  const cStatus = document.getElementById("convergenceStatus");
  const cCard = document.getElementById("convergenceCard");

  if (cVal) cVal.textContent = `${convPct.toFixed(1)}%`;
  if (cFill) cFill.style.width = `${Math.min(100, Math.max(0, convPct))}%`;

  if (convPct >= 65.0) {
    if (cVal) cVal.className = "cc-val mono accent-matrix";
    if (cFill) cFill.className = "cc-fill fill-green";
    if (cCard) cCard.className = "convergence-card granted";
    if (cStatus) cStatus.textContent = "⚡ TRIAD BREACH ACHIEVED // BIOMETRIC LOCK COMPLETED";
  } else if (convPct >= 35.0) {
    if (cVal) cVal.className = "cc-val mono accent-gold";
    if (cFill) cFill.className = "cc-fill fill-gold";
    if (cCard) cCard.className = "convergence-card uncertain";
    if (cStatus) cStatus.textContent = "⚠️ EQUILIBRIUM: TUNING DEFENSE HARMONICS... RAISE REMAINING VECTORS";
  } else {
    if (cVal) cVal.className = "cc-val mono accent-red";
    if (cFill) cFill.className = "cc-fill fill-red";
    if (cCard) cCard.className = "convergence-card";
    if (cStatus) cStatus.textContent = "DEFENSES INTACT — ALL 3 VECTORS MUST COINCIDE";
  }
}

function resetTriadSliders() {
  document.getElementById("sliderAmp").value = 0;
  document.getElementById("sliderFreq").value = 0;
  document.getElementById("sliderAlign").value = 0;
  triadAmp = 0;
  triadFreq = 0;
  triadAlign = 0;
  document.getElementById("dispAmp").textContent = "ε = 0.000 [0%]";
  document.getElementById("dispFreq").textContent = "0% (DISPERSED)";
  document.getElementById("dispAlign").textContent = "0% (ORTHOGONAL)";
  updateConvergenceMeter(0.0);
}

// ── Live Webcam Scan & Snapshot ───────────────────────────────────────────
function stopWebcamStream() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(t => t.stop());
    webcamStream = null;
  }
  const video = document.getElementById("webcamVideo");
  const subjectImg = document.getElementById("subjectImg");
  const btnToggle = document.getElementById("btnToggleWebcam");
  const btnSnap = document.getElementById("btnSnapWebcam");
  const hudTag = document.getElementById("hudLiveTag");

  if (video) {
    video.srcObject = null;
    video.style.display = "none";
  }
  if (subjectImg) subjectImg.style.display = "block";
  if (btnToggle) {
    btnToggle.innerHTML = "📹 START LIVE WEBCAM SCAN";
    btnToggle.className = "btn btn-primary btn-sm";
  }
  if (btnSnap) btnSnap.style.display = "none";
  if (hudTag) hudTag.textContent = "LIVE FEED: STANDBY";
}

async function toggleWebcam() {
  if (webcamStream) {
    stopWebcamStream();
    logAudit("Webcam scan stopped", "info");
    return;
  }

  const video = document.getElementById("webcamVideo");
  const subjectImg = document.getElementById("subjectImg");
  const btnToggle = document.getElementById("btnToggleWebcam");
  const btnSnap = document.getElementById("btnSnapWebcam");
  const hudTag = document.getElementById("hudLiveTag");

  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" },
      audio: false
    });

    video.srcObject = webcamStream;
    video.style.display = "block";
    if (subjectImg) subjectImg.style.display = "none";

    btnToggle.innerHTML = "⏹️ STOP WEBCAM";
    btnToggle.className = "btn btn-ghost btn-sm";
    if (btnSnap) btnSnap.style.display = "block";
    if (hudTag) hudTag.textContent = "LIVE FEED: ACTIVE SENSOR";

    // Switch active target to intruder mode
    document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
    const btnHacker = document.getElementById("btnHacker");
    if (btnHacker) btnHacker.classList.add("active");

    logAudit("Live camera activated — align face inside biometric mesh and click CAPTURE", "info");
  } catch (err) {
    console.error("Camera access failed:", err);
    logAudit(`Webcam error: ${err.message || 'Permission denied'}`, "denied");
    alert("Camera permission denied or camera device unavailable. Please allow camera access in browser.");
  }
}

function captureWebcamSnapshot() {
  const video = document.getElementById("webcamVideo");
  const canvas = document.getElementById("webcamCanvas");
  const subjectImg = document.getElementById("subjectImg");
  const hudTag = document.getElementById("hudLiveTag");

  if (!webcamStream || !video || !video.videoWidth) {
    logAudit("Camera stream not ready for capture", "denied");
    return;
  }

  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Mirror horizontally so snapshot matches mirrored video feed
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  const base64Data = canvas.toDataURL("image/jpeg", 0.92);

  // Stop camera stream and show frozen snapshot
  stopWebcamStream();
  if (subjectImg) {
    subjectImg.src = base64Data;
    subjectImg.style.display = "block";
  }
  const btnToggle = document.getElementById("btnToggleWebcam");
  if (btnToggle) btnToggle.innerHTML = "📹 RETAKE LIVE WEBCAM SCAN";
  if (hudTag) hudTag.textContent = "LIVE FEED: SNAPSHOT ACQUIRED";

  logAudit("Biometric snapshot captured. Processing with neural net...", "info");

  fetch("/api/upload_image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Data })
  })
  .then(r => r.json())
  .then(res => {
    if (res.image_id) {
      currentSubject = res.image_id;
      document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
      
      // Enable sliders and reset to 0
      document.getElementById("sliderAmp").disabled = false;
      document.getElementById("sliderFreq").disabled = false;
      document.getElementById("sliderAlign").disabled = false;
      resetTriadSliders();

      logAudit("Your face is registered as UNVERIFIED VISITOR. Access Denied at baseline. Tune all 3 sliders to spoof the AI!", "denied");
      speakSecurityAnnouncement("Biometric scan acquired. Subject unauthorized. Access denied.");
      runAdversarialInference();
    }
  })
  .catch(err => {
    console.error("Failed to upload snapshot:", err);
    logAudit("Biometric upload error: " + err.message, "denied");
  });
}

// ── Target Subject Selection (ONLY CEO vs INTRUDER) ────────────────────────
function selectSubject(subjectId) {
  stopWebcamStream();
  currentSubject = subjectId;

  document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById(subjectId === "ceo" ? "btnCeo" : "btnHacker");
  if (btn) btn.classList.add("active");

  const subImg = document.getElementById("subjectImg");

  if (subjectId === "ceo") {
    // Disable sliders and set CEO baseline
    document.getElementById("sliderAmp").value = 100;
    document.getElementById("sliderFreq").value = 100;
    document.getElementById("sliderAlign").value = 100;
    document.getElementById("sliderAmp").disabled = true;
    document.getElementById("sliderFreq").disabled = true;
    document.getElementById("sliderAlign").disabled = true;
    if (subImg) subImg.src = "/static/img/ceo.jpg";
    logAudit("Target Identity: CEO MARCUS VANCE — Clearance Level 5 verified.", "granted");
    runAdversarialInference();
  } else {
    // Black-Hat Intruder
    document.getElementById("sliderAmp").disabled = false;
    document.getElementById("sliderFreq").disabled = false;
    document.getElementById("sliderAlign").disabled = false;
    resetTriadSliders();
    if (subImg) subImg.src = "/static/img/hacker.jpg";
    logAudit("Target Identity: BLACK-HAT INTRUDER — Baseline Threat 4 Access Denied.", "denied");
    runAdversarialInference();
  }
}

function handleFileUpload(e) {
  stopWebcamStream();
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Data = evt.target.result;
    
    fetch("/api/upload_image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Data })
    })
    .then(r => r.json())
    .then(res => {
      if (res.image_id) {
        currentSubject = res.image_id;
        document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
        document.getElementById("sliderAmp").disabled = false;
        document.getElementById("sliderFreq").disabled = false;
        document.getElementById("sliderAlign").disabled = false;
        resetTriadSliders();
        logAudit("Uploaded custom subject face photo", "info");
        runAdversarialInference();
      }
    });
  };
  reader.readAsDataURL(file);
}

// ── Execute Adversarial Inference API ──────────────────────────────────────
function runAdversarialInference() {
  fetch("/api/adversarial_step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_id: currentSubject,
      amplitude: triadAmp,
      frequency: triadFreq,
      alignment: triadAlign
    })
  })
  .then(r => r.json())
  .then(data => {
    updateDashboardUI(data);
  })
  .catch(err => {
    console.error("Adversarial step failed:", err);
  });
}

// ── Update Dashboard UI & Visual Feedback ──────────────────────────────────
function updateDashboardUI(data) {
  // Cache images for vision mode flipping
  cachedAdversarialImg = data.adversarial_image;
  cachedHeatmapImg = data.ai_heatmap;

  // 1. Update Viewport Image according to Vision Mode
  const subImg = document.getElementById("subjectImg");
  const noiseImg = document.getElementById("noiseMapImg");
  if (subImg) {
    subImg.src = (visionMode === "ai" && cachedHeatmapImg) ? cachedHeatmapImg : cachedAdversarialImg;
  }
  if (noiseImg && data.noise_map) {
    noiseImg.src = data.noise_map;
  }

  // 2. Metrics Readouts
  const l2 = document.getElementById("l2Val");
  const linf = document.getElementById("linfVal");
  if (l2) l2.textContent = data.l2_distortion.toFixed(4);
  if (linf) linf.textContent = data.linf_distortion.toFixed(4);

  // 3. Update Convergence Gauge from Backend
  updateConvergenceMeter(data.convergence);

  // 4. Update Confidence Spectrum (2 Classes: Intruder vs CEO)
  const pInt = data.probabilities.intruder;
  const pCeo = data.probabilities.ceo;

  const elPInt = document.getElementById("probIntruder");
  const elPCeo = document.getElementById("probCeo");
  if (elPInt) elPInt.textContent = `${pInt.toFixed(1)}%`;
  if (elPCeo) elPCeo.textContent = `${pCeo.toFixed(1)}%`;

  const fInt = document.getElementById("fillIntruder");
  const fCeo = document.getElementById("fillCeo");
  if (fInt) fInt.style.width = `${Math.min(100, Math.max(0, pInt))}%`;
  if (fCeo) fCeo.style.width = `${Math.min(100, Math.max(0, pCeo))}%`;

  // 5. Update CEO Similarity Vector
  const simVal = document.getElementById("targetSimVal");
  const simFill = document.getElementById("targetSimFill");
  if (simVal) simVal.textContent = `${data.target_similarity.toFixed(1)}% MATCH`;
  if (simFill) simFill.style.width = `${Math.min(100, Math.max(0, data.target_similarity))}%`;

  // 6. Laser Scan Beam & Holographic Stamp
  const laserBeam = document.getElementById("laserBeam");
  const stamp = document.getElementById("spoofStamp");

  // 7. Clearance Banner & Audio/Voice Reaction
  const banner = document.getElementById("clearanceBanner");
  const icon = document.getElementById("cbIcon");
  const title = document.getElementById("cbStatusTitle");
  const sub = document.getElementById("cbStatusSub");

  if (data.status === "ACCESS_GRANTED") {
    banner.className = "clearance-banner granted";
    icon.textContent = "✅";
    title.textContent = "ACCESS GRANTED";
    sub.textContent = "CLEARANCE LEVEL 5 // CEO BIOMETRIC SIGNATURE VERIFIED";
    
    if (laserBeam) {
      laserBeam.style.background = "linear-gradient(90deg, transparent, #00FF66, #00FF66, transparent)";
      laserBeam.style.boxShadow = "0 0 16px #00FF66, 0 0 25px #00FF66";
    }

    // Show Holographic Stamp only when spoofing intruder into CEO
    if (stamp) stamp.style.display = (currentSubject !== "ceo") ? "flex" : "none";

    if (previousStatus !== "ACCESS_GRANTED") {
      playSecuritySound("granted");
      logAudit(`SPOOF SUCCESS: AI classified subject as CEO (${pCeo}% confidence) // Triad Convergence: ${data.convergence}%`, "granted");
      if (lastSpokenStatus !== "GRANTED") {
        speakSecurityAnnouncement("Access granted. Welcome back, Chief Executive.");
        lastSpokenStatus = "GRANTED";
      }
    }
    previousStatus = "ACCESS_GRANTED";

  } else if (data.status === "ACCESS_DENIED") {
    banner.className = "clearance-banner denied";
    icon.textContent = "🛑";
    title.textContent = "ACCESS DENIED";
    sub.textContent = "THREAT LEVEL 4: UNREGISTERED INTRUDER";

    if (laserBeam) {
      laserBeam.style.background = "linear-gradient(90deg, transparent, #D81E24, #00F0FF, transparent)";
      laserBeam.style.boxShadow = "0 0 12px #D81E24";
    }
    if (stamp) stamp.style.display = "none";

    if (previousStatus !== "ACCESS_DENIED") {
      playSecuritySound("denied");
      logAudit(`CLEARANCE DENIED: Detected as Intruder (${pInt}%) // Triad Convergence: ${data.convergence}%`, "denied");
      if (lastSpokenStatus !== "DENIED") {
        speakSecurityAnnouncement("Access denied.");
        lastSpokenStatus = "DENIED";
      }
    }
    previousStatus = "ACCESS_DENIED";

  } else {
    // UNCERTAIN / EQUILIBRIUM
    banner.className = "clearance-banner";
    banner.style.background = "rgba(255, 215, 0, 0.12)";
    banner.style.border = "2px solid #FFD700";
    banner.style.boxShadow = "0 0 25px rgba(255,215,0,0.3)";
    icon.textContent = "⚠️";
    title.textContent = "ANALYZING BIOMETRICS";
    title.style.color = "#FFD700";
    sub.textContent = data.status_message || "NEURAL EQUILIBRIUM: TUNING IN PROGRESS...";

    if (laserBeam) {
      laserBeam.style.background = "linear-gradient(90deg, transparent, #FFD700, #FFD700, transparent)";
      laserBeam.style.boxShadow = "0 0 15px #FFD700";
    }
    if (stamp) stamp.style.display = "none";
    previousStatus = "UNCERTAIN";
  }
}

// ── Topbar Clock & Initializer ─────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const el = document.getElementById("clockDisplay");
  if (el) el.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(updateClock, 1000);
  updateClock();

  logAudit("Station 03 // GHOST-IN-THE-LENS Triad Engine Initialized", "info");
  logAudit("Biometric AI Checkpoint: Ready for Intruder / CEO Spoof", "info");

  // Run initial baseline
  runAdversarialInference();
});
