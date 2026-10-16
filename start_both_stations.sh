#!/bin/bash
# ITC Cybersecurity Exhibition - Dual Station Launcher for Linux/macOS
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "============================================================"
echo "  ITC // CYBERSECURITY EXHIBITION DUAL STATION LAUNCHER"
echo "============================================================"
echo ""
echo "Installing dependencies..."
pip install -r "$DIR/requirements.txt"

echo "Launching Station 1: Breach Trail Topology (Port 5000)..."
python3 "$DIR/station-1-breach-trail/app.py" &
PID1=$!

echo "Launching Station 2: Brute-Force Cracker (Port 5001)..."
python3 "$DIR/station-2-brute-force/app.py" &
PID2=$!

sleep 2

echo "Opening browsers..."
if which xdg-open > /dev/null; then
    xdg-open http://localhost:5000 &
    xdg-open http://localhost:5001 &
elif which open > /dev/null; then
    open http://localhost:5000 &
    open http://localhost:5001 &
fi

echo "============================================================"
echo "  BOTH STATIONS ARE RUNNING!"
echo "  - Station 1: http://localhost:5000 (PID: $PID1)"
echo "  - Station 2: http://localhost:5001 (PID: $PID2)"
echo "  Press Ctrl+C to terminate both servers."
echo "============================================================"

trap "kill $PID1 $PID2; exit" INT TERM
wait
