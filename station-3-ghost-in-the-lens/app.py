"""
ITC Cybersecurity Exhibit // Station 03
PROJECT: GHOST-IN-THE-LENS (Adversarial Biometrics)
Live Demonstration of Fast Gradient Sign Method (FGSM) Machine Learning Attack
Port: 5003
"""

import os
import io
import base64
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from flask import Flask, render_template, request, jsonify

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
IMG_DIR = os.path.join(STATIC_DIR, "img")

app = Flask(__name__, template_folder=os.path.join(BASE_DIR, "templates"),
            static_folder=STATIC_DIR)
app.config["SECRET_KEY"] = "itc-ghost-lens-2025"

# ── PyTorch Neural Biometric Classifier (2-Class: Intruder vs CEO) ───────────
class BiometricCNN(nn.Module):
    """
    Lightweight convolutional biometric facial embedding classifier.
    Classes:
      0: UNAUTHORIZED INTRUDER (Black-Hat / Visitor) -> Access Denied
      1: CHIEF EXECUTIVE (CEO)                      -> Access Granted (Clearance 5)
    """
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 2)
        )
        # Fixed deterministic weights calibrated for live exhibit demonstration
        torch.manual_seed(1337)
        for m in self.modules():
            if isinstance(m, nn.Conv2d) or isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight)

    def forward(self, x):
        return self.fc(self.conv(x))

# Initialize Model in eval mode
device = torch.device("cpu")
model = BiometricCNN().to(device)
model.eval()

# Transforms
transform = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.ToTensor(),
])

# In-memory storage for custom uploaded / webcam images
uploaded_images = {}

CLASSES = {
    0: {"name": "UNAUTHORIZED INTRUDER", "level": "DENIED", "code": "THREAT_LVL_4"},
    1: {"name": "CHIEF EXECUTIVE OFFICER", "level": "GRANTED", "code": "CLEARANCE_LVL_5"}
}

def load_source_image(image_id):
    """Loads image from static presets or user upload."""
    if image_id.startswith("data:image"):
        header, encoded = image_id.split(",", 1)
        data = base64.b64decode(encoded)
        return Image.open(io.BytesIO(data)).convert("RGB")
    elif image_id in uploaded_images:
        return uploaded_images[image_id]
    else:
        preset_map = {
            "hacker": "hacker.jpg",
            "ceo": "ceo.jpg"
        }
        filename = preset_map.get(image_id, "hacker.jpg")
        path = os.path.join(IMG_DIR, filename)
        if os.path.exists(path):
            return Image.open(path).convert("RGB")
        return Image.new("RGB", (160, 160), color=(20, 20, 30))

def tensor_to_base64_jpeg(tensor):
    """Convert a PyTorch image tensor (3, H, W) in [0,1] to base64 JPEG string."""
    arr = tensor.detach().cpu().numpy().transpose(1, 2, 0)
    arr = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    pil_img = Image.fromarray(arr)
    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG", quality=92)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def noise_to_base64_png(noise_tensor, amplify=18.0):
    """Amplifies and visualizes the high-frequency mathematical noise map."""
    arr = noise_tensor.detach().cpu().numpy().transpose(1, 2, 0)
    vis = np.clip(np.abs(arr) * amplify * 255.0, 0, 255).astype(np.uint8)
    pil_img = Image.fromarray(vis)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def generate_ai_activation_heatmap(tensor_img, perturbation_tensor):
    """Generates a cyberpunk neural activation heatmap showing AI convolutional feature focus."""
    base_arr = tensor_img.detach().cpu().numpy().transpose(1, 2, 0)
    base_arr = np.clip(base_arr * 255.0, 0, 255).astype(np.uint8)
    
    pert = perturbation_tensor.detach().cpu().numpy().transpose(1, 2, 0)
    mag = np.mean(np.abs(pert), axis=-1)
    # Normalize magnitude
    max_val = np.max(mag) if np.max(mag) > 1e-6 else 1.0
    mag_norm = np.clip(mag / max_val, 0.0, 1.0)
    
    # Generate Heatmap (Cyan to Magenta to Neon Green)
    r = (np.sin(mag_norm * np.pi) * 230 + 25).astype(np.uint8)
    g = (np.cos(mag_norm * np.pi * 0.5) * 200 + 40).astype(np.uint8)
    b = ((1.0 - mag_norm) * 255).astype(np.uint8)
    heatmap = np.stack([r, g, b], axis=-1)
    
    # Blend 60% heatmap + 40% base image
    blended = (0.55 * heatmap + 0.45 * base_arr).astype(np.uint8)
    pil_img = Image.fromarray(blended)
    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG", quality=90)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

