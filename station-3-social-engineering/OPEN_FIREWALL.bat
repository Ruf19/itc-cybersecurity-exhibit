@echo off
title ITC - Open Firewall Port 5002
echo Requesting admin rights to open port 5002...
powershell -Command "Start-Process cmd -ArgumentList '/c netsh advfirewall firewall delete rule name=""ITC Station 3 Port 5002"" & netsh advfirewall firewall add rule name=""ITC Station 3 Port 5002"" dir=in action=allow protocol=TCP localport=5002 & echo PORT 5002 OPENED OK & pause' -Verb RunAs"
