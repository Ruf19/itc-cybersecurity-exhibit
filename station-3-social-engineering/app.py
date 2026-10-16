"""
ITC Cybersecurity Exhibit
Station 3 // Social Engineering Live Demo
Flask + Socket.IO | Port 5002
High-Tech Radar Scanner + Screen Stream Mirror
"""

import os
import re
import socket
import subprocess
import threading
import time
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room

# ── App Init ────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=os.path.join(BASE_DIR, "templates"),
            static_folder=os.path.join(BASE_DIR, "static"))
app.config["SECRET_KEY"] = "itc-s3-secret-2025"
socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*")

# ── State ────────────────────────────────────────────────────────────────────
connected_phones = {}      # sid → {ua, battery, orientation, ip, model, stream_active}
known_device_models = {}   # ip → friendly model string (e.g. "Samsung Galaxy")

# Common MAC OUIs for device identification
OUI_MAP = {
    "AC:66:57": "TP-Link Router",
    "BC:46:32": "Wi-Fi Router",
    "00:1A:2B": "Cisco",
    "18:E8:29": "Ubiquiti",
    "30:B5:C2": "Samsung Galaxy",
    "50:01:D9": "Samsung Galaxy",
    "82:CC:3B": "Samsung Galaxy",
    "C4:42:02": "Samsung Galaxy",
    "F4:7B:5E": "Samsung Galaxy",
    "78:40:E4": "Samsung Galaxy",
    "A8:9C:ED": "Apple iPhone",
    "F0:18:98": "Apple iPhone",
    "BC:D1:D3": "Apple iPhone",
    "3C:D9:2B": "Apple iPhone",
    "E8:8D:28": "Xiaomi Redmi",
    "64:09:80": "Xiaomi Redmi",
    "3C:CD:36": "Google Pixel",
    "D8:3C:69": "Google Pixel",
    "40:4E:36": "OnePlus Mobile",
}


def extract_phone_model(ua):
    """Accurately extract phone brand and model from User-Agent string."""
    if not ua:
        return "Samsung Galaxy"
    # Samsung
    if "SM-" in ua:
        m = re.search(r"SM-([A-Z0-9]+)", ua)
        return f"Samsung Galaxy ({m.group(0)})" if m else "Samsung Galaxy"
    if "SAMSUNG" in ua.upper():
        return "Samsung Galaxy"
    # Xiaomi / Redmi / POCO
    if "Redmi" in ua:
        m = re.search(r"Redmi[^\;\)]*", ua)
        return m.group(0).strip() if m else "Xiaomi Redmi"
    if "POCO" in ua:
        return "Xiaomi POCO"
    if "Xiaomi" in ua:
        return "Xiaomi Phone"
    if any(k in ua for k in ["2201", "2109", "2210", "2304", "2307", "2312", "2404"]):
        return "Xiaomi Redmi"
    # Google Pixel
    if "Pixel" in ua:
        m = re.search(r"Pixel[^\;\)]*", ua)
        return m.group(0).strip() if m else "Google Pixel"
    # Apple iPhone
    if "iPhone" in ua:
        return "Apple iPhone"
    # OnePlus
    if "OnePlus" in ua or "ONEPLUS" in ua or "CPH" in ua:
        return "OnePlus Phone"
    # Huawei / Honor
    if "HUAWEI" in ua.upper() or "HONOR" in ua.upper():
        return "Huawei Phone"
    # Generic Android with build model code
    if "Android" in ua:
        m = re.search(r"Android [0-9\.]+;\s*([^;\)]+?)\s*(?:Build|\))", ua)
        if m:
            clean_name = m.group(1).strip()
            if not any(x in clean_name.lower() for x in ["k", "wv", "mobile"]):
                return f"Android ({clean_name})"
        return "Android Smartphone"
    return "Smartphone"


# ── Helpers ─────────────────────────────────────────────────────────────────
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def ping_host(ip):
    try:
        result = subprocess.run(
            ["ping", "-n", "1", "-w", "500", ip],
            capture_output=True, timeout=1
        )
        return result.returncode == 0
    except Exception:
        return False


def get_mac(ip):
    try:
        result = subprocess.run(["arp", "-a", ip], capture_output=True,
                                text=True, timeout=2)
        for line in result.stdout.splitlines():
            if ip in line:
                parts = line.split()
                for p in parts:
                    if "-" in p and len(p) == 17:
                        return p.upper()
        return "??:??:??:??:??:??"
    except Exception:
        return "??:??:??:??:??:??"


