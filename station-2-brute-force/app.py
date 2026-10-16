"""
ITC // CRYPTOGRAPHY STATION: BRUTE-FORCE VAULT CRACKER
Real Dictionary Attack + Hashlib Engine + Password Entropy Breakdown
"""
from flask import Flask, render_template, jsonify, request
import hashlib
import time
import math
import os

app = Flask(__name__)

# Load localized RockYou miniature dictionary
WORDLIST_PATH = os.path.join(os.path.dirname(__file__), "data", "rockyou_mini.txt")
DICTIONARY = []
if os.path.exists(WORDLIST_PATH):
    with open(WORDLIST_PATH, "r", encoding="utf-8", errors="ignore") as f:
        DICTIONARY = [line.strip() for line in f if line.strip()]
print(f"[*] Loaded {len(DICTIONARY)} leaked passwords into memory.")

def compute_entropy(password):
    """Calculate keyspace and information entropy in bits"""
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(not c.isalnum() for c in password)

    charset_size = 0
    if has_lower: charset_size += 26
    if has_upper: charset_size += 26
    if has_digit: charset_size += 10
    if has_symbol: charset_size += 32
    if charset_size == 0: charset_size = 26

    length = len(password)
    combinations = charset_size ** length
    entropy = length * math.log2(charset_size) if charset_size > 0 else 0

    return {
        "charset_size": charset_size,
        "length": length,
        "combinations": combinations,
        "entropy_bits": round(entropy, 1),
        "has_lower": has_lower,
        "has_upper": has_upper,
        "has_digit": has_digit,
        "has_symbol": has_symbol
    }

def format_time(seconds):
    """Convert seconds to human readable cyber time"""
    if seconds < 0.001:
        return "Instant (< 1 ms)"
    if seconds < 1:
        return f"{round(seconds * 1000)} Milliseconds"
    if seconds < 60:
        return f"{round(seconds, 2)} Seconds"
    if seconds < 3600:
        return f"{round(seconds / 60, 1)} Minutes"
    if seconds < 86400:
        return f"{round(seconds / 3600, 1)} Hours"
    if seconds < 86400 * 30:
        return f"{round(seconds / 86400, 1)} Days"
    if seconds < 86400 * 365:
        return f"{round(seconds / (86400 * 30), 1)} Months"
    years = seconds / (86400 * 365)
    if years < 1000:
        return f"{round(years, 1)} Years"
    if years < 1000000:
        return f"{round(years / 1000, 1)} Thousand Years"
    if years < 1000000000:
        return f"{round(years / 1000000, 1)} Million Years"
    return f"{round(years / 1000000000, 1)} Billion Years"

def get_hash(text, algo="sha256"):
    text_bytes = text.encode("utf-8")
    if algo == "md5":
        return hashlib.md5(text_bytes).hexdigest()
    elif algo == "sha1":
        return hashlib.sha1(text_bytes).hexdigest()
    else:
        return hashlib.sha256(text_bytes).hexdigest()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/benchmark", methods=["GET"])
def benchmark():
    """Run a micro-benchmark to calculate real local hashing speed"""
    start = time.perf_counter()
    iterations = 50000
    for i in range(iterations):
        hashlib.sha256(b"benchmark_test_payload_123456").hexdigest()
    duration = time.perf_counter() - start
    hashes_per_sec = int(iterations / duration) if duration > 0 else 1000000
    return jsonify({
        "hashes_per_second": hashes_per_sec,
        "benchmark_algo": "SHA-256 (Local Hardware)",
        "sample_size": iterations
    })

@app.route("/api/crack", methods=["POST"])
def crack():
    data = request.get_json(force=True, silent=True) or {}
    password = data.get("password", "").strip()
    algo = data.get("algo", "sha256").lower()

    if not password:
        return jsonify({"error": "Password cannot be empty"}), 400

    target_hash = get_hash(password, algo)
    entropy_info = compute_entropy(password)

    # 1. Search localized RockYou dictionary
    found = False
    attempts = 0
    matched_word = None
    vulnerability_reason = None
    batch_candidates = []

    # Check exact dictionary match
    for idx, word in enumerate(DICTIONARY):
        attempts += 1
        if idx < 40:
            batch_candidates.append(word)
        if word == password:
            found = True
            matched_word = word
            vulnerability_reason = f"Identified in leaked RockYou database (Rank #{idx + 1})"
            break

    # 2. Check simple rule permutations if not found yet (e.g. appending current year 2026, 123)
    if not found:
        common_bases = ["password", "oran", "itc", "admin", "qubix", "qwerty", "algerie", "secret", "student", "cyber"]
        suffixes = ["2026", "2025", "2024", "123", "!", "@", "31"]
        for b in common_bases:
            for s in suffixes:
                attempts += 1
                cand = f"{b}{s}"
                if len(batch_candidates) < 60:
                    batch_candidates.append(cand)
                if cand.lower() == password.lower():
                    found = True
                    matched_word = password
                    vulnerability_reason = f"Dictionary Base ('{b}') + Common Suffix ('{s}') Rule"
                    break
            if found:
                break

    # Calculation of theoretical brute-force times at different attacker scales
    # Combinations / Hashing speed
    speed_cpu = 50_000_000          # 50 MH/s (Standard CPU)
    speed_gpu_rig = 100_000_000_000 # 100 GH/s (8x RTX 4090 Hashcat rig)
    speed_supercomputer = 50_000_000_000_000 # 50 TH/s (ASIC / State cluster)

    time_cpu = entropy_info["combinations"] / speed_cpu
    time_gpu = entropy_info["combinations"] / speed_gpu_rig
    time_super = entropy_info["combinations"] / speed_supercomputer

    return jsonify({
        "password": password,
        "target_hash": target_hash,
        "algo": algo.upper(),
        "found_in_dict": found,
        "matched_word": matched_word,
        "vulnerability_reason": vulnerability_reason,
        "attempts_checked": attempts,
        "sample_candidates": batch_candidates[:30],
        "entropy": entropy_info,
        "crack_estimates": {
            "time_cpu": format_time(time_cpu),
            "time_gpu": format_time(time_gpu),
            "time_supercomputer": format_time(time_super),
            "seconds_gpu": time_gpu
        }
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print("\n" + "=" * 60)
    print("  ITC // BRUTE-FORCE: VISUAL PASSWORD CRACKING")
    print("=" * 60)
    print(f"  Interactive Station: http://localhost:{port}")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=True)
