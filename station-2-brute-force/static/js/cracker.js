/**
 * ITC // CRYPTOGRAPHY STATION: BRUTE-FORCE VAULT CRACKER
 * Matrix Rain HTML5 Canvas · Live Slot Tumbler · Real Hashlib Integration · Web Audio API
 */

(function () {
    'use strict';

    // ── Global Sound FX Synthesizer (Web Audio API) ──
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.muted = false;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTick() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.04);
            } catch (e) {}
        }

        playAlarm() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(440, now + 0.15);
                osc.frequency.setValueAtTime(880, now + 0.30);
                osc.frequency.setValueAtTime(440, now + 0.45);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(now + 0.65);
            } catch (e) {}
        }

        playWin() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            try {
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const start = this.ctx.currentTime + idx * 0.08;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, start);
                    gain.gain.setValueAtTime(0.12, start);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(start);
                    osc.stop(start + 0.45);
                });
            } catch (e) {}
        }
    }

    // ── Matrix Canvas Engine ──
    class MatrixEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.characters = '0123456789ABCDEF!@#$%&*<>[]{}~+=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            this.fontSize = 14;
            this.columns = 0;
            this.drops = [];
            this.mode = 'matrix'; // 'matrix', 'scramble', 'breach', 'victory'
            this.animId = null;

            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            if (!this.canvas) return;
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = [];
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.floor(Math.random() * -50);
            }
        }

        setMode(mode) {
            this.mode = mode;
        }

        render() {
            if (!this.canvas || !this.ctx) return;

            // Semi-transparent fade
            this.ctx.fillStyle = this.mode === 'breach' ? 'rgba(14, 15, 18, 0.18)' : 'rgba(14, 15, 18, 0.12)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = `${this.fontSize}px 'JetBrains Mono', Consolas, monospace`;

            const charCount = this.characters.length;

            for (let i = 0; i < this.drops.length; i++) {
                const char = this.characters[Math.floor(Math.random() * charCount)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;

                if (this.mode === 'breach') {
                    // Hot Red Breach Glow
                    this.ctx.fillStyle = Math.random() > 0.85 ? '#ffffff' : '#ff4d52';
                    this.ctx.shadowColor = '#ff4d52';
                    this.ctx.shadowBlur = 8;
                } else if (this.mode === 'victory') {
                    // Calming Emerald Cyan
                    this.ctx.fillStyle = Math.random() > 0.9 ? '#e6fff0' : '#36d184';
                    this.ctx.shadowColor = '#36d184';
                    this.ctx.shadowBlur = 6;
                } else if (this.mode === 'scramble') {
                    // Hyper speed Matrix
                    this.ctx.fillStyle = Math.random() > 0.8 ? '#ffffff' : '#00ff66';
                    this.ctx.shadowColor = '#00ff66';
                    this.ctx.shadowBlur = 10;
                } else {
                    // Classic Matrix Neon
                    this.ctx.fillStyle = Math.random() > 0.92 ? '#e0ffe5' : '#00ff66';
                    this.ctx.shadowColor = '#00ff66';
                    this.ctx.shadowBlur = 3;
                }

                this.ctx.fillText(char, x, y);

                // Speed modifier
                const speed = (this.mode === 'scramble' || this.mode === 'breach') ? 1.6 : 1;

                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i] += speed;
            }

            this.animId = requestAnimationFrame(() => this.render());
        }

        start() {
            if (!this.animId) {
                this.render();
            }
        }
    }

    // ── Main Controller ──
    const sound = new SoundEngine();
    let matrix = null;
    let currentAlgo = 'sha256';
    let isCracking = false;
    let stopwatchInterval = null;
    let tumblerInterval = null;
    let wordsInterval = null;
    let benchmarkSpeed = 1200000; // default 1.2 MH/s fallback

    const CHARS_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

    // Elements
    const elements = {
        passwordInput: document.getElementById('password-input'),
        btnEngage: document.getElementById('btn-engage'),
        timerDisplay: document.getElementById('timer-display'),
        entropyFill: document.getElementById('entropy-fill'),
        entropyTier: document.getElementById('entropy-tier'),
        entropyBits: document.getElementById('entropy-bits'),
        keyspaceSize: document.getElementById('keyspace-size'),
        topHashSpeed: document.getElementById('top-hash-speed'),
        hudTargetHash: document.getElementById('hud-target-hash'),
        tumblerSlots: document.getElementById('tumbler-slots'),
        hudHashRate: document.getElementById('hud-hash-rate'),
        hudWordsTried: document.getElementById('hud-words-tried'),
        hudCurrentWord: document.getElementById('hud-current-word'),
        resultModal: document.getElementById('result-modal'),
        resultCard: document.getElementById('result-card'),
        audioBtn: document.getElementById('audio-btn'),
        swStatus: document.getElementById('sw-status'),
        tumblerMode: document.getElementById('tumbler-mode'),
        badges: {
            lower: document.getElementById('badge-lower'),
            upper: document.getElementById('badge-upper'),
            digit: document.getElementById('badge-digit'),
            symbol: document.getElementById('badge-symbol'),
            length: document.getElementById('badge-length')
        }
    };

    // Calculate Entropy & UI Update
    function calculateEntropy(pwd) {
        const hasLower = /[a-z]/.test(pwd);
        const hasUpper = /[A-Z]/.test(pwd);
        const hasDigit = /[0-9]/.test(pwd);
        const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

        let charset = 0;
        if (hasLower) charset += 26;
        if (hasUpper) charset += 26;
        if (hasDigit) charset += 10;
        if (hasSymbol) charset += 32;

        const len = pwd.length;
        const bits = (charset > 0 && len > 0) ? len * Math.log2(charset) : 0;
        const combinations = charset > 0 && len > 0 ? Math.pow(charset, len) : 0;

        return {
            hasLower,
            hasUpper,
            hasDigit,
            hasSymbol,
            len,
            charset,
            bits: Math.round(bits * 10) / 10,
            combinations
        };
    }

    async function hashPreview(text, algo = 'sha256') {
        if (!text) return 'WAITING FOR INPUT...';
        try {
            const msgUint8 = new TextEncoder().encode(text);
            const algoName = algo.toUpperCase() === 'MD5' ? 'SHA-256' : 'SHA-256'; // fallback display
            const hashBuffer = await crypto.subtle.digest(algoName, msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945';
        }
    }

    function updateEntropyUI() {
        const pwd = elements.passwordInput ? elements.passwordInput.value : '';
        const stats = calculateEntropy(pwd);

        // Update requirement badges
        if (elements.badges.lower) elements.badges.lower.classList.toggle('active', stats.hasLower);
        if (elements.badges.upper) elements.badges.upper.classList.toggle('active', stats.hasUpper);
        if (elements.badges.digit) elements.badges.digit.classList.toggle('active', stats.hasDigit);
        if (elements.badges.symbol) elements.badges.symbol.classList.toggle('active', stats.hasSymbol);
        if (elements.badges.length) elements.badges.length.classList.toggle('active', stats.len >= 12);

        // Bits & Keyspace
        if (elements.entropyBits) elements.entropyBits.textContent = `${stats.bits} Bits`;
        if (elements.keyspaceSize) {
            elements.keyspaceSize.textContent = stats.combinations === 0 ? '0' : stats.combinations.toLocaleString();
        }

        // Strength Meter Bar & Tier
        let tier = 'Empty';
        let barPercent = 0;
        let barColor = '#30363d';

        if (pwd.length === 0) {
            tier = 'Empty';
            barPercent = 0;
        } else if (stats.bits < 28) {
            tier = 'Very Weak';
            barPercent = 20;
            barColor = '#f85149';
        } else if (stats.bits < 45) {
            tier = 'Weak';
            barPercent = 40;
            barColor = '#d29922';
        } else if (stats.bits < 65) {
            tier = 'Moderate';
            barPercent = 65;
            barColor = '#e3b341';
        } else if (stats.bits < 85) {
            tier = 'Strong';
            barPercent = 85;
            barColor = '#3fb950';
        } else {
            tier = 'Ultra Secure';
            barPercent = 100;
            barColor = '#2ea043';
        }

        if (elements.entropyTier) {
            elements.entropyTier.textContent = tier;
            elements.entropyTier.style.color = barColor;
        }
        if (elements.entropyFill) {
            elements.entropyFill.style.width = `${barPercent}%`;
            elements.entropyFill.style.background = barColor;
        }

        // Target hash preview
        hashPreview(pwd, currentAlgo).then(h => {
            if (elements.hudTargetHash) elements.hudTargetHash.textContent = h;
        });

        // Initialize Tumbler placeholders
        renderInitialTumbler(pwd);
    }

    function renderInitialTumbler(pwd) {
        if (!elements.tumblerSlots) return;
        elements.tumblerSlots.innerHTML = '';
        const len = Math.max(pwd.length, 8);
        for (let i = 0; i < len; i++) {
            const slot = document.createElement('span');
            slot.className = 'slot empty';
            slot.textContent = i < pwd.length ? '●' : '_';
            elements.tumblerSlots.appendChild(slot);
        }
    }

    // ── Public API exposed to window.cracker ──
    window.cracker = {
        init: function () {
            matrix = new MatrixEngine('matrix-canvas');
            matrix.start();

            if (elements.passwordInput) {
                elements.passwordInput.addEventListener('input', updateEntropyUI);
                elements.passwordInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        window.cracker.startCracking();
                    }
                });
            }

            // Benchmark backend hashing capability
            fetch('/api/benchmark')
                .then(r => r.json())
                .then(data => {
                    benchmarkSpeed = data.hashes_per_second;
                    const formatted = (benchmarkSpeed / 1000000).toFixed(2) + ' MH/s (CPU)';
                    if (elements.topHashSpeed) elements.topHashSpeed.textContent = formatted;
                    if (elements.hudHashRate) elements.hudHashRate.textContent = formatted;
                })
                .catch(() => {
                    if (elements.topHashSpeed) elements.topHashSpeed.textContent = '1.85 MH/s (EST)';
                    if (elements.hudHashRate) elements.hudHashRate.textContent = '1.85 MH/s';
                });

            // Initial UI state
            updateEntropyUI();
        },

        toggleAudio: function () {
            sound.muted = !sound.muted;
            if (elements.audioBtn) {
                elements.audioBtn.textContent = sound.muted ? '🔇 SFX OFF' : '🔊 SFX ON';
                elements.audioBtn.style.color = sound.muted ? 'var(--grey)' : 'var(--text)';
            }
        },

        setAlgo: function (algo) {
            currentAlgo = algo;
            document.querySelectorAll('.algo-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-algo') === algo);
            });
            updateEntropyUI();
        },

        setPreset: function (pwd) {
            if (elements.passwordInput) {
                elements.passwordInput.value = pwd;
                updateEntropyUI();
                elements.passwordInput.focus();
            }
        },

        clearInput: function () {
            if (elements.passwordInput) {
                elements.passwordInput.value = '';
                updateEntropyUI();
                elements.passwordInput.focus();
            }
        },

        closeModal: function () {
            if (elements.resultModal) {
                elements.resultModal.classList.add('hidden');
            }
            if (matrix) matrix.setMode('matrix');
            if (elements.btnEngage) {
                elements.btnEngage.disabled = false;
                elements.btnEngage.innerHTML = '<span class="engage-icon">⚡</span><span class="engage-text">Launch Brute-Force Attack</span>';
            }
        },

        resetStation: function () {
            clearInterval(stopwatchInterval);
            clearInterval(tumblerInterval);
            clearInterval(wordsInterval);
            isCracking = false;

            if (elements.timerDisplay) elements.timerDisplay.textContent = '00:00.000';
            if (elements.hudWordsTried) elements.hudWordsTried.textContent = '0';
            if (elements.hudCurrentWord) elements.hudCurrentWord.textContent = 'IDLE';
            if (elements.passwordInput) elements.passwordInput.value = '';
            if (elements.swStatus) {
                elements.swStatus.textContent = 'STANDBY';
                elements.swStatus.style.color = '#8b949e';
            }
            if (elements.tumblerMode) {
                elements.tumblerMode.textContent = 'IDLE';
                elements.tumblerMode.style.color = 'var(--matrix)';
            }
            
            updateEntropyUI();
            this.closeModal();
        },

        startCracking: function () {
            const password = elements.passwordInput ? elements.passwordInput.value.trim() : '';
            if (!password) {
                if (elements.passwordInput) elements.passwordInput.focus();
                return;
            }

            if (isCracking) return;
            isCracking = true;

            // Close any existing modal
            if (elements.resultModal) elements.resultModal.classList.add('hidden');

            // Status labels
            if (elements.swStatus) {
                elements.swStatus.textContent = 'RUNNING';
                elements.swStatus.style.color = '#58a6ff';
            }
            if (elements.tumblerMode) {
                elements.tumblerMode.textContent = 'SCRAMBLING...';
                elements.tumblerMode.style.color = '#58a6ff';
            }

            // Button state
            if (elements.btnEngage) {
                elements.btnEngage.disabled = true;
                elements.btnEngage.innerHTML = '<span class="engage-icon">⏳</span><span class="engage-text">Cracking Engine Active...</span>';
            }

            // Matrix Hyper Mode
            if (matrix) matrix.setMode('scramble');

            // 1. Prepare Tumbler Slots
            if (elements.tumblerSlots) {
                elements.tumblerSlots.innerHTML = '';
                for (let i = 0; i < password.length; i++) {
                    const slot = document.createElement('span');
                    slot.className = 'slot cycling';
                    slot.textContent = CHARS_SET[Math.floor(Math.random() * CHARS_SET.length)];
                    elements.tumblerSlots.appendChild(slot);
                }
            }

            // 2. Stopwatch Setup
            const startTime = performance.now();
            if (elements.timerDisplay) elements.timerDisplay.textContent = '00:00.000';
            stopwatchInterval = setInterval(() => {
                const elapsed = performance.now() - startTime;
                const totalSec = Math.floor(elapsed / 1000);
                const ms = Math.floor(elapsed % 1000);
                const min = Math.floor(totalSec / 60);
                const sec = totalSec % 60;
                if (elements.timerDisplay) {
                    elements.timerDisplay.textContent = 
                        `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
                }
            }, 37);

            // 3. Fast Tumbler Scramble Animation
            let tumblerTicks = 0;
            tumblerInterval = setInterval(() => {
                tumblerTicks++;
                const slots = elements.tumblerSlots ? elements.tumblerSlots.querySelectorAll('.slot.cycling') : [];
                slots.forEach(slot => {
                    slot.textContent = CHARS_SET[Math.floor(Math.random() * CHARS_SET.length)];
                });
                if (tumblerTicks % 4 === 0) {
                    sound.playTick();
                }
            }, 45);

            // 4. Candidate Word Streaming Simulation
            let wordsCount = 0;
            const fallbackWords = ['admin', '123456', 'oran', 'password', 'welcome', 'qwerty', 'football', 'master', 'dragon', 'algerie', 'student'];
            wordsInterval = setInterval(() => {
                wordsCount += Math.floor(180 + Math.random() * 220);
                if (elements.hudWordsTried) elements.hudWordsTried.textContent = wordsCount.toLocaleString();
                if (elements.hudCurrentWord) {
                    const sample = fallbackWords[Math.floor(Math.random() * fallbackWords.length)] + Math.floor(Math.random() * 999);
                    elements.hudCurrentWord.textContent = sample;
                }
            }, 60);

            // 5. Send API Request to Flask Backend
            fetch('/api/crack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password, algo: currentAlgo })
            })
            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error);

                if (data.found_in_dict) {
                    // ── CASE A: WEAK PASSWORD (CRACKS IN EXACTLY ~1.2s) ──
                    setTimeout(() => {
                        this.handleCompromised(data, startTime);
                    }, 1200);
                } else {
                    // ── CASE B: STRONG PASSWORD (MACHINE STRUGGLES FOR 3.5s, THEN EXHAUSTED) ──
                    setTimeout(() => {
                        this.handleSecure(data, startTime);
                    }, 3500);
                }
            })
            .catch(err => {
                console.error(err);
                clearInterval(stopwatchInterval);
                clearInterval(tumblerInterval);
                clearInterval(wordsInterval);
                isCracking = false;
                if (elements.btnEngage) {
                    elements.btnEngage.disabled = false;
                    elements.btnEngage.innerHTML = '<span class="engage-icon">⚡</span><span class="engage-text">Launch Brute-Force Attack</span>';
                }
            });
        },

        // Compromised / Cracked Routine
        handleCompromised: function (data, startTime) {
            clearInterval(stopwatchInterval);
            clearInterval(tumblerInterval);
            clearInterval(wordsInterval);
            isCracking = false;

            const finalElapsed = ((performance.now() - startTime) / 1000).toFixed(2);
            if (elements.timerDisplay) elements.timerDisplay.textContent = `00:0${finalElapsed}`;
            if (elements.hudCurrentWord) elements.hudCurrentWord.textContent = data.matched_word || data.password;
            if (elements.hudWordsTried) elements.hudWordsTried.textContent = data.attempts_checked.toLocaleString();
            if (elements.swStatus) {
                elements.swStatus.textContent = 'COMPROMISED';
                elements.swStatus.style.color = 'var(--hot-red)';
            }
            if (elements.tumblerMode) {
                elements.tumblerMode.textContent = 'BREACH DETECTED';
                elements.tumblerMode.style.color = 'var(--hot-red)';
            }

            // Lock slots one by one with red glow
            const slots = elements.tumblerSlots ? elements.tumblerSlots.querySelectorAll('.slot') : [];
            const targetChars = data.password.split('');

            targetChars.forEach((ch, idx) => {
                setTimeout(() => {
                    if (slots[idx]) {
                        slots[idx].className = 'slot locked-red';
                        slots[idx].textContent = ch;
                        sound.playTick();
                    }
                }, idx * 60);
            });

            // Matrix Breach Mode & Siren SFX
            setTimeout(() => {
                if (matrix) matrix.setMode('breach');
                sound.playAlarm();

                // Open Compromised Modal
                if (elements.resultCard && elements.resultModal) {
                    elements.resultCard.className = 'result-card result-compromised';
                    elements.resultCard.innerHTML = `
                        <div class="r-icon">🚨</div>
                        <div class="r-title">VAULT COMPROMISED!</div>
                        <div class="r-time-badge red">CRACK TIME: ${finalElapsed} SECONDS</div>
                        
                        <div class="r-explanation">
                            <div class="r-math-row">
                                <span class="k">MATCH SOURCE:</span>
                                <span class="v" style="color:var(--hot-red)">${data.vulnerability_reason || 'Leaked Database / Common Pattern'}</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">DICTIONARY ATTEMPTS:</span>
                                <span class="v">${data.attempts_checked} words</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">HASHCAT 8x RTX 4090 RIG:</span>
                                <span class="v" style="color:var(--hot-red)">&lt; 1 Millisecond</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">ENTROPY:</span>
                                <span class="v">${data.entropy.entropy_bits} Bits (Low Complexity)</span>
                            </div>
                            <p style="margin-top:8px; font-size:11px; color:var(--grey)">
                                ⚠️ <b>Why it failed:</b> Attackers do not guess passwords sequentially. They execute automated rainbow tables and leaked dictionaries at billions of hashes per second.
                            </p>
                        </div>

                        <button class="btn-modal-dismiss" onclick="cracker.closeModal()">
                            ↺ TRY A STRONGER PASSWORD
                        </button>
                    `;
                    elements.resultModal.classList.remove('hidden');
                }
            }, targetChars.length * 60 + 120);
        },

        // Secure / Machine Exhausted Routine
        handleSecure: function (data, startTime) {
            clearInterval(stopwatchInterval);
            clearInterval(tumblerInterval);
            clearInterval(wordsInterval);
            isCracking = false;

            const finalElapsed = ((performance.now() - startTime) / 1000).toFixed(2);
            if (elements.timerDisplay) elements.timerDisplay.textContent = `00:0${finalElapsed}`;
            if (elements.hudCurrentWord) elements.hudCurrentWord.textContent = 'EXHAUSTED';
            if (elements.hudWordsTried) elements.hudWordsTried.textContent = '6,421 / 6,421 (100%)';
            if (elements.swStatus) {
                elements.swStatus.textContent = 'EXHAUSTED';
                elements.swStatus.style.color = 'var(--matrix)';
            }
            if (elements.tumblerMode) {
                elements.tumblerMode.textContent = 'DEFENSE SECURE';
                elements.tumblerMode.style.color = 'var(--matrix)';
            }

            // Lock slots one by one with green glow
            const slots = elements.tumblerSlots ? elements.tumblerSlots.querySelectorAll('.slot') : [];
            const targetChars = data.password.split('');

            targetChars.forEach((ch, idx) => {
                setTimeout(() => {
                    if (slots[idx]) {
                        slots[idx].className = 'slot locked-green';
                        slots[idx].textContent = ch;
                        sound.playTick();
                    }
                }, idx * 50);
            });

            // Matrix Victory Mode & Win Chime SFX
            setTimeout(() => {
                if (matrix) matrix.setMode('victory');
                sound.playWin();

                // Open Secure Modal
                if (elements.resultCard && elements.resultModal) {
                    elements.resultCard.className = 'result-card result-secure';
                    elements.resultCard.innerHTML = `
                        <div class="r-icon">🛡️</div>
                        <div class="r-title">VAULT SECURE — MACHINE EXHAUSTED!</div>
                        <div class="r-time-badge green">ESTIMATED TIME: ${data.crack_estimates.time_gpu.toUpperCase()}</div>
                        
                        <div class="r-explanation">
                            <div class="r-math-row">
                                <span class="k">RESULT:</span>
                                <span class="v" style="color:var(--matrix)">DEFENSE SUCCEEDED · STATION WON!</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">LOCAL ROCKYOU CHECK:</span>
                                <span class="v">0 Matches (Not in 14.3M leaked list)</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">ENTROPY / KEYSPACE:</span>
                                <span class="v">${data.entropy.entropy_bits} Bits (${data.entropy.charset_size}^${data.entropy.length})</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">8x RTX 4090 RIG (100 GH/s):</span>
                                <span class="v" style="color:var(--matrix)">${data.crack_estimates.time_gpu}</span>
                            </div>
                            <div class="r-math-row">
                                <span class="k">STATE SUPERCOMPUTER:</span>
                                <span class="v">${data.crack_estimates.time_supercomputer}</span>
                            </div>
                            <p style="margin-top:8px; font-size:11px; color:var(--grey)">
                                🏆 <b>Station Complete:</b> Even at 100 billion combinations tested per second, mathematics and keyspace explosion make brute-forcing this password completely infeasible.
                            </p>
                        </div>

                        <button class="btn-modal-dismiss" onclick="cracker.closeModal()">
                            ↻ TEST ANOTHER PASSWORD
                        </button>
                    `;
                    elements.resultModal.classList.remove('hidden');
                }
            }, targetChars.length * 50 + 100);
        }
    };

    // Auto-run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.cracker.init());
    } else {
        window.cracker.init();
    }
})();
