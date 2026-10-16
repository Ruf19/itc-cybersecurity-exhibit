# 🛡️ ITC // Interactive Cybersecurity Exhibition

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/framework-Flask-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Design](https://img.shields.io/badge/ITC%20Design%20System-V2.5-red.svg)](#)

A high-impact, dual-station interactive cybersecurity exhibition platform built for live university showcases, hackathons, and security awareness demos.

---

## 🏛️ Exhibition Stations Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ITC CYBERSECURITY EXHIBITION RIG                     │
├───────────────────────────────────┬────────────────────────────────────┤
│  STATION 1: BREACH TRAIL          │  STATION 2: BRUTE-FORCE CRACKER   │
│  Port 5000                        │  Port 5001                         │
│  ───────────────────────────────  │  ────────────────────────────────  │
│  • WAN & Subnet Vast Topology     │  • Real-Time Matrix Rain Stream    │
│  • Interactive Attack Breachers   │  • 3D Candidate Slot Tumbler       │
│  • Multi-Stage Attack Chains      │  • Leaked RockYou Dictionary Check │
│  • Live SOC Terminal Log Feed     │  • Synthesized Web Audio FX        │
│  • Defense Mitigation Toggles     │  • Information Entropy Math        │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

### 🌐 Station 1 // Breach Trail: Network Topology Threat Simulator
**URL:** `http://localhost:5000`

An enterprise network topology with an interactive Red Team / Blue Team operations console:
- **Vast Multi-Subnet Architecture:** External WAN Breacher, Firewall DMZ, Enterprise LAN, Database Core, and Supervisory SCADA subnet.
- **Offensive Attack Engine:**
  - `DDoS Flooding` (SYN Flood attacking DMZ Web Server)
  - `SQL Injection` (Bypassing auth to compromise DB-01)
  - `Lateral Movement` (Pivot from Workstation to Active Directory DC-01)
  - `Ransomware Infiltration` (Encrypted payload execution on Finance file share)
  - `Chain Attack: Full Breacher Infiltration` (Coordinated multi-vector campaign from external WAN to SCADA core)
- **Defensive SOC Controls:** Interactive click-on / click-off mitigation controls (Port Isolation, WAF Rate Limiting, Active Threat Null-Routing).
- **Live Terminal Telemetry:** Real-time SIEM event logs streaming attack signatures and defensive triggers.

---

### 🔐 Station 2 // Cryptography: "BRUTE-FORCE" Visual Password Cracker
**URL:** `http://localhost:5001`

A gamified arcade-style race against the machine demonstrating why password complexity and entropy matter:
- **The Concept:** *"A hacker doesn't guess your password; they have a machine read the entire dictionary to the lock at a million words per second."*
- **Split-Screen Cyber Interface:**
  - **Left (Vault Access):** Clean, uncluttered password input, live 4px information entropy bar ($E = L \times \log_2 R$), requirement pills (`a-z`, `A-Z`, `0-9`, `!@#`, `12+`), preset chips (`qwerty`, `oran2026`, `P@ssw0rd2026!`, `Correct-Horse...`, `kX9#m$L2!vQ8@`), and live mission stopwatch.
  - **Right (Matrix Cracking Cascade):** 60 FPS HTML5 Canvas Matrix rain stream, 3D candidate slot tumbler unscrambler, and hardware telemetry HUD.
- **Two Dynamic Outcomes:**
  - **Weak Password (e.g., `oran2026`, `qwerty`):** Machine locks onto target in **~1.2 seconds**, slots turn glowing red (`.locked-red`), alarm siren blares, and displays exact RockYou leak rank.
  - **High-Entropy Password (e.g., `kX9#m$L2!vQ8@`):** Machine scrambles frantically for 3.5s before exhausting the wordlist, slots turn emerald green (`.locked-green`), victory chime plays, and displays hardware estimate (`ESTIMATED TIME: 400 YEARS ON 8x RTX 4090 RIG`).

---

## ⚡ Quickstart Guide

### 🪟 Windows (1-Click Run)
Simply double-click the included batch file:
```cmd
START_BOTH_STATIONS.bat
```
*Automatically installs requirements, spins up both Flask servers in separate terminals, and opens both stations in your default browser.*

To stop both stations cleanly:
```cmd
STOP_ALL_STATIONS.bat
```

---

### 🐧 Linux / 🍎 macOS
Make the script executable and run:
```bash
chmod +x start_both_stations.sh
./start_both_stations.sh
```

---

### 🛠️ Manual Launch (Step-by-Step)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/itc-cybersecurity-exhibit.git
   cd itc-cybersecurity-exhibit
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Station 1 (Port 5000):**
   ```bash
   cd station-1-breach-trail
   python app.py
   ```

4. **Run Station 2 (Port 5001):**
   ```bash
   cd station-2-brute-force
   python app.py
   ```

5. Open your browser:
   - Station 1: [http://localhost:5000](http://localhost:5000)
   - Station 2: [http://localhost:5001](http://localhost:5001)

---

## 📂 Repository Structure

```
itc-cybersecurity-exhibit/
├── station-1-breach-trail/        # Station 1: Network Topology Threat Simulator
│   ├── static/
│   │   ├── css/style.css          # Topology Canvas & SOC styling
│   │   ├── js/topology.js         # Interactive nodes, attack animations, log stream
│   │   └── img/itc-logo.png       # High-res ITC logo
│   ├── templates/index.html       # Full-screen topology interface
│   ├── app.py                     # Flask server (Port 5000)
│   └── run.bat
├── station-2-brute-force/         # Station 2: Brute-Force Password Cracker
│   ├── data/
│   │   └── rockyou_mini.txt       # Curated 6,421 leaked dictionary passwords
│   ├── static/
│   │   ├── css/style.css          # Matrix canvas, 3D tumbler reels, sleek vault UI
│   │   ├── js/cracker.js          # Matrix engine, Web Audio API, entropy math
│   │   └── img/itc-logo.png       # High-res ITC logo
│   ├── templates/index.html       # Clean split-screen interface
│   ├── app.py                     # Flask server + hashlib API (Port 5001)
│   └── run.bat
├── START_BOTH_STATIONS.bat        # Windows 1-click dual launcher
├── STOP_ALL_STATIONS.bat         # Windows 1-click dual shutdown
├── start_both_stations.sh         # Linux/macOS launcher
├── requirements.txt               # Python dependencies
├── .gitignore
└── README.md                      # Comprehensive documentation
```

---

## 🔒 Security Notice
This project is designed solely for **educational demonstrations, university exhibitions, and security awareness**. The dictionary attack engine runs safely and locally in memory against simulated vault targets.

---

## 📜 License
Distributed under the MIT License. Built for ITC Cybersecurity Showcase.