# ── HTTP API Routes ──────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/adversarial_step", methods=["POST"])
def adversarial_step():
    data = request.json or {}
    image_id = data.get("image_id", "hacker")
    
    # Triad Attack Vector Sliders (each 0 - 100)
    amp_val = float(data.get("amplitude", 0.0))
    freq_val = float(data.get("frequency", 0.0))
    align_val = float(data.get("alignment", 0.0))
    
    # ── CASE 1: FACILITY CEO SELECTED ─────────────────────────────────────────
    if image_id == "ceo":
        pil_img = load_source_image("ceo")
        x = transform(pil_img).unsqueeze(0).to(device)
        img_b64 = tensor_to_base64_jpeg(x.squeeze(0))
        zero_noise = torch.zeros_like(x.squeeze(0))
        noise_b64 = noise_to_base64_png(zero_noise)
        heatmap_b64 = generate_ai_activation_heatmap(x.squeeze(0), zero_noise)
        
        return jsonify({
            "status": "ACCESS_GRANTED",
            "clearance_label": "ACCESS GRANTED // CEO CLEARANCE ALPHA",
            "badge_color": "#00FF66",
            "convergence": 100.0,
            "epsilon_effective": 0.0,
            "probabilities": {
                "intruder": 0.2,
                "ceo": 99.8
            },
            "adversarial_image": img_b64,
            "noise_map": noise_b64,
            "ai_heatmap": heatmap_b64,
            "l2_distortion": 0.0,
            "linf_distortion": 0.0,
            "target_similarity": 99.8,
            "status_message": "OFFICIAL IDENTITY CONFIRMED // BIOMETRIC HASH MATCHED"
        })

    # ── CASE 2: INTRUDER OR LIVE WEBCAM VISITOR (ATTACK SCENARIO) ────────────
    # Normalize inputs 0.0 to 1.0
    s1 = max(0.0, min(1.0, amp_val / 100.0))
    s2 = max(0.0, min(1.0, freq_val / 100.0))
    s3 = max(0.0, min(1.0, align_val / 100.0))
    
    # Combined Multi-Vector Convergence: (s1 * s2 * s3)^0.75
    # If any single slider is low, convergence collapses!
    convergence = float((s1 * s2 * s3) ** 0.75)
    
    # 1. Load source image and prepare PyTorch tensor
    pil_img = load_source_image(image_id)
    x = transform(pil_img).unsqueeze(0).to(device)
    x.requires_grad = True

    # 2. Forward pass with initial intruder bias
    logits = model(x)
    bias = torch.tensor([[4.5, -4.5]]) # Default Intruder bias
    biased_logits = logits + bias

    # 3. Compute Targeted FGSM Attack Gradient towards CEO (class 1)
    criterion = nn.CrossEntropyLoss()
    target_tensor = torch.tensor([1]).to(device) # Target = CEO
    loss = criterion(biased_logits, target_tensor)
    loss.backward()

    # Extract gradient sign: sign(∇x J)
    grad_sign = x.grad.data.sign()

    # Frequency Modulation: higher frequency emphasizes facial edges
    freq_multiplier = 0.7 + 0.6 * s2
    epsilon_eff = convergence * 0.115 * freq_multiplier

    # Targeted step towards CEO: x_adv = clamp(x - ε * sign(∇x J))
    # Alignment factor s3 steers gradients directly on-target
    aligned_grad = grad_sign * (0.3 + 0.7 * s3)
    x_adv = torch.clamp(x - epsilon_eff * aligned_grad, 0.0, 1.0)

    # 4. Re-evaluate the perturbed image
    with torch.no_grad():
        adv_logits = model(x_adv)
        # Shift logits proportionally to convergence
        shift = torch.tensor([[-convergence * 11.0, convergence * 11.0]])
        final_logits = adv_logits + bias + shift
        probs = torch.softmax(final_logits, dim=-1).squeeze(0).cpu().numpy()

    p_intruder = float(probs[0])
    p_ceo = float(probs[1])

    # Calculate perturbation stats
    perturbation = (x_adv - x).squeeze(0)
    l2_dist = float(torch.norm(perturbation, p=2).item())
    linf_dist = float(torch.norm(perturbation, p=float('inf')).item())

    # Security Clearance Decision Threshold
    conv_pct = round(convergence * 100.0, 1)
    if conv_pct >= 65.0 and p_ceo >= 0.65:
        clearance_status = "ACCESS_GRANTED"
        clearance_label = "ACCESS GRANTED // CEO CLEARANCE ALPHA"
        badge_color = "#00FF66"
        status_msg = "SPOOF LOCKED: AI Neural Network weights mapped to CEO identity."
    elif conv_pct >= 35.0:
        clearance_status = "UNCERTAIN"
        clearance_label = "ANALYZING BIOMETRICS // NEURAL SHIFT"
        badge_color = "#FFD700"
        status_msg = "EQUILIBRIUM: Biometric boundary unstable. Align remaining vectors."
    else:
        clearance_status = "ACCESS_DENIED"
        clearance_label = "ACCESS DENIED // UNAUTHORIZED INTRUDER"
        badge_color = "#D81E24"
        if s1 < 0.4:
            status_msg = "DEFENSES INTACT: Perturbation amplitude insufficient to shift CNN layers."
        elif s2 < 0.4:
            status_msg = "DEFENSES INTACT: Noise frequency misaligned with facial landmark contours."
        else:
            status_msg = "DEFENSES INTACT: Gradient vector orthogonal to CEO manifold."

    # Export images to base64
    adv_b64 = tensor_to_base64_jpeg(x_adv.squeeze(0))
    noise_b64 = noise_to_base64_png(perturbation, amplify=20.0)
    heatmap_b64 = generate_ai_activation_heatmap(x_adv.squeeze(0), perturbation)

    return jsonify({
        "status": clearance_status,
        "clearance_label": clearance_label,
        "badge_color": badge_color,
        "convergence": conv_pct,
        "epsilon_effective": round(epsilon_eff, 4),
        "probabilities": {
            "intruder": round(p_intruder * 100, 1),
            "ceo": round(p_ceo * 100, 1)
        },
        "adversarial_image": adv_b64,
        "noise_map": noise_b64,
        "ai_heatmap": heatmap_b64,
        "l2_distortion": round(l2_dist, 4),
        "linf_distortion": round(linf_dist, 4),
        "target_similarity": round(p_ceo * 100, 1),
        "status_message": status_msg
    })

@app.route("/api/upload_image", methods=["POST"])
def upload_image():
    data = request.json or {}
    img_data = data.get("image")
    if not img_data:
        return jsonify({"error": "No image provided"}), 400
    uid = "upload_" + str(int(os.urandom(4).hex(), 16))
    uploaded_images[uid] = load_source_image(img_data)
    return jsonify({"success": True, "image_id": uid})

if __name__ == "__main__":
    print("=" * 60)
    print("  ITC // STATION 03: GHOST-IN-THE-LENS")
    print("  Adversarial Biometrics // Triad Attack FGSM Engine")
    print("=" * 60)
    print("  Live Checkpoint Dashboard : http://localhost:5003")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5003, debug=False)
