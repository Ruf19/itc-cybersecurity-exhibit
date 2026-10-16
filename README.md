# 🛡️ ITC // Interactive Cybersecurity Exhibition (3-Station Platform)

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/framework-Flask-black.svg)](https://flask.palletsprojects.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)](https://pytorch.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Design](https://img.shields.io/badge/ITC%20Design%20System-V2.5-red.svg)](#)

A high-impact, three-station interactive cybersecurity exhibition platform built for live university showcases, hackathons, and security awareness demonstrations.

---

## 🏛️ Exhibition Stations Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           ITC CYBERSECURITY EXHIBITION RIG                              │
├────────────────────────────┬────────────────────────────┬───────────────────────────────┤
│  STATION 1: BREACH TRAIL   │  STATION 2: BRUTE-FORCE    │  STATION 3: GHOST-IN-THE-LENS │
│  Port 5000                 │  Port 5001                 │  Port 5003                    │
│  ────────────────────────  │  ────────────────────────  │  ───────────────────────────  │
│  • WAN & Subnet Topology   │  • Matrix Rain Stream      │  • Live Webcam Face Scan      │
│  • Red/Blue Team Controls  │  • 3D Candidate Tumbler    │  • PyTorch Biometric CNN      │
│  • Multi-Stage Chains      │  • RockYou Leaked Rank     │  • Triad FGSM Attack Engine   │
│  • SIEM Terminal Feed      │  • Entropy Mathematics     │  • AI Vision Heatmap Switcher │
└────────────────────────────┴────────────────────────────┴───────────────────────────────┘
```

---

### 🌐 Station 1 // Breach Trail: Network Topology Threat Simulator
**URL:** `http://localhost:5000`

An enterprise network topology with an interactive Red Team / Blue Team operations console:
- **Multi-Subnet Architecture:** External WAN Breacher, Firewall DMZ, Enterprise LAN, Database Core, and Supervisory SCADA subnet.
- **Offensive Attack Engine:** DDoS Flooding, SQL Injection, Lateral Movement, Ransomware Infiltration, and Full Multi-Vector Chain Attack.
- **Defensive SOC Controls:** Interactive click-on / click-off mitigation controls (Port Isolation, WAF Rate Limiting, Active Threat Null-Routing).
- **Live Terminal Telemetry:** Real-time SIEM event logs streaming attack signatures.

---

### 🔐 Station 2 // Cryptography: "BRUTE-FORCE" Visual Password Cracker
**URL:** `http://localhost:5001`

A gamified arcade-style race against the machine demonstrating why password complexity and entropy matter:
- **The Concept:** *"A hacker doesn't guess your password; they have a machine read the entire dictionary to the lock at a million words per second."*
- **Split-Screen Interface:** Live Information Entropy Bar ($E = L \times \log_2 R$), preset chips, 60 FPS HTML5 Canvas Matrix rain stream, and 3D candidate slot tumbler unscrambler.
- **Two Dynamic Outcomes:**
  - **Weak Password:** Cracked in ~1.2s, slots turn glowing red, leak rank displayed.
  - **High-Entropy Password:** Machine exhausts wordlist in 3.5s, slots turn emerald green, victory chime plays, hardware estimate displayed (`400 YEARS ON 8x RTX 4090 RIG`).

---

### 👁️ Station 3 // Biometrics: GHOST-IN-THE-LENS (Adversarial Biometrics)
**URL:** `http://localhost:5003`

A live demonstration of how AI facial recognition models can be deceived using invisible mathematical noise (**Adversarial Machine Learning**):
- **The Analogy:** *"We are giving the AI digital cataracts. To us, the picture looks identical. To the AI's math, every single pixel was nudged to forge the CEO's biometric key."*
- **Live Laptop Webcam Capture:** Visitors can scan their own face with real-time biometric mesh contours and landmark reticles.
- **Baseline Security (Access Denied):** Unregistered visitors are classified as **UNAUTHORIZED INTRUDER (Threat Level 4)**.
- **Triad Attack Engine:** Visitors must tune **all 3 attack vectors** together to spoof the model:
  1. *Perturbation Amplitude ($\epsilon$)*
  2. *Spatial Frequency Dispersion ($\sigma$)*
  3. *CEO Target Manifold Alignment ($\theta$)*
- **Interactive Vision Switcher:** Toggle between **Human Perception** (zero noticeable change) and **AI Neural Heatmap** (convolutional layer activation overlay).
- **Robotic Voice & Holographic Stamp:** Audio announcements and glowing green `[IDENTITY OVERRIDE // CEO GRANTED]` watermark stamp.

---

## ⚡ Quickstart Guide

### 🪟 Windows (1-Click Run)
Double-click:
```cmd
START_ALL_STATIONS.bat
```
*Automatically spins up all 3 Flask servers on Ports 5000, 5001, and 5003.*

To stop all stations cleanly:
```cmd
STOP_ALL_STATIONS.bat
```

---

### 🛠️ Manual Launch
```bash
# Install dependencies
pip install -r requirements.txt

# Station 1 (Port 5000)
cd station-1-breach-trail && python app.py

# Station 2 (Port 5001)
cd station-2-brute-force && python app.py

# Station 3 (Port 5003)
cd station-3-ghost-in-the-lens && python app.py
```

---

## 🔒 Security Notice
This platform is developed strictly for **educational demonstrations, university exhibitions, and security awareness**.

---

## 📜 License
Distributed under the MIT License. Built for ITC Cybersecurity Showcase.
