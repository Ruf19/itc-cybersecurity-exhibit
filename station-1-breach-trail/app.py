"""
ITC // RED TEAM · BREACH TRAIL
Flask server for local hosting
"""
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
@app.route("/enterprise")
def index():
    return render_template("index.html")

@app.route("/api/status")
def status():
    return jsonify({"status": "online"})

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  ITC // RED TEAM · BREACH TRAIL")
    print("=" * 60)
    print("  Dashboard:  http://localhost:5000")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