def resolve_device_identity(ip, base_ip, mac):
    """Accurately identify device type, friendly name, and category."""
    if ip == base_ip:
        return "YOU (This Laptop)", "laptop", "Controller Host", 0.0, -18

    # If this device has connected and identified its exact model
    if ip in known_device_models:
        return known_device_models[ip], "phone", "Target Phone (Connected)", 0.1, -29

    # Gateway / Router check (usually ending in .1)
    if ip.endswith(".1"):
        return "Wi-Fi Gateway Router", "router", "Network Gateway", 1.8, -48

    # Check MAC for Private/Randomized MAC Address
    mac_clean = mac.replace("-", ":").upper()
    if mac_clean != "??:??:??:??:??:??" and len(mac_clean) == 17:
        try:
            first_byte = int(mac_clean.split(":")[0], 16)
            is_randomized = bool(first_byte & 2)
            if is_randomized:
                return "Samsung Galaxy Phone", "phone", "Mobile Device", 0.2, -32
        except Exception:
            pass

        prefix = ":".join(mac_clean.split(":")[:3])
        if prefix in OUI_MAP:
            vendor = OUI_MAP[prefix]
            if "Samsung" in vendor:
                return f"{vendor}", "phone", "Mobile Device", 0.2, -31
            elif any(k in vendor for k in ["Phone", "iPhone", "Redmi", "Pixel", "Apple"]):
                return f"{vendor}", "phone", "Mobile Device", 0.5, -38
            else:
                return f"{vendor}", "device", "Network Hardware", 3.2, -58

    return f"Mobile Device ({ip.split('.')[-1]})", "phone", "Nearby Client", 0.8, -42


def scan_subnet(base_ip):
    """
    Discovers all active hosts on the subnet + simulates nearby RF devices for realistic exhibit radar.
    """
    subnet = ".".join(base_ip.split(".")[:3])
    alive_ips = {}  # ip -> mac

    # 1. Read Windows ARP table
    try:
        arp_res = subprocess.run(["arp", "-a"], capture_output=True, text=True, timeout=3)
        for line in arp_res.stdout.splitlines():
            parts = line.split()
            if len(parts) >= 3:
                ip, mac, typ = parts[0], parts[1], parts[2]
                if ip.startswith(subnet + ".") and typ.lower() == "dynamic":
                    if not ip.endswith(".255"):
                        alive_ips[ip] = mac.upper()
    except Exception:
        pass

    # Ensure connected phones are listed
    for phone in connected_phones.values():
        if phone.get("ip"):
            alive_ips[phone["ip"]] = "CONNECTED"

    # Always ensure server itself is in list
    alive_ips[base_ip] = "HOST"

    results = []
    for ip, mac in alive_ips.items():
        if mac in ["??:??:??:??:??:??", "CONNECTED"]:
            mac = get_mac(ip)
        label, dev_type, category, distance, rssi = resolve_device_identity(ip, base_ip, mac)
        results.append({
            "ip": ip,
            "hostname": label,
            "type": dev_type,
            "category": category,
            "mac": mac,
            "distance": distance,
            "rssi": rssi,
            "is_connected": any(p.get("ip") == ip for p in connected_phones.values())
        })

    # Add realistic nearby devices for exhibit area atmosphere
    simulated_nearby = [
        {"ip": "RF-PROX-01", "hostname": "iPhone 15 Pro", "type": "phone", "category": "Nearby Visitor", "mac": "D4:E8:32:1A:0B", "distance": 2.4, "rssi": -55, "is_connected": False},
        {"ip": "RF-PROX-02", "hostname": "Xiaomi Redmi Note 13", "type": "phone", "category": "Nearby Visitor", "mac": "64:09:80:5C:2E", "distance": 4.1, "rssi": -64, "is_connected": False},
        {"ip": "RF-PROX-03", "hostname": "Google Pixel 8", "type": "phone", "category": "Nearby Visitor", "mac": "3C:CD:36:99:4F", "distance": 6.8, "rssi": -76, "is_connected": False},
    ]

    for sim in simulated_nearby:
        if not any(r["hostname"] == sim["hostname"] for r in results):
            results.append(sim)

    results.sort(key=lambda x: x.get("distance", 99))
    return results


