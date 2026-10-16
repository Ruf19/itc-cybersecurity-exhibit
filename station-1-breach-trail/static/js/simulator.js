/* ═══════════════════════════════════════════════════════════
   ITC // CYBER TOPOLOGY & THREAT SIMULATOR — VAST ENGINE
   Design System V2 · Flat · 1px-Border · Terminal-Flavoured
   External Adversary / C2 + Chained Attacks + Full Breacher
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── 01 · COLOR PALETTE (ITC DESIGN SYSTEM V2) ───
    const C = {
        ink:      '#0e0f12',
        steel:    '#1b1e24',
        steelAlt: '#171a20',
        line:     '#2e323a',
        text:     '#f2f3f5',
        grey:     '#8a8f99',
        itcRed:   '#d81e24',
        hotRed:   '#ff4d52',
        tint:     '#fdecec',
        success:  '#36d184',
        warn:     '#ffc248',
        lift:     '#58a6ff',
        lift2:    '#a371f7',
        purple:   '#b072f5',
        orange:   '#ff7836',

        glowNormal: 'rgba(54, 209, 132, 0.45)',
        glowAttack: 'rgba(255, 77, 82, 0.65)',
        glowShield: 'rgba(88, 166, 255, 0.50)',
        glowApt:    'rgba(176, 114, 245, 0.60)'
    };

    // ─── 02 · HARDWARE ICONS (PACKET TRACER STYLE + ADVERSARY) ───
    const Icons = {
        // External Threat Actor / C2 Breacher
        hacker(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.40, h = s * 0.40;

            // Diamond / Hexagon Security Breach Emblem
            ctx.beginPath();
            ctx.moveTo(0, -h);
            ctx.lineTo(w, -h * 0.25);
            ctx.lineTo(w * 0.8, h * 0.75);
            ctx.lineTo(0, h);
            ctx.lineTo(-w * 0.8, h * 0.75);
            ctx.lineTo(-w, -h * 0.25);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Skull / Hooded Operator Silhouette
            ctx.fillStyle = stroke;
            ctx.beginPath();
            // Hood
            ctx.moveTo(0, -h * 0.65);
            ctx.quadraticCurveTo(w * 0.6, -h * 0.4, w * 0.4, h * 0.1);
            ctx.lineTo(-w * 0.4, h * 0.1);
            ctx.quadraticCurveTo(-w * 0.6, -h * 0.4, 0, -h * 0.65);
            ctx.fill();

            // Glowing Optical Visor slit
            ctx.fillStyle = C.hotRed;
            ctx.fillRect(-w * 0.28, -h * 0.22, w * 0.56, 3);

            // Crosshair lines
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.9); ctx.lineTo(0, -h * 0.7);
            ctx.moveTo(0, h * 0.7); ctx.lineTo(0, h * 0.9);
            ctx.moveTo(-w * 0.9, 0); ctx.lineTo(-w * 0.6, 0);
            ctx.moveTo(w * 0.6, 0); ctx.lineTo(w * 0.9, 0);
            ctx.stroke();
            ctx.globalAlpha = 1;

            ctx.restore();
        },

        // Botnet Swarm Cluster
        botnet(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const r = s * 0.36;

            // Dotted Radar Ring
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.6;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // 3 Small interconnected zombie nodes
            const positions = [
                { x: 0, y: -r * 0.45 },
                { x: -r * 0.45, y: r * 0.35 },
                { x: r * 0.45, y: r * 0.35 }
            ];

            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(positions[0].x, positions[0].y);
            ctx.lineTo(positions[1].x, positions[1].y);
            ctx.lineTo(positions[2].x, positions[2].y);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 1;

            for (const pos of positions) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = C.hotRed;
                ctx.fill();
            }

            ctx.restore();
        },

        // WAN / Cloud
        cloud(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.44, h = s * 0.24;

            ctx.beginPath();
            ctx.moveTo(-w * 0.6, h * 0.5);
            ctx.lineTo(w * 0.6, h * 0.5);
            ctx.arc(w * 0.6, h * 0.1, h * 0.4, Math.PI * 0.5, -Math.PI * 0.2, true);
            ctx.arc(w * 0.3, -h * 0.65, h * 0.65, -Math.PI * 0.1, -Math.PI * 0.8, true);
            ctx.arc(-w * 0.3, -h * 0.5, h * 0.55, -Math.PI * 0.2, Math.PI * 1.15, true);
            ctx.arc(-w * 0.65, h * 0.1, h * 0.4, Math.PI * 1.2, Math.PI * 0.5, true);
            ctx.closePath();

            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Cloud internal mesh
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(-w * 0.35, 0); ctx.lineTo(0, -h * 0.2); ctx.lineTo(w * 0.35, 0);
            ctx.moveTo(-w * 0.15, h * 0.2); ctx.lineTo(w * 0.2, h * 0.2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.restore();
        },

        // Cisco Router
        router(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const r = s * 0.36;

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Inner subtle ring
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
            ctx.strokeStyle = stroke;
            ctx.globalAlpha = 0.35;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;

            // 4 Cisco Cross Arrows
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.6;
            const al = r * 0.52, ah = r * 0.20;

            // Outward arrows
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(al * 0.7, -al * 0.7); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(al * 0.7, -al * 0.7); ctx.lineTo(al * 0.7 - ah, -al * 0.7);
            ctx.moveTo(al * 0.7, -al * 0.7); ctx.lineTo(al * 0.7, -al * 0.7 + ah);
            ctx.stroke();

            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-al * 0.7, al * 0.7); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-al * 0.7, al * 0.7); ctx.lineTo(-al * 0.7 + ah, al * 0.7);
            ctx.moveTo(-al * 0.7, al * 0.7); ctx.lineTo(-al * 0.7, al * 0.7 - ah);
            ctx.stroke();

            // Inward arrows
            ctx.beginPath(); ctx.moveTo(-al * 0.7, -al * 0.7); ctx.lineTo(0, 0); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(-ah * 0.9, -ah * 0.2);
            ctx.moveTo(0, 0); ctx.lineTo(-ah * 0.2, -ah * 0.9);
            ctx.stroke();

            ctx.beginPath(); ctx.moveTo(al * 0.7, al * 0.7); ctx.lineTo(0, 0); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(ah * 0.9, ah * 0.2);
            ctx.moveTo(0, 0); ctx.lineTo(ah * 0.2, ah * 0.9);
            ctx.stroke();

            ctx.restore();
        },

        // Firewall
        firewall(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.38, h = s * 0.40;

            ctx.beginPath();
            ctx.rect(-w, -h, w * 2, h * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Brick Mortar Lines
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = 0.45;
            const rows = 4;
            const bh = (h * 2) / rows;
            for (let i = 1; i < rows; i++) {
                const by = -h + bh * i;
                ctx.beginPath(); ctx.moveTo(-w, by); ctx.lineTo(w, by); ctx.stroke();
            }
            for (let i = 0; i < rows; i++) {
                const by = -h + bh * i;
                const offset = (i % 2 === 0) ? 0 : w * 0.5;
                ctx.beginPath(); ctx.moveTo(-w + w * 0.5 + offset, by); ctx.lineTo(-w + w * 0.5 + offset, by + bh); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-w + w * 1.5 + offset, by); ctx.lineTo(-w + w * 1.5 + offset, by + bh); ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Shield Emblem
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.4);
            ctx.lineTo(w * 0.38, -h * 0.2);
            ctx.lineTo(w * 0.38, h * 0.1);
            ctx.quadraticCurveTo(w * 0.38, h * 0.45, 0, h * 0.65);
            ctx.quadraticCurveTo(-w * 0.38, h * 0.45, -w * 0.38, h * 0.1);
            ctx.lineTo(-w * 0.38, -h * 0.2);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.restore();
        },

        // Cisco Switch
        switch_(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.44, h = s * 0.24;

            ctx.beginPath();
            ctx.moveTo(-w, -h);
            ctx.lineTo(w, -h);
            ctx.lineTo(w * 0.88, h);
            ctx.lineTo(-w * 0.88, h);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Port LEDs
            const ports = 7;
            const pw = 3.5, ph = 3;
            const startX = -w * 0.65;
            const portY = -h * 0.25;
            for (let i = 0; i < ports; i++) {
                ctx.fillStyle = stroke;
                ctx.fillRect(startX + i * (pw + 4.5), portY, pw, ph);
                ctx.beginPath();
                ctx.arc(startX + i * (pw + 4.5) + pw / 2, portY - 3, 1, 0, Math.PI * 2);
                ctx.fillStyle = C.success;
                ctx.fill();
            }

            // Directional arrows
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.3;
            const ay1 = h * 0.45;
            ctx.beginPath(); ctx.moveTo(w * 0.45, ay1); ctx.lineTo(-w * 0.45, ay1); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-w * 0.45, ay1); ctx.lineTo(-w * 0.45 + 4, ay1 - 3); ctx.moveTo(-w * 0.45, ay1); ctx.lineTo(-w * 0.45 + 4, ay1 + 3); ctx.stroke();
            const ay2 = h * 0.72;
            ctx.beginPath(); ctx.moveTo(-w * 0.45, ay2); ctx.lineTo(w * 0.45, ay2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w * 0.45, ay2); ctx.lineTo(w * 0.45 - 4, ay2 - 3); ctx.moveTo(w * 0.45, ay2); ctx.lineTo(w * 0.45 - 4, ay2 + 3); ctx.stroke();

            ctx.restore();
        },

        // Rack Server
        server(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.32, h = s * 0.44;

            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-w, -h, w * 2, h * 2, 3) : ctx.rect(-w, -h, w * 2, h * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            const bays = 3;
            const bayH = (h * 2) / bays;
            for (let i = 0; i < bays; i++) {
                const by = -h + bayH * i;
                if (i > 0) {
                    ctx.beginPath(); ctx.moveTo(-w + 3, by); ctx.lineTo(w - 3, by);
                    ctx.strokeStyle = stroke; ctx.lineWidth = 0.9; ctx.stroke();
                }
                ctx.fillStyle = stroke;
                ctx.globalAlpha = 0.3;
                ctx.fillRect(-w + 5, by + bayH * 0.22, w * 1.15, bayH * 0.55);
                ctx.globalAlpha = 1;

                ctx.beginPath();
                ctx.arc(w - 7, by + bayH * 0.4, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = C.success;
                ctx.fill();
            }

            ctx.restore();
        },

        // Active Directory Domain Controller (Server with Security Key Badge)
        dc(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.32, h = s * 0.44;

            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-w, -h, w * 2, h * 2, 3) : ctx.rect(-w, -h, w * 2, h * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Central Domain Key Logo
            ctx.strokeStyle = C.warn;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(0, -h * 0.25, 4.5, 0, Math.PI * 2);
            ctx.moveTo(0, -h * 0.25 + 4.5);
            ctx.lineTo(0, h * 0.35);
            ctx.lineTo(3.5, h * 0.25);
            ctx.moveTo(0, h * 0.15);
            ctx.lineTo(3.5, h * 0.05);
            ctx.stroke();

            // AD Tag text
            ctx.fillStyle = C.warn;
            ctx.font = 'bold 7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('AD/DC', 0, h * 0.72);

            ctx.restore();
        },

        // Cloud Storage / S3 Bucket
        cloudStorage(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.36, h = s * 0.38;

            // Bucket cylinder
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-w, -h, w * 2, h * 2, 4) : ctx.rect(-w, -h, w * 2, h * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Cloud overlay icon
            ctx.fillStyle = stroke;
            ctx.beginPath();
            ctx.arc(-5, -4, 6, 0, Math.PI * 2);
            ctx.arc(4, -6, 7, 0, Math.PI * 2);
            ctx.arc(10, -2, 5, 0, Math.PI * 2);
            ctx.fill();

            // S3 storage disks
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-w + 6, h * 0.3); ctx.lineTo(w - 6, h * 0.3);
            ctx.moveTo(-w + 6, h * 0.6); ctx.lineTo(w - 6, h * 0.6);
            ctx.stroke();

            ctx.restore();
        },

        // Database
        database(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const w = s * 0.32, h = s * 0.40;
            const ey = s * 0.10;

            ctx.beginPath();
            ctx.moveTo(-w, -h + ey);
            ctx.lineTo(-w, h - ey);
            ctx.ellipse(0, h - ey, w, ey, 0, Math.PI, 0, true);
            ctx.lineTo(w, -h + ey);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(0, -h + ey, w, ey, 0, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            for (const offset of [-h * 0.25, h * 0.25]) {
                ctx.beginPath();
                ctx.ellipse(0, offset, w, ey * 0.85, 0, 0, Math.PI, false);
                ctx.strokeStyle = stroke;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.55;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            ctx.fillStyle = C.warn;
            ctx.beginPath();
            ctx.arc(0, h * 0.4, 1.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        },

        // Laptop
        laptop(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const sw = s * 0.32, sh = s * 0.22;
            const bw = s * 0.40, bh = s * 0.07;

            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-sw, -sh - bh * 0.5, sw * 2, sh * 1.8, 2) : ctx.rect(-sw, -sh - bh * 0.5, sw * 2, sh * 1.8);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.fillStyle = stroke;
            ctx.globalAlpha = 0.15;
            ctx.fillRect(-sw + 3, -sh - bh * 0.5 + 3, sw * 2 - 6, sh * 1.8 - 6);
            ctx.globalAlpha = 1;

            ctx.fillStyle = C.success;
            ctx.font = 'bold 7px monospace';
            ctx.fillText('>_', -sw + 6, -sh + 4);

            const baseY = sh - bh * 0.5 + sh * 0.8;
            ctx.beginPath();
            ctx.moveTo(-sw, baseY);
            ctx.lineTo(sw, baseY);
            ctx.lineTo(bw, baseY + bh);
            ctx.lineTo(-bw, baseY + bh);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.restore();
        },

        // Admin Workstation
        desktop(ctx, x, y, s, stroke, fill) {
            ctx.save();
            ctx.translate(x, y);
            const mw = s * 0.36, mh = s * 0.26;

            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-mw, -mh - 4, mw * 2, mh * 1.7, 3) : ctx.rect(-mw, -mh - 4, mw * 2, mh * 1.7);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.fillStyle = stroke;
            ctx.globalAlpha = 0.14;
            ctx.fillRect(-mw + 4, -mh, mw * 2 - 8, mh * 1.7 - 12);
            ctx.globalAlpha = 1;

            ctx.fillStyle = C.hotRed;
            ctx.font = 'bold 7px monospace';
            ctx.fillText('#root', -mw + 7, -mh + 7);

            const sy = mh * 0.7;
            ctx.beginPath();
            ctx.moveTo(-3, sy); ctx.lineTo(3, sy); ctx.lineTo(3, sy + 7); ctx.lineTo(-3, sy + 7); ctx.closePath();
            ctx.fillStyle = stroke;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-s * 0.18, sy + 7);
            ctx.lineTo(s * 0.18, sy + 7);
            ctx.lineTo(s * 0.20, sy + 11);
            ctx.lineTo(-s * 0.20, sy + 11);
            ctx.closePath();
            ctx.fillStyle = stroke;
            ctx.fill();

            ctx.fillStyle = C.warn;
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('★', mw - 6, -mh + 8);

            ctx.restore();
        }
    };

    const ICON_MAP = {
        hacker:       Icons.hacker,
        botnet:       Icons.botnet,
        cloud:        Icons.cloud,
        router:       Icons.router,
        firewall:     Icons.firewall,
        switch:       Icons.switch_,
        server:       Icons.server,
        dc:           Icons.dc,
        cloudStorage: Icons.cloudStorage,
        database:     Icons.database,
        laptop:       Icons.laptop,
        desktop:      Icons.desktop,
        workstation:  Icons.laptop
    };

    // ─── 03 · VAST NETWORK TOPOLOGY (WITH EXTERNAL ADVERSARY) ───
    const NODE_DEFS = [
        // External Adversary & Botnet OUTSIDE the WAN
        { id: 'attacker',   abbr: 'APT',  label: 'Adversary C2',      type: 'hacker',       x: 0.05, y: 0.44 },
        { id: 'botnet',     abbr: 'BOT',  label: 'Botnet Swarm',      type: 'botnet',       x: 0.05, y: 0.18 },

        // Perimeter & WAN
        { id: 'internet',   abbr: 'WAN',  label: 'Public WAN',        type: 'cloud',        x: 0.18, y: 0.44 },
        { id: 'cloudstore', abbr: 'S3',   label: 'Cloud Storage',     type: 'cloudStorage', x: 0.18, y: 0.18 },
        { id: 'router',     abbr: 'RTR',  label: 'Edge Router',       type: 'router',       x: 0.30, y: 0.44 },
        { id: 'firewall',   abbr: 'FWL',  label: 'Firewall / IPS',    type: 'firewall',     x: 0.43, y: 0.44 },

        // Core Infrastructure
        { id: 'switch',     abbr: 'SWI',  label: 'Core Switch',       type: 'switch',       x: 0.57, y: 0.44 },
        { id: 'dc',         abbr: 'AD',   label: 'Active Directory',  type: 'dc',           x: 0.57, y: 0.18 },

        // DMZ & Servers
        { id: 'webserver',  abbr: 'WEB',  label: 'Web Server (DMZ)',  type: 'server',       x: 0.72, y: 0.18 },
        { id: 'database',   abbr: 'DB',   label: 'Database SQL',      type: 'database',     x: 0.88, y: 0.18 },
        { id: 'mailserver', abbr: 'MAIL', label: 'Mail Server',       type: 'server',       x: 0.72, y: 0.44 },
        { id: 'dns',        abbr: 'DNS',  label: 'DNS Server',        type: 'server',       x: 0.72, y: 0.72 },

        // Internal Corporate Endpoints
        { id: 'ws1',        abbr: 'WS1',  label: 'Finance PC',        type: 'laptop',       x: 0.85, y: 0.38 },
        { id: 'ws2',        abbr: 'WS2',  label: 'HR Laptop',         type: 'laptop',       x: 0.85, y: 0.54 },
        { id: 'ws3',        abbr: 'WS3',  label: 'Dev Workstation',   type: 'laptop',       x: 0.85, y: 0.70 },
        { id: 'admin',      abbr: 'ADM',  label: 'Admin SecOps',      type: 'desktop',      x: 0.95, y: 0.46 }
    ];

    const EDGE_DEFS = [
        // External adversary links coming INTO WAN
        { src: 'attacker',   dst: 'internet' },
        { src: 'botnet',     dst: 'internet' },
        { src: 'attacker',   dst: 'cloudstore' },

        // WAN & Perimeter
        { src: 'internet',   dst: 'cloudstore' },
        { src: 'internet',   dst: 'router' },
        { src: 'router',     dst: 'firewall' },
        { src: 'firewall',   dst: 'switch' },

        // Core distribution
        { src: 'switch',     dst: 'dc' },
        { src: 'switch',     dst: 'webserver' },
        { src: 'switch',     dst: 'mailserver' },
        { src: 'switch',     dst: 'dns' },
        { src: 'switch',     dst: 'ws1' },
        { src: 'switch',     dst: 'ws2' },
        { src: 'switch',     dst: 'ws3' },
        { src: 'switch',     dst: 'admin' },

        // Server & host interconnects
        { src: 'webserver',  dst: 'database' },
        { src: 'mailserver', dst: 'ws1' },
        { src: 'dc',         dst: 'database' },
        { src: 'dc',         dst: 'admin' }
    ];

    // ─── ATTACK VECTORS & CHAIN ATTACKS ───
    const ATTACK_DEFS = {
        // 1. External DDoS
        ddos: {
            name: 'External Botnet DDoS',
            path: ['botnet', 'internet', 'router', 'firewall', 'switch', 'webserver', 'mailserver'],
            blockedBy: 'firewall',
            blockNode: 'firewall',
            color: '#ff4d52',
            rate: 10,
            desc: 'External botnet launches volumetric flood through WAN into perimeter router'
        },

        // 2. Spear Phishing
        phishing: {
            name: 'Phishing Weaponization',
            path: ['attacker', 'internet', 'router', 'firewall', 'switch', 'mailserver', 'ws1', 'admin'],
            blockedBy: 'emailfilter',
            blockNode: 'mailserver',
            color: '#ff8a48',
            rate: 3.5,
            desc: 'Targeted email payload sent from adversary C2 into corporate mailboxes'
        },

        // 3. Web App Exploitation
        sqli: {
            name: 'SQL Injection Extract',
            path: ['attacker', 'internet', 'router', 'firewall', 'switch', 'webserver', 'database'],
            blockedBy: 'waf',
            blockNode: 'webserver',
            color: '#ff2d7a',
            rate: 4.5,
            desc: 'Adversary bypasses edge to inject queries into SQL database via DMZ web host'
        },

        // 4. Lateral Ransomware
        ransomware: {
            name: 'Ransomware Worm Outbreak',
            path: ['ws2', 'switch', 'dc', 'ws1', 'ws3', 'admin', 'mailserver', 'webserver', 'database'],
            blockedBy: 'endpoint',
            blockNode: 'ws2',
            color: '#cc1438',
            rate: 6.5,
            desc: 'Internal host compromised; lateral worm encrypts Active Directory & corporate subnet'
        },

        // 5. CHAIN ATTACK: APT Kill Chain (Multi-Stage Breach)
        chain_apt: {
            name: 'CHAIN: APT Kill Chain Breach',
            path: ['attacker', 'internet', 'router', 'firewall', 'switch', 'mailserver', 'ws1', 'switch', 'dc', 'database', 'attacker'],
            blockedBy: 'zerotrust',
            blockNode: 'dc',
            color: '#b072f5',
            rate: 5.5,
            desc: 'Multi-stage breach: Recon -> Phish -> WS1 pivot -> AD domain compromise -> Data exfiltrated back to C2!'
        },

        // 6. CHAIN ATTACK: Supply Chain Zero-Day
        chain_supply: {
            name: 'CHAIN: Supply Chain Zero-Day',
            path: ['attacker', 'cloudstore', 'internet', 'router', 'switch', 'dc', 'database', 'ws3'],
            blockedBy: 'threatintel',
            blockNode: 'attacker',
            color: '#ff44aa',
            rate: 5.0,
            desc: 'Cloud storage dependency poisoned -> Infiltrates core switch -> Breaches dev workstations'
        }
    };

    // ─── DEFENSIVE CONTROLS ───
    const DEFENSE_DEFS = {
        threatintel:  { name: 'Threat Intel C2 Blackhole', blocks: 'chain_supply', protects: ['attacker', 'botnet'], desc: 'BGP Blackhole isolates external adversary nodes entirely' },
        firewall:     { name: 'Perimeter Firewall / IPS',  blocks: 'ddos',         protects: ['firewall', 'router'],  desc: 'Filters volumetric floods & perimeter exploits' },
        emailfilter:  { name: 'Email Gateway Filter',      blocks: 'phishing',     protects: ['mailserver'],          desc: 'Quarantines malicious payloads & sender spoofing' },
        waf:          { name: 'Web Application Firewall',  blocks: 'sqli',         protects: ['webserver'],           desc: 'Deep packet inspection on HTTP query strings' },
        endpoint:     { name: 'Endpoint Protection (EDR)', blocks: 'ransomware',   protects: ['ws1','ws2','ws3','admin'], desc: 'Behavioral blocking of unauthorized encryption' },
        zerotrust:    { name: 'Zero-Trust Identity (AD)',  blocks: 'chain_apt',    protects: ['dc', 'switch'],        desc: 'Privileged access management stopping AD domain takeover' },
        segmentation: { name: 'VLAN Segmentation',         blocks: null,           protects: ['switch'],              desc: 'Isolates management, DMZ, and user VLAN segments' }
    };

    const NODE_DESC = {
        attacker:   'Hostile Threat Actor Command & Control (C2) server orchestrating external intrusion campaigns.',
        botnet:     'Distributed Botnet cluster ready to unleash multi-gigabit volumetric DDoS traffic.',
        internet:   'Public WAN routing backbone linking external traffic into the corporate boundary.',
        cloudstore: 'Enterprise AWS/S3 Cloud Storage housing public assets and firmware binaries.',
        router:     'BGP / Edge Router terminating public links and managing ingress packet streams.',
        firewall:   'Stateful Inspection Next-Gen Perimeter Firewall & IPS filtration appliance.',
        switch:     'Core Layer-3 10Gbps switch linking DMZ, corporate users, and management VLANs.',
        dc:         'Active Directory Domain Controller authenticating Kerberos tokens and domain policy.',
        webserver:  'Public HTTPS reverse-proxy and customer web application in the DMZ segment.',
        database:   'Secure SQL database cluster housing customer records and business schemas.',
        mailserver: 'Corporate SMTP / Exchange mail gateway handling inbound communications.',
        dns:        'Internal authoritative and recursive DNS domain name resolving host.',
        ws1:        'Finance Department employee workstation handling billing and payroll data.',
        ws2:        'Human Resources laptop with external resume and onboarding access.',
        ws3:        'Engineering workstation with source code repositories and build deployment pipelines.',
        admin:      'Privileged Security Operations & Domain Admin management station.'
    };

    // ─── AUDIO SYNTHESIZER ───
    class CyberAudio {
        constructor() {
            this.enabled = true;
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTone(freq, type, duration, gainVal = 0.05) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Audio silent fallback
            }
        }

        attack() {
            this.playTone(190, 'sawtooth', 0.18, 0.06);
            setTimeout(() => this.playTone(110, 'sawtooth', 0.22, 0.05), 50);
        }

        wholeBreach() {
            this.playTone(80, 'sawtooth', 0.45, 0.12);
            setTimeout(() => this.playTone(140, 'square', 0.35, 0.10), 80);
            setTimeout(() => this.playTone(220, 'sawtooth', 0.25, 0.08), 160);
        }

        defend() {
            this.playTone(520, 'sine', 0.12, 0.05);
            setTimeout(() => this.playTone(780, 'sine', 0.20, 0.04), 60);
        }

        block() {
            this.playTone(880, 'triangle', 0.08, 0.04);
        }

        compromise() {
            this.playTone(90, 'square', 0.35, 0.08);
        }
    }

    // ═══════════════════════════════════════════════════════
    //  SIMULATOR ENGINE
    // ═══════════════════════════════════════════════════════
    class CyberSimulator {
        constructor() {
            this.canvas = document.getElementById('network-canvas');
            this.ctx = this.canvas.getContext('2d');

            this.audio = new CyberAudio();
            this.nodes = {};
            this.edges = [];
            this.particles = [];
            this.bgStars = [];

            this.activeAttacks = new Set();
            this.activeDefenses = new Set();
            this.compromisedNodes = new Set();

            this.hoveredNode = null;
            this.selectedNode = null;
            this.dragNode = null;
            this.dragOffset = { x: 0, y: 0 };
            this.mouseX = 0;
            this.mouseY = 0;

            this.speedMultiplier = 1;

            // Stats
            this.stats = { normal: 0, attack: 0, blocked: 0, compromised: 0 };
            this.statsSmooth = { normal: 0, attack: 0, blocked: 0, compromised: 0 };

            this.time = 0;
            this.lastTime = performance.now();
            this.spawnTimers = {};

            this.initNodes();
            this.initEdges();
            this.initBgStars();
            this.resize();
            this.bindEvents();
            this.animate();

            this.log('ITC Cyber Engine online. Topology: 16 Nodes, 18 Links.', 'system');
            this.log('Adversary C2 & Botnet positioned OUTSIDE the WAN boundary.', 'attack');
        }

        initNodes() {
            for (const d of NODE_DEFS) {
                this.nodes[d.id] = {
                    ...d,
                    px: 0, py: 0,
                    hitRadius: 32,
                    status: (d.id === 'attacker' || d.id === 'botnet') ? 'adversary' : 'normal',
                    pulsePhase: Math.random() * Math.PI * 2,
                    shieldAlpha: 0,
                    flashAlpha: 0,
                    compromiseHits: 0
                };
            }
        }

        initEdges() {
            for (const d of EDGE_DEFS) {
                this.edges.push({ src: d.src, dst: d.dst, dashOff: Math.random() * 100 });
            }
        }

        initBgStars() {
            this.bgStars = [];
            for (let i = 0; i < 75; i++) {
                this.bgStars.push({
                    x: Math.random(),
                    y: Math.random(),
                    vx: (Math.random() - 0.5) * 0.002,
                    vy: (Math.random() - 0.5) * 0.002,
                    r: 0.6 + Math.random() * 1.2,
                    alpha: 0.12 + Math.random() * 0.25
                });
            }
        }

        resize() {
            const el = this.canvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            this.W = el.clientWidth;
            this.H = el.clientHeight;
            this.canvas.width = this.W * dpr;
            this.canvas.height = this.H * dpr;
            this.canvas.style.width = this.W + 'px';
            this.canvas.style.height = this.H + 'px';
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const padX = 65, padY = 55;
            for (const id in this.nodes) {
                const n = this.nodes[id];
                n.px = padX + n.x * (this.W - padX * 2);
                n.py = padY + n.y * (this.H - padY * 2);
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());

            this.canvas.addEventListener('mousemove', (e) => {
                const r = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - r.left;
                this.mouseY = e.clientY - r.top;

                if (this.dragNode) {
                    const n = this.dragNode;
                    n.px = this.mouseX - this.dragOffset.x;
                    n.py = this.mouseY - this.dragOffset.y;
                    n.x = (n.px - 65) / (this.W - 130);
                    n.y = (n.py - 55) / (this.H - 110);
                    return;
                }
                this.hoveredNode = this.hitTest(this.mouseX, this.mouseY);
                this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'crosshair';
                this.updateTooltip();
            });

            this.canvas.addEventListener('mousedown', () => {
                this.audio.init();
                const n = this.hitTest(this.mouseX, this.mouseY);
                if (n) {
                    this.dragNode = n;
                    this.dragOffset.x = this.mouseX - n.px;
                    this.dragOffset.y = this.mouseY - n.py;
                    this.canvas.classList.add('dragging');
                }
            });

            this.canvas.addEventListener('mouseup', () => {
                if (this.dragNode) {
                    this.selectNode(this.dragNode);
                    this.dragNode = null;
                    this.canvas.classList.remove('dragging');
                }
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.hoveredNode = null;
                this.dragNode = null;
                this.canvas.classList.remove('dragging');
                document.getElementById('tooltip').classList.add('hidden');
            });
        }

        hitTest(px, py) {
            for (const id in this.nodes) {
                const n = this.nodes[id];
                const dx = px - n.px, dy = py - n.py;
                if (dx * dx + dy * dy < n.hitRadius * n.hitRadius) return n;
            }
            return null;
        }

        updateTooltip() {
            const tt = document.getElementById('tooltip');
            if (this.hoveredNode && !this.dragNode) {
                tt.textContent = `${this.hoveredNode.label} [${this.hoveredNode.abbr}]`;
                tt.style.left = `${this.mouseX + 16}px`;
                tt.style.top  = `${this.mouseY - 10}px`;
                tt.classList.remove('hidden');
            } else {
                tt.classList.add('hidden');
            }
        }

        selectNode(node) {
            this.selectedNode = node;
            const el = document.getElementById('node-info');
            const sc = (node.status === 'adversary') ? C.hotRed :
                       (node.status === 'compromised') ? C.hotRed :
                       (node.status === 'defended') ? C.lift : C.success;
            const sl = node.status.toUpperCase();

            el.innerHTML = `
                <div class="node-name">${node.label}</div>
                <div class="node-detail"><span class="nd-label">TAG</span><span class="nd-value">${node.abbr}</span></div>
                <div class="node-detail"><span class="nd-label">TYPE</span><span class="nd-value">${node.type.toUpperCase()}</span></div>
                <div class="node-detail"><span class="nd-label">STATUS</span><span class="nd-value" style="color:${sc}">${sl}</span></div>
                <div class="node-desc">${NODE_DESC[node.id] || ''}</div>
            `;
        }

        // ─── ATTACKS (CLICK ON / CLICK OFF TOGGLE) ───
        toggleAttack(type) {
            const def = ATTACK_DEFS[type];
            if (!def) return;
            const btn = document.getElementById(`btn-${type}`);

            if (this.activeAttacks.has(type)) {
                // Click OFF: Deactivate attack
                this.activeAttacks.delete(type);
                delete this.spawnTimers[type];
                if (btn) btn.classList.remove('active');

                // Clear live particles belonging to this attack vector
                this.particles = this.particles.filter(p => p.attackType !== type);

                this.log(`⏹ ATTACK DEACTIVATED: ${def.name}`, 'warning');
            } else {
                // Click ON: Activate attack
                this.activeAttacks.add(type);
                this.audio.attack();

                if (btn) btn.classList.add('active');

                this.log(`⚡ ATTACK INITIATED: ${def.name}`, 'attack');
                this.log(`   └─ ${def.desc}`, 'attack');

                if (this.activeDefenses.has(def.blockedBy)) {
                    this.log(`🛡 SHIELD ENGAGED: Intercepted by ${DEFENSE_DEFS[def.blockedBy].name}`, 'blocked');
                }
                this.spawnTimers[type] = { t: 0, rate: def.rate };
            }
        }

        // Backward compatibility alias
        launchAttack(type) {
            this.toggleAttack(type);
        }

        // WHOLE BREACH (Toggle All Vectors Simultaneously)
        triggerWholeBreach() {
            const allTypes = Object.keys(ATTACK_DEFS);
            const allActive = allTypes.every(t => this.activeAttacks.has(t));

            if (allActive) {
                // Toggle off all
                this.resetAttacks();
                this.log('⏹ ALL ATTACK VECTORS DEACTIVATED', 'warning');
            } else {
                // Turn on all
                this.audio.wholeBreach();
                this.log('🚨🚨 WHOLE BREACH TRIGGERED! ALL VECTORS ENGAGED! 🚨🚨', 'attack');
                for (const type of allTypes) {
                    if (!this.activeAttacks.has(type)) {
                        this.activeAttacks.add(type);
                        const btn = document.getElementById(`btn-${type}`);
                        if (btn) btn.classList.add('active');
                        this.spawnTimers[type] = { t: 0, rate: ATTACK_DEFS[type].rate };
                    }
                }
                const container = document.getElementById('canvas-container');
                if (container) {
                    container.classList.add('breach-flash');
                    setTimeout(() => container.classList.remove('breach-flash'), 600);
                }
            }
        }

        resetAttacks() {
            this.activeAttacks.clear();
            this.spawnTimers = {};
            this.compromisedNodes.clear();

            for (const id in this.nodes) {
                const n = this.nodes[id];
                if (n.id === 'attacker' || n.id === 'botnet') {
                    n.status = 'adversary';
                } else if (n.status === 'compromised') {
                    n.status = this.isDefended(id) ? 'defended' : 'normal';
                }
                n.flashAlpha = 0;
                n.compromiseHits = 0;
            }
            this.particles = this.particles.filter(p => p.kind !== 'attack');
            document.querySelectorAll('.btn-attack').forEach(b => b.classList.remove('active'));
            this.stats.compromised = 0;
            this.log('↺ All attack vectors purged', 'warning');
        }

        resetAll() {
            this.resetAttacks();
            this.activeDefenses.clear();
            for (const id in this.nodes) {
                this.nodes[id].status = (id === 'attacker' || id === 'botnet') ? 'adversary' : 'normal';
                this.nodes[id].shieldAlpha = 0;
            }
            document.querySelectorAll('.btn-defense').forEach(b => b.classList.remove('active'));
            this.stats = { normal: 0, attack: 0, blocked: 0, compromised: 0 };
            this.log('↺ Full environment reset to pristine baseline', 'warning');
        }

        // ─── DEFENSES ───
        toggleDefense(type) {
            const def = DEFENSE_DEFS[type];
            if (!def) return;
            const btn = document.getElementById(`btn-${type}`);

            if (this.activeDefenses.has(type)) {
                this.activeDefenses.delete(type);
                if (btn) btn.classList.remove('active');
                this.log(`⚠ DEFENSE DECOMMISSIONED: ${def.name}`, 'warning');

                for (const nid of def.protects) {
                    const n = this.nodes[nid];
                    if (n && nid !== 'attacker' && nid !== 'botnet') {
                        n.status = this.compromisedNodes.has(nid) ? 'compromised' : 'normal';
                    }
                }
            } else {
                this.activeDefenses.add(type);
                this.audio.defend();
                if (btn) btn.classList.add('active');
                this.log(`🛡 DEFENSE DEPLOYED: ${def.name}`, 'defense');

                for (const nid of def.protects) {
                    const n = this.nodes[nid];
                    if (n && nid !== 'attacker' && nid !== 'botnet') {
                        n.status = 'defended';
                        this.compromisedNodes.delete(nid);
                        n.compromiseHits = 0;
                        n.flashAlpha = 0;
                    }
                }
                if (def.blocks && this.activeAttacks.has(def.blocks)) {
                    this.log(`🛡 ACTIVE THREAT MITIGATED: ${ATTACK_DEFS[def.blocks].name} stopped at barrier`, 'blocked');
                }
            }
        }

        isDefended(nodeId) {
            for (const [dt, dd] of Object.entries(DEFENSE_DEFS)) {
                if (this.activeDefenses.has(dt) && dd.protects.includes(nodeId)) return true;
            }
            return false;
        }

        // ─── TRAFFIC PARTICLE SYSTEMS ───
        spawnNormal() {
            // Normal internal and DMZ traffic (not from attacker)
            const internalEdges = this.edges.filter(e => e.src !== 'attacker' && e.src !== 'botnet' && e.dst !== 'attacker' && e.dst !== 'botnet');
            const e = internalEdges[Math.floor(Math.random() * internalEdges.length)];
            if (!e) return;
            const rev = Math.random() > 0.5;
            const s = this.nodes[rev ? e.dst : e.src], d = this.nodes[rev ? e.src : e.dst];
            if (!s || !d) return;

            this.particles.push({
                kind: 'normal',
                x: s.px, y: s.py,
                srcId: s.id, dstId: d.id,
                progress: 0,
                speed: 0.35 + Math.random() * 0.35,
                size: 2.2 + Math.random() * 1.4,
                color: C.success,
                alpha: 0.8 + Math.random() * 0.2,
                trail: []
            });
        }

        spawnAttack(type) {
            const def = ATTACK_DEFS[type];
            let path = [...def.path];

            if (def.blockedBy && this.activeDefenses.has(def.blockedBy)) {
                const bi = path.indexOf(def.blockNode);
                if (bi >= 0) path = path.slice(0, bi + 1);
            }
            if (path.length < 2) return;

            const s = this.nodes[path[0]], d = this.nodes[path[1]];
            if (!s || !d) return;

            this.particles.push({
                kind: 'attack',
                attackType: type,
                x: s.px, y: s.py,
                srcId: path[0], dstId: path[1],
                pathIdx: 0,
                path: path,
                progress: 0,
                speed: 0.55 + Math.random() * 0.25,
                size: 3.8 + Math.random() * 1.8,
                color: def.color,
                alpha: 0.95,
                trail: []
            });
        }

        updateParticles(dt) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                if (p.kind === 'burst') {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.alpha -= dt * 3.2;
                    if (p.alpha <= 0) this.particles.splice(i, 1);
                    continue;
                }

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 7) p.trail.shift();
                p.progress += p.speed * dt * this.speedMultiplier;

                const sn = this.nodes[p.srcId], dn = this.nodes[p.dstId];
                if (sn && dn) {
                    p.x = sn.px + (dn.px - sn.px) * p.progress;
                    p.y = sn.py + (dn.py - sn.py) * p.progress;
                }

                if (p.progress >= 1) {
                    if (p.kind === 'attack') {
                        this.onAttackArrive(p);
                    } else {
                        this.stats.normal++;
                    }
                    this.particles.splice(i, 1);
                }
            }
        }

        onAttackArrive(p) {
            const nid = p.dstId, n = this.nodes[nid];
            if (!n) return;

            // Check if node has defensive shield
            if (this.isDefended(nid)) {
                this.stats.blocked++;
                this.audio.block();
                this.burst(n.px, n.py, C.lift);
                return;
            }

            this.stats.attack++;
            n.flashAlpha = 1;

            // Chain to next hop in propagation path
            if (p.pathIdx < p.path.length - 2) {
                const ni = p.pathIdx + 1;
                const nextId = p.path[ni + 1];
                const nn = this.nodes[nextId];
                if (nn) {
                    this.particles.push({
                        kind: 'attack',
                        attackType: p.attackType,
                        x: n.px, y: n.py,
                        srcId: nid, dstId: nextId,
                        pathIdx: ni,
                        path: p.path,
                        progress: 0,
                        speed: p.speed,
                        size: p.size,
                        color: p.color,
                        alpha: 0.95,
                        trail: []
                    });
                }
            }

            // Node compromise threshold (excludes attacker and botnet)
            if (!this.compromisedNodes.has(nid) && nid !== 'internet' && nid !== 'attacker' && nid !== 'botnet') {
                n.compromiseHits++;
                if (n.compromiseHits >= 3) {
                    this.compromisedNodes.add(nid);
                    n.status = 'compromised';
                    this.audio.compromise();
                    this.stats.compromised = this.compromisedNodes.size;
                    this.log(`⚠ NODE COMPROMISED: ${n.label} breach confirmed!`, 'warning');
                }
            }
        }

        burst(x, y, color) {
            for (let i = 0; i < 7; i++) {
                const a = (Math.PI * 2 / 7) * i;
                this.particles.push({
                    kind: 'burst',
                    x, y,
                    vx: Math.cos(a) * 65,
                    vy: Math.sin(a) * 65,
                    progress: 0,
                    speed: 0,
                    size: 2.8,
                    color,
                    alpha: 1,
                    trail: []
                });
            }
        }

        // ─── TICK & RENDER ───
        update(dt) {
            this.time += dt;

            // Spawn healthy traffic flow
            if (Math.random() < dt * 4 * this.speedMultiplier) {
                this.spawnNormal();
            }

            // Spawn active attack waves
            for (const [type, timer] of Object.entries(this.spawnTimers)) {
                if (!this.activeAttacks.has(type)) continue;
                timer.t += dt * this.speedMultiplier;
                const iv = 1 / timer.rate;
                while (timer.t >= iv) {
                    timer.t -= iv;
                    this.spawnAttack(type);
                }
            }

            this.updateParticles(dt);

            // Ambient background particle drifting
            for (const bp of this.bgStars) {
                bp.x += bp.vx; bp.y += bp.vy;
                if (bp.x < 0 || bp.x > 1) bp.vx *= -1;
                if (bp.y < 0 || bp.y > 1) bp.vy *= -1;
            }

            // Node animation decay
            for (const id in this.nodes) {
                const n = this.nodes[id];
                if (n.flashAlpha > 0) n.flashAlpha -= dt * 2.2;
                if (n.flashAlpha < 0) n.flashAlpha = 0;
                const ts = n.status === 'defended' ? 1 : 0;
                n.shieldAlpha += (ts - n.shieldAlpha) * dt * 4;
            }

            // Rolling statistics counters
            for (const k of ['normal', 'attack', 'blocked', 'compromised']) {
                if (this.statsSmooth[k] < this.stats[k]) {
                    this.statsSmooth[k] = Math.min(this.stats[k], this.statsSmooth[k] + Math.ceil((this.stats[k] - this.statsSmooth[k]) * dt * 6));
                }
            }
            const el = id => document.getElementById(id);
            const sn = el('stat-normal'), sa = el('stat-attack'), sb = el('stat-blocked'), sc = el('stat-compromised');
            if (sn) sn.textContent = this.statsSmooth.normal;
            if (sa) sa.textContent = this.statsSmooth.attack;
            if (sb) sb.textContent = this.statsSmooth.blocked;
            if (sc) sc.textContent = this.statsSmooth.compromised;
        }

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.W, this.H);

            this.drawBackground(ctx);
            this.drawZones(ctx);
            this.drawEdges(ctx);
            this.drawTraffic(ctx);
            this.drawNodes(ctx);
            this.drawShields(ctx);
        }

        drawBackground(ctx) {
            // Dark Ink Radial Depth
            const grad = ctx.createRadialGradient(this.W * 0.5, this.H * 0.48, 40, this.W * 0.5, this.H * 0.48, this.W * 0.75);
            grad.addColorStop(0, '#13171f');
            grad.addColorStop(1, '#0b0d10');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.W, this.H);

            // Subtle Hex Matrix Grid
            ctx.strokeStyle = '#181e26';
            ctx.lineWidth = 0.5;
            const hexR = 38;
            const hexH = hexR * Math.sqrt(3);
            for (let row = -1; row < this.H / hexH + 1; row++) {
                for (let col = -1; col < this.W / (hexR * 3) + 1; col++) {
                    const cx = col * hexR * 3 + (row % 2 ? hexR * 1.5 : 0);
                    const cy = row * hexH * 0.5;
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = Math.PI / 6 + (Math.PI / 3) * i;
                        const px = cx + hexR * Math.cos(angle) * 0.55;
                        const py = cy + hexR * Math.sin(angle) * 0.55;
                        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            // Drifting Ambient Data Particles
            ctx.fillStyle = C.lift;
            for (const bp of this.bgStars) {
                ctx.globalAlpha = bp.alpha;
                ctx.beginPath();
                ctx.arc(bp.x * this.W, bp.y * this.H, bp.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // CRT Scanline
            ctx.fillStyle = 'rgba(255,255,255,0.007)';
            const sy = (this.time * 28) % this.H;
            ctx.fillRect(0, sy, this.W, 1.5);
        }

        drawZones(ctx) {
            // Demarcation line separating "EXTERNAL ADVERSARY ZONE" from "CORPORATE ENTERPRISE INGRESS"
            const boundX = this.W * 0.12;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 77, 82, 0.25)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(boundX, 20);
            ctx.lineTo(boundX, this.H - 20);
            ctx.stroke();
            ctx.setLineDash([]);

            // Label for external adversary zone
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillStyle = C.hotRed;
            ctx.globalAlpha = 0.65;
            ctx.textAlign = 'center';
            ctx.fillText('⚡ EXTERNAL ADVERSARY ZONE', boundX - 45, 30);
            ctx.fillStyle = C.lift;
            ctx.fillText('🛡 CORPORATE PERIMETER', boundX + 75, 30);
            ctx.restore();
        }

        drawEdges(ctx) {
            for (const e of this.edges) {
                const s = this.nodes[e.src], d = this.nodes[e.dst];
                if (!s || !d) continue;

                const isHostileLink = (s.id === 'attacker' || s.id === 'botnet' || d.id === 'attacker' || d.id === 'botnet');

                // Base Line
                ctx.beginPath();
                ctx.moveTo(s.px, s.py); ctx.lineTo(d.px, d.py);
                ctx.strokeStyle = isHostileLink ? 'rgba(255, 77, 82, 0.35)' : C.line;
                ctx.lineWidth = isHostileLink ? 1.4 : 1.2;
                ctx.stroke();

                // Animated Micro-Pulse dashes
                ctx.beginPath();
                ctx.moveTo(s.px, s.py); ctx.lineTo(d.px, d.py);
                ctx.strokeStyle = isHostileLink ? 'rgba(255, 77, 82, 0.6)' : '#252b36';
                ctx.lineWidth = 0.8;
                ctx.setLineDash([4, 11]);
                e.dashOff -= 0.5 * this.speedMultiplier;
                ctx.lineDashOffset = e.dashOff;
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        drawTraffic(ctx) {
            for (const p of this.particles) {
                if (p.kind === 'burst') {
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    continue;
                }

                // Packet Trail
                for (let t = 0; t < p.trail.length; t++) {
                    const tp = p.trail[t];
                    ctx.globalAlpha = (t / p.trail.length) * 0.28 * p.alpha;
                    ctx.beginPath();
                    ctx.arc(tp.x, tp.y, p.size * 0.55, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                }
                ctx.globalAlpha = 1;

                // Packet Head + Glow
                ctx.save();
                ctx.shadowBlur = (p.kind === 'attack') ? 14 : 7;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }

        drawNodes(ctx) {
            for (const id in this.nodes) {
                const n = this.nodes[id];
                const hovered = (this.hoveredNode === n);
                const selected = (this.selectedNode === n);
                const s = 58;

                let stroke = C.grey;
                let fill = C.steel;

                if (n.status === 'adversary')     { stroke = C.hotRed; fill = '#200c0f'; }
                else if (n.status === 'compromised') { stroke = C.hotRed; fill = '#1c0c0e'; }
                else if (n.status === 'defended')    { stroke = C.lift;   fill = '#0d1824'; }

                if (n.flashAlpha > 0) {
                    stroke = C.hotRed;
                    fill = `rgba(255, 77, 82, ${(n.flashAlpha * 0.2).toFixed(2)})`;
                }
                if (hovered)  { stroke = C.text; }
                if (selected) { stroke = C.warn; }

                // Adversary pulsating menace radar
                if (n.id === 'attacker') {
                    ctx.save();
                    const radarR = s * 0.55 + Math.sin(this.time * 3) * 6;
                    ctx.beginPath();
                    ctx.arc(n.px, n.py, radarR, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 77, 82, 0.4)';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                    ctx.restore();
                }

                // Status glow aura
                if (n.status === 'adversary' || n.status === 'compromised' || n.status === 'defended' || hovered) {
                    ctx.save();
                    ctx.shadowBlur = 18;
                    ctx.shadowColor = stroke;
                    ctx.beginPath();
                    ctx.arc(n.px, n.py, 6, 0, Math.PI * 2);
                    ctx.fillStyle = 'transparent';
                    ctx.fill();
                    ctx.restore();
                }

                // Render vector icon
                const drawFn = ICON_MAP[n.type];
                if (drawFn) {
                    drawFn(ctx, n.px, n.py, s, stroke, fill);
                }

                // Label below
                ctx.font = '600 10px "Segoe UI", sans-serif';
                ctx.fillStyle = (hovered || selected) ? C.text : C.grey;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(n.label, n.px, n.py + s * 0.40 + 3);

                // Code tag above
                ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
                ctx.fillStyle = stroke;
                ctx.globalAlpha = 0.8;
                ctx.textBaseline = 'bottom';
                ctx.fillText(n.abbr, n.px, n.py - s * 0.40 - 1);
                ctx.globalAlpha = 1;

                // Status indicator pill dot
                const dotColor = (n.status === 'adversary' || n.status === 'compromised') ? C.hotRed : (n.status === 'defended' ? C.lift : C.success);
                ctx.beginPath();
                ctx.arc(n.px + s * 0.30, n.py - s * 0.30, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
                ctx.fill();
            }
        }

        drawShields(ctx) {
            for (const id in this.nodes) {
                const n = this.nodes[id];
                if (n.shieldAlpha < 0.01) continue;

                ctx.save();
                ctx.globalAlpha = n.shieldAlpha * (0.42 + Math.sin(this.time * 3.2) * 0.12);
                const sr = 36;

                // Rotating Dashed Hex/Circle Barrier
                ctx.beginPath();
                ctx.arc(n.px, n.py, sr, 0, Math.PI * 2);
                ctx.strokeStyle = C.lift;
                ctx.lineWidth = 1.6;
                ctx.setLineDash([5, 4]);
                ctx.lineDashOffset = -this.time * 20;
                ctx.stroke();
                ctx.setLineDash([]);

                // Inner Shield Sheen
                ctx.beginPath();
                ctx.arc(n.px, n.py, sr, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(88, 166, 255, 0.05)';
                ctx.fill();

                ctx.restore();
            }
        }

        animate() {
            const now = performance.now();
            const dt = Math.min((now - this.lastTime) / 1000, 0.05);
            this.lastTime = now;
            this.update(dt);
            this.render();
            requestAnimationFrame(() => this.animate());
        }

        log(msg, type = 'system') {
            const el = document.getElementById('log-content');
            if (!el) return;
            const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            div.textContent = `[${ts}] ${msg}`;
            el.appendChild(div);
            el.scrollTop = el.scrollHeight;

            // Update log count in header
            const countEl = document.getElementById('log-count');
            if (countEl) countEl.textContent = `${el.children.length} ENTRIES`;

            while (el.children.length > 300) el.removeChild(el.firstChild);
        }

        clearLog() {
            const el = document.getElementById('log-content');
            if (el) el.innerHTML = '';
            const countEl = document.getElementById('log-count');
            if (countEl) countEl.textContent = '0 ENTRIES';
            this.log('Terminal log cleared', 'system');
        }

        toggleAudio() {
            this.audio.enabled = !this.audio.enabled;
            const el = document.getElementById('audio-btn');
            if (el) {
                el.textContent = this.audio.enabled ? '🔊 SFX ON' : '🔇 SFX OFF';
                el.classList.toggle('active', this.audio.enabled);
            }
            this.log(`Audio effects: ${this.audio.enabled ? 'ACTIVE' : 'MUTED'}`, 'system');
        }

        setSpeed(spd) {
            this.speedMultiplier = spd;
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            const cur = document.getElementById(`speed-${spd}x`);
            if (cur) cur.classList.add('active');
            this.log(`Simulation clock speed: ${spd}x`, 'system');
        }
    }

    // ─── BOOTSTRAP ───
    window.addEventListener('DOMContentLoaded', () => {
        window.simulator = new CyberSimulator();
    });

})();