# ── HTTP Routes ──────────────────────────────────────────────────────────────
@app.route("/")
def control_panel():
    local_ip = get_local_ip()
    phone_url = f"http://{local_ip}:5002/phone"
    return render_template("control.html", local_ip=local_ip,
                           phone_url=phone_url,
                           phone_count=len(connected_phones))


@app.route("/phone")
def phone_page():
    local_ip = get_local_ip()
    return render_template("phone.html", server_ip=local_ip)


@app.route("/api/scan")
def api_scan():
    local_ip = get_local_ip()
    devices = scan_subnet(local_ip)
    return jsonify({"devices": devices, "server_ip": local_ip,
                    "total": len(devices)})


@app.route("/api/status")
def api_status():
    return jsonify({
        "server_ip": get_local_ip(),
        "phones_connected": len(connected_phones),
        "phones": list(connected_phones.values())
    })


# ── Socket.IO Events ─────────────────────────────────────────────────────────
@socketio.on("connect")
def on_connect():
    pass


@socketio.on("disconnect")
def on_disconnect():
    sid = request.sid
    if sid in connected_phones:
        info = connected_phones.pop(sid)
        emit("phone_disconnected", {"sid": sid, "info": info},
             broadcast=True, include_self=False)
        emit("phone_count", {"count": len(connected_phones)},
             broadcast=True, include_self=False)


@socketio.on("phone_join")
def on_phone_join(data):
    """Phone connects and identifies itself with exact brand and model."""
    sid = request.sid
    ua = data.get("ua", "Unknown")
    model = extract_phone_model(ua)
    client_ip = request.remote_addr
    known_device_models[client_ip] = model

    connected_phones[sid] = {
        "sid": sid,
        "ua": ua,
        "model": model,
        "battery": data.get("battery", 0.85),
        "orientation": {"alpha": 0, "beta": 0, "gamma": 0},
        "ip": client_ip,
        "stream_active": False,
        "connected_at": time.strftime("%H:%M:%S")
    }
    join_room("phones")
    emit("phone_registered", connected_phones[sid],
         broadcast=True, include_self=False)
    emit("phone_count", {"count": len(connected_phones)},
         broadcast=True, include_self=False)
    emit("joined_ok", {"message": f"Connected as {model}", "model": model})


@socketio.on("phone_update")
def on_phone_update(data):
    """Phone sends live sensor/interaction updates."""
    sid = request.sid
    if sid in connected_phones:
        if "battery" in data:
            connected_phones[sid]["battery"] = data["battery"]
        if "orientation" in data:
            connected_phones[sid]["orientation"] = data["orientation"]
        emit("phone_data", {"sid": sid, "data": data},
             broadcast=True, include_self=False)


@socketio.on("phone_screen_frame")
def on_screen_frame(data):
    """Forward live screen stream frames from phone to control dashboard."""
    emit("stream_frame", data, broadcast=True, include_self=False)


@socketio.on("phone_action")
def on_phone_action(data):
    """Forward live user interaction (tap, scroll, app switch) to control dashboard."""
    emit("stream_action", data, broadcast=True, include_self=False)


@socketio.on("permission_granted")
def on_permission_granted(data):
    """Phone user tapped Allow on the security alert."""
    sid = request.sid
    if sid in connected_phones:
        connected_phones[sid]["stream_active"] = True
    emit("victim_permitted", data, broadcast=True, include_self=False)


@socketio.on("spam_notifications")
def on_spam(data):
    """Control panel triggers notification spam on phone."""
    count = data.get("count", 10)
    message = data.get("message", "CRITICAL SECURITY BREACH: Unauthorized device detected in immediate proximity!")
    emit("receive_spam", {"count": count, "message": message}, to="phones")


@socketio.on("send_message")
def on_send_message(data):
    emit("receive_message", {"text": data.get("text", ""), "sender": "ITC CYBER DEFENSE"}, to="phones")


@socketio.on("trigger_vibrate")
def on_vibrate(data):
    pattern = data.get("pattern", [200, 100, 200])
    emit("vibrate", {"pattern": pattern}, to="phones")


# ── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    local_ip = get_local_ip()
    print("=" * 56)
    print("  ITC // SOCIAL ENGINEERING DEMO // STATION 3")
    print("=" * 56)
    print(f"  Control Panel : http://{local_ip}:5002")
    print(f"  Phone Page    : http://{local_ip}:5002/phone")
    print("=" * 56)
    socketio.run(app, host="0.0.0.0", port=5002, debug=False,
                 allow_unsafe_werkzeug=True)
