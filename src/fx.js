/*
 * Enjin zarah canvas (diport dari School Ready Kids, diluluskan Ubai 2026-10-28): kertas confetti dengan graviti,
 * seretan udara dan putaran 3D, reben berpintal, bunga api (roket, 6 bentuk letupan, kilauan), kilau, gelang,
 * bintang terbang. Hanya berjalan bila ada zarah hidup.
 */
(function (root) {
const TONES = [
    [
        '#C9BBFF',
        '#7357F5',
        '#4528B8'
    ],
    [
        '#AECFFF',
        '#458BFF',
        '#2256C4'
    ],
    [
        '#A8F0C6',
        '#42C98A',
        '#1E8C5C'
    ],
    [
        '#FFF2A6',
        '#FFCB45',
        '#E39B0E'
    ],
    [
        '#FFC6E1',
        '#FF77B7',
        '#D4448A'
    ],
    [
        '#FFD08A',
        '#FF9B3D',
        '#D9671A'
    ],
    [
        '#9AF0E6',
        '#2EC4B6',
        '#138A7E'
    ]
];
const GLOW = [
    '255,92,150',
    '255,206,70',
    '96,206,255',
    '170,130,255',
    '96,232,160',
    '255,150,80',
    '255,255,255'
];
const SOLID = [
    '232,52,120',
    '240,160,0',
    '30,140,240',
    '115,87,245',
    '20,170,100',
    '240,100,30'
];
const GOLD = '255,206,70';
const MAX_PARTS = 2400;
const rnd = (a, b)=>a + Math.random() * (b - a);
const pick = (a)=>a[Math.random() * a.length | 0];
const lerp = (a, b, t)=>a + (b - a) * t;
const easeInOut = (t)=>t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t)=>1 - Math.pow(1 - t, 3);
class FxEngine {
    quality = 1;
    parts = [];
    flys = [];
    emitters = [];
    timers = [];
    canvas = null;
    ctx = null;
    sprites = new Map();
    starSprite = null;
    raf = 0;
    last = 0;
    t = 0;
    W = 800;
    H = 600;
    DPR = 1;
    stats = {
        spawned: 0,
        papers: 0,
        rockets: 0,
        frames: 0,
        flown: 0
    };
    hooks = {};
    get width() {
        return this.W;
    }
    get height() {
        return this.H;
    }
    get live() {
        return this.parts.length + this.flys.length;
    }
    attach(canvas) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext('2d') ?? null;
        if (canvas) this.fit();
        else {
            cancelAnimationFrame(this.raf);
            this.raf = 0;
        }
    }
    fit() {
        const c = this.canvas;
        if (!c) return;
        const r = c.getBoundingClientRect();
        this.resize(r.width || window.innerWidth, r.height || window.innerHeight, Math.min(2, window.devicePixelRatio || 1));
    }
    resize(w, h, dpr = 1) {
        this.W = w;
        this.H = h;
        this.DPR = dpr;
        if (this.canvas) {
            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
        }
    }
    clear() {
        this.parts.length = 0;
        this.flys.length = 0;
        this.emitters.length = 0;
        this.timers.length = 0;
        this.paintEmpty();
    }
    correctAt(x, y) {
        this.ring(x, y, '255,214,90', 90, 7, 0.55);
        this.ring(x, y, '120,240,180', 60, 4, 0.4);
        for(let i = 0; i < 16; i++)this.sparkle(x + rnd(-30, 30), y + rnd(-14, 14), {
            up: 80
        });
        const n = Math.round(34 * this.quality);
        for(let i = 0; i < n; i++)this.paper(x + rnd(-20, 20), y, -Math.PI / 2 + rnd(-1, 1), this.H * rnd(0.55, 1.05), 0.8);
        this.wake();
    }
    trail(x, y, solid = false) {
        for(let i = 0; i < 2; i++)this.spark(x + rnd(-4, 4), y, rnd(-30, 30), rnd(80, 180), pick(solid ? [
            '240,120,30',
            '250,170,20'
        ] : [
            '255,180,80',
            '255,220,120',
            '255,120,80'
        ]), {
            max: rnd(0.3, 0.5),
            size: 2.4,
            tl: 3,
            g: 0,
            drag: 3.5,
            solid
        });
        if (Math.random() < 0.3) this.smoke(x, y + 6, rnd(6, 12));
        this.wake();
    }
    placeAt(x, y) {
        this.ring(x, y, '120,240,180', 56, 5, 0.4);
        for(let i = 0; i < 8; i++)this.sparkle(x + rnd(-20, 20), y + rnd(-10, 10), {
            up: 60,
            spd: rnd(60, 160)
        });
        this.wake();
    }
    starLand(x, y, size = 40) {
        this.ring(x, y, '255,214,90', size * 1.3, 7, 0.5);
        for(let i = 0; i < 14; i++)this.sparkle(x + rnd(-size * 0.3, size * 0.3), y + rnd(-size * 0.3, size * 0.3), {
            spd: rnd(120, 300)
        });
        for(let i = 0; i < 14; i++){
            const a = rnd(0, 6.283), sp = rnd(160, 340);
            this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, GOLD, {
                max: 0.6,
                size: 2,
                tl: 5,
                g: this.H * 0.2,
                drag: 2.6
            });
        }
        this.wake();
    }
    cannons(n = 140) {
        this.hooks.cannon?.();
        for (const side of [
            -1,
            1
        ]){
            const x0 = side < 0 ? -10 : this.W + 10, y0 = this.H * 0.97, base = side < 0 ? -Math.PI * 0.34 : -Math.PI * 0.66;
            for(let i = 0; i < n * this.quality; i++)this.paper(x0 + rnd(-8, 8), y0 + rnd(-8, 8), base + rnd(-0.3, 0.3), this.H * rnd(1.25, 2.3));
            if (this.quality >= 0.6) for(let i = 0; i < 7; i++)this.streamer(x0, y0, base + rnd(-0.22, 0.22), this.H * rnd(1.6, 2.3));
        }
        this.wake();
    }
    rain(seconds, perSecond = 70) {
        this.emit(seconds, 1 / Math.max(1, perSecond * this.quality), ()=>this.paper(rnd(0, this.W), rnd(-40, -10), Math.PI / 2 + rnd(-0.3, 0.3), rnd(30, 90), 1, 9));
        this.wake();
    }
    fireworks(seconds, dark) {
        this.launch(undefined, undefined, dark);
        this.emit(seconds, rnd(0.55, 0.8) / Math.max(0.4, this.quality), ()=>this.launch(undefined, undefined, dark));
        this.wake();
    }
    launch(x, ty, dark = true) {
        const side = Math.random() < 0.5 ? rnd(0.06, 0.28) : rnd(0.72, 0.94);
        const wide = this.W > 700;
        const y0 = this.H * 0.9, gr = this.H * 0.9, x0 = x ?? this.W * (wide ? side : rnd(0.2, 0.8)), tY = ty ?? (wide ? rnd(this.H * 0.12, this.H * 0.42) : rnd(this.H * 0.08, this.H * 0.2));
        const vy = -Math.sqrt(2 * gr * Math.max(40, y0 - tY)), tA = -vy / gr, tx = x ?? x0 + rnd(-this.W * 0.08, this.W * 0.08);
        this.add({
            k: 'rkt',
            x: x0,
            y: y0,
            vx: (tx - x0) / tA,
            vy,
            gr,
            wob: rnd(0, 6),
            type: pick([
                'peony',
                'peony',
                'ring',
                'willow',
                'heart',
                'crossette',
                'chrys'
            ]),
            col: pick(dark ? GLOW : SOLID),
            solid: !dark,
            life: 0,
            max: 6
        });
        this.stats.rockets++;
        this.wake();
    }
    flyStar(from, to, onDone) {
        if (!this.canvas) {
            this.stats.flown++;
            onDone?.();
            return;
        }
        this.hooks.fly?.();
        this.flys.push({
            p0: from,
            p1: {
                x: lerp(from.x, to.x, 0.4),
                y: Math.min(from.y, to.y) - this.H * 0.12
            },
            p2: to,
            t: 0,
            dur: 0.85,
            rot: 0,
            size: Math.max(40, Math.min(64, this.W * 0.05)),
            x: from.x,
            y: from.y,
            e: 0,
            done: onDone
        });
        this.wake();
    }
    after(seconds, fn) {
        this.timers.push({
            at: this.t + seconds,
            fn
        });
        this.wake();
    }
    add(p) {
        if (this.parts.length < MAX_PARTS) {
            this.parts.push(p);
            this.stats.spawned++;
        }
    }
    emit(seconds, every, fn) {
        this.emitters.push({
            until: this.t + seconds,
            every,
            acc: 0,
            fn
        });
    }
    paper(x, y, ang, spd, scale = 1, max) {
        const s = rnd(8, 14) * scale * (this.W < 520 ? 0.8 : 1);
        this.stats.papers++;
        this.add({
            k: 'pap',
            x,
            y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            w: s,
            h: s * rnd(0.42, 0.7),
            sh: pick([
                'r',
                'r',
                'r',
                'r',
                'c',
                't'
            ]),
            a: rnd(0, 6.28),
            va: rnd(-7, 7),
            f: rnd(0, 6.28),
            vf: rnd(6, 14),
            sw: rnd(0, 6.28),
            swA: rnd(16, 46),
            tone: pick(TONES),
            life: 0,
            max: max ?? rnd(4.5, 7)
        });
    }
    streamer(x, y, ang, spd) {
        const seg = rnd(7, 10) * (this.W < 520 ? 0.8 : 1);
        this.add({
            k: 'str',
            pts: Array.from({
                length: 10
            }, ()=>({
                    x,
                    y,
                    px: x,
                    py: y
                })),
            seg,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            tone: pick(TONES),
            life: 0,
            max: rnd(5, 7),
            w: rnd(5, 7.5),
            ph: rnd(0, 6.28),
            sw: rnd(0, 6.28)
        });
    }
    spark(x, y, vx, vy, col, o = {}) {
        this.add({
            k: 'spk',
            x,
            y,
            vx,
            vy,
            col,
            col2: o.col2,
            life: 0,
            max: o.max ?? rnd(1.1, 1.7),
            drag: o.drag ?? 1.6,
            g: o.g ?? this.H * 0.3,
            size: o.size ?? 2.2,
            tr: [],
            tl: o.tl ?? 7,
            glit: o.glit ?? 0,
            split: o.split ?? 0,
            solid: o.solid ?? false
        });
    }
    sparkle(x, y, o = {}) {
        const a = rnd(0, 6.28), sp = o.spd ?? rnd(40, 200);
        this.add({
            k: 'spl',
            x,
            y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - (o.up ?? 0),
            s: o.s ?? rnd(5, 11),
            col: pick([
                '#FFFFFF',
                '#FFE58A',
                '#FFD23F'
            ]),
            life: 0,
            max: o.max ?? rnd(0.45, 0.8),
            rot: rnd(0, 1)
        });
    }
    ring(x, y, col, r1, w = 6, max = 0.55) {
        this.add({
            k: 'ring',
            x,
            y,
            r0: 6,
            r1,
            col,
            w,
            life: 0,
            max
        });
    }
    smoke(x, y, r) {
        this.add({
            k: 'smk',
            x,
            y,
            vx: rnd(-10, 10),
            vy: rnd(-14, -4),
            r,
            vr: rnd(10, 22),
            a: rnd(0.08, 0.16),
            life: 0,
            max: rnd(2.2, 3.4)
        });
    }
    explode(r) {
        const { x, y, col, solid } = r;
        this.hooks.burst?.();
        const S = Math.min(this.W, this.H) * rnd(0.62, 0.82) * (this.W < 520 ? 1.1 : 1);
        const alt = pick((solid ? SOLID : GLOW).filter((c)=>c !== col));
        const white = solid ? '255,190,40' : '255,255,255';
        const N = (n)=>Math.round(n * Math.max(0.35, this.quality));
        const o = {
            solid
        };
        this.ring(x, y, col, S * 0.22, 3, 0.3);
        if (!solid) for(let i = 0; i < 4; i++)this.smoke(x + rnd(-20, 20), y + rnd(-20, 20), rnd(18, 34));
        if (r.type === 'peony' || r.type === 'chrys') {
            const chrys = r.type === 'chrys';
            for(let i = 0; i < N(chrys ? 130 : 115); i++){
                const u = rnd(-1, 1), th = rnd(0, 6.283), rr = Math.sqrt(1 - u * u), sp = S * rnd(0.9, 1);
                this.spark(x, y, Math.cos(th) * rr * sp, u * sp, col, {
                    ...o,
                    col2: chrys ? undefined : alt,
                    tl: chrys ? 13 : 6,
                    glit: chrys ? 1 : 0.3,
                    max: rnd(1.2, 1.8)
                });
            }
            for(let i = 0; i < N(26); i++){
                const a = rnd(0, 6.283), sp = S * rnd(0.2, 0.32);
                this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, white, {
                    ...o,
                    max: rnd(0.7, 1),
                    size: 1.6,
                    tl: 3
                });
            }
        } else if (r.type === 'ring') {
            const rot = rnd(0, Math.PI), sq = rnd(0.35, 1), n = N(70);
            for(let i = 0; i < n; i++){
                const a = i / n * 6.283, vx = Math.cos(a) * S * 0.95, vy = Math.sin(a) * S * 0.95 * sq;
                this.spark(x, y, vx * Math.cos(rot) - vy * Math.sin(rot), vx * Math.sin(rot) + vy * Math.cos(rot), col, {
                    ...o,
                    tl: 5,
                    max: rnd(1.2, 1.5),
                    g: this.H * 0.15
                });
            }
            for(let i = 0; i < N(30); i++){
                const a = rnd(0, 6.283), sp = S * rnd(0.25, 0.4);
                this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, alt, {
                    ...o,
                    tl: 4,
                    max: 1
                });
            }
        } else if (r.type === 'willow') {
            const gold = solid ? '230,150,0' : '255,196,90';
            for(let i = 0; i < N(95); i++){
                const u = rnd(-1, 1), th = rnd(0, 6.283), rr = Math.sqrt(1 - u * u), sp = S * rnd(0.75, 0.9);
                this.spark(x, y, Math.cos(th) * rr * sp, u * sp, gold, {
                    ...o,
                    drag: 2.4,
                    g: this.H * 0.2,
                    max: rnd(2.6, 3.3),
                    tl: 20,
                    size: 1.7,
                    glit: 0.8
                });
            }
        } else if (r.type === 'heart') {
            const n = N(80), pink = solid ? '232,52,120' : '255,110,170';
            for(let i = 0; i < n; i++){
                const t = i / n * 6.283, hx = 16 * Math.pow(Math.sin(t), 3), hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                this.spark(x, y, hx / 16 * S * 0.8, hy / 16 * S * 0.8, pink, {
                    ...o,
                    g: this.H * 0.07,
                    tl: 5,
                    max: rnd(1.3, 1.6),
                    glit: 0.3
                });
            }
            for(let i = 0; i < N(24); i++){
                const a = rnd(0, 6.283), sp = S * rnd(0.1, 0.25);
                this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, white, {
                    ...o,
                    max: 0.9,
                    size: 1.5,
                    tl: 3
                });
            }
        } else {
            const n = N(20);
            for(let i = 0; i < n; i++){
                const a = i / n * 6.283 + rnd(-0.1, 0.1), sp = S * 0.72;
                this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, col, {
                    ...o,
                    split: rnd(0.5, 0.65),
                    col2: alt,
                    tl: 8,
                    size: 2.4,
                    max: 2
                });
            }
        }
    }
    step(dt) {
        this.t += dt;
        for(let i = this.timers.length - 1; i >= 0; i--)if (this.timers[i].at <= this.t) {
            const tm = this.timers[i];
            this.timers.splice(i, 1);
            tm.fn();
        }
        for(let i = this.emitters.length - 1; i >= 0; i--){
            const e = this.emitters[i];
            e.acc += dt;
            while(e.acc >= e.every){
                e.acc -= e.every;
                e.fn();
            }
            if (this.t >= e.until) this.emitters.splice(i, 1);
        }
        const g = this.H * 1.15, W = this.W, H = this.H;
        for(let i = this.parts.length - 1; i >= 0; i--){
            const p = this.parts[i];
            p.life += dt;
            let dead = p.life >= p.max;
            switch(p.k){
                case 'pap':
                case 'str':
                    {
                        const d = p.life < 0.9 ? lerp(0.45, 4.2, p.life / 0.9) : 4.2;
                        p.vx -= p.vx * d * dt;
                        p.vy += (g - p.vy * d) * dt;
                        const sway = Math.sin(p.sw + p.life * 3.1) * (p.k === 'pap' ? p.swA : 30) * Math.min(1, p.life);
                        if (p.k === 'pap') {
                            p.x += (p.vx + sway) * dt;
                            p.y += p.vy * dt;
                            p.a += p.va * dt;
                            p.f += p.vf * dt;
                            if (p.y > H + 30) dead = true;
                        } else {
                            const h = p.pts[0];
                            h.px = h.x;
                            h.py = h.y;
                            h.x += (p.vx + sway) * dt;
                            h.y += p.vy * dt;
                            for(let j = 1; j < p.pts.length; j++){
                                const q = p.pts[j], vx = (q.x - q.px) * 0.94, vy = (q.y - q.py) * 0.94;
                                q.px = q.x;
                                q.py = q.y;
                                q.x += vx;
                                q.y += vy + g * 0.2 * dt * dt;
                            }
                            for(let it = 0; it < 2; it++)for(let j = 1; j < p.pts.length; j++){
                                const a = p.pts[j - 1], b = p.pts[j], dx = b.x - a.x, dy = b.y - a.y, dd = Math.hypot(dx, dy) || 1, df = (dd - p.seg) / dd;
                                b.x -= dx * df;
                                b.y -= dy * df;
                            }
                            if (p.pts[p.pts.length - 1].y > H + 40) dead = true;
                        }
                        break;
                    }
                case 'spk':
                    {
                        p.vx -= p.vx * p.drag * dt;
                        p.vy += (p.g - p.vy * p.drag) * dt;
                        p.tr.push(p.x, p.y);
                        if (p.tr.length > p.tl * 2) p.tr.splice(0, 2);
                        p.x += p.vx * dt;
                        p.y += p.vy * dt;
                        if (p.split && p.life >= p.split) {
                            const sp = Math.min(W, H) * 0.32;
                            for(let k = 0; k < 4; k++){
                                const a = k * Math.PI / 2 + rnd(-0.2, 0.2);
                                this.spark(p.x, p.y, Math.cos(a) * sp, Math.sin(a) * sp, p.col2 ?? p.col, {
                                    max: rnd(0.6, 0.9),
                                    size: 1.8,
                                    tl: 5,
                                    glit: 0.6,
                                    solid: p.solid
                                });
                            }
                            dead = true;
                        }
                        if (p.glit && p.life > p.max * 0.35 && Math.random() < p.glit * dt * 5) this.add({
                            k: 'twk',
                            x: p.x + rnd(-3, 3),
                            y: p.y + rnd(-3, 3),
                            life: 0,
                            max: rnd(0.12, 0.26),
                            s: rnd(2.5, 5)
                        });
                        break;
                    }
                case 'rkt':
                    p.vy += p.gr * dt;
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.wob += dt * 18;
                    p.x += Math.sin(p.wob) * 0.4;
                    if (Math.random() < 0.9) this.spark(p.x + rnd(-1.5, 1.5), p.y + 3, rnd(-18, 18), rnd(10, 60), p.solid ? '240,150,40' : '255,214,150', {
                        max: rnd(0.25, 0.55),
                        size: 1.3,
                        tl: 3,
                        drag: 2.2,
                        g: H * 0.25,
                        solid: p.solid
                    });
                    if (p.vy > -H * 0.07) {
                        this.explode(p);
                        dead = true;
                    }
                    break;
                case 'spl':
                    p.vx -= p.vx * 3.2 * dt;
                    p.vy += (H * 0.12 - p.vy * 3.2) * dt;
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.rot += dt * 3;
                    break;
                case 'smk':
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.r += p.vr * dt;
                    break;
                default:
                    break;
            }
            if (dead) {
                this.parts[i] = this.parts[this.parts.length - 1];
                this.parts.pop();
            }
        }
        for(let i = this.flys.length - 1; i >= 0; i--){
            const f = this.flys[i];
            f.t += dt / f.dur;
            const e = easeInOut(Math.min(1, f.t)), u = 1 - e;
            f.x = u * u * f.p0.x + 2 * u * e * f.p1.x + e * e * f.p2.x;
            f.y = u * u * f.p0.y + 2 * u * e * f.p1.y + e * e * f.p2.y;
            f.e = e;
            f.rot += dt * 8;
            if (Math.random() < 0.8 * this.quality) this.sparkle(f.x, f.y, {
                spd: rnd(10, 60),
                s: rnd(4, 8),
                max: 0.5
            });
            if (f.t >= 1) {
                this.flys.splice(i, 1);
                this.stats.flown++;
                f.done?.();
            }
        }
    }
    sprite(col, core) {
        const key = col + (core ? '+' : '');
        let c = this.sprites.get(key);
        if (c) return c;
        c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, core ? 'rgba(255,255,255,1)' : `rgba(${col},1)`);
        gr.addColorStop(0.16, `rgba(${col},.95)`);
        gr.addColorStop(0.45, `rgba(${col},.3)`);
        gr.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
        this.sprites.set(key, c);
        return c;
    }
    star() {
        if (this.starSprite) return this.starSprite;
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const g = c.getContext('2d');
        g.shadowColor = 'rgba(160,100,0,.45)';
        g.shadowBlur = 10;
        g.shadowOffsetY = 5;
        const gr = g.createRadialGradient(46, 40, 4, 64, 66, 70);
        gr.addColorStop(0, '#FFF6B8');
        gr.addColorStop(0.5, '#FFD23F');
        gr.addColorStop(1, '#D99A00');
        g.beginPath();
        for(let i = 0; i < 10; i++){
            const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 25 : 56;
            g.lineTo(64 + Math.cos(a) * r, 66 + Math.sin(a) * r);
        }
        g.closePath();
        g.fillStyle = gr;
        g.fill();
        g.shadowColor = 'transparent';
        g.lineWidth = 3;
        g.strokeStyle = '#E39B0E';
        g.stroke();
        g.fillStyle = 'rgba(255,255,255,.55)';
        g.beginPath();
        g.ellipse(48, 44, 12, 6, -0.5, 0, 7);
        g.fill();
        return this.starSprite = c;
    }
    draw() {
        const fx = this.ctx, cv = this.canvas;
        if (!fx || !cv) return;
        const D = this.DPR;
        fx.setTransform(1, 0, 0, 1, 0, 0);
        fx.clearRect(0, 0, cv.width, cv.height);
        fx.setTransform(D, 0, 0, D, 0, 0);
        for (const p of this.parts)if (p.k === 'smk') {
            fx.globalAlpha = p.a * (1 - p.life / p.max);
            fx.drawImage(this.sprite('235,220,255', false), p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
        fx.globalAlpha = 1;
        for (const p of this.parts){
            if (p.k === 'pap') {
                const c = Math.cos(p.f), cs = Math.cos(p.a), sn = Math.sin(p.a);
                fx.globalAlpha = p.life > p.max - 0.6 ? Math.max(0, (p.max - p.life) / 0.6) : 1;
                fx.setTransform(D * cs, D * sn, -D * sn * c, D * cs * c, D * p.x, D * p.y);
                fx.fillStyle = c > 0.82 ? p.tone[0] : c > 0 ? p.tone[1] : p.tone[2];
                if (p.sh === 'c') {
                    fx.beginPath();
                    fx.arc(0, 0, p.h * 0.75, 0, 6.283);
                    fx.fill();
                } else if (p.sh === 't') {
                    fx.beginPath();
                    fx.moveTo(0, -p.h * 0.9);
                    fx.lineTo(p.w * 0.55, p.h * 0.6);
                    fx.lineTo(-p.w * 0.55, p.h * 0.6);
                    fx.closePath();
                    fx.fill();
                } else fx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else if (p.k === 'str') {
                fx.setTransform(D, 0, 0, D, 0, 0);
                fx.globalAlpha = p.life > p.max - 0.6 ? Math.max(0, (p.max - p.life) / 0.6) : 1;
                fx.lineCap = 'round';
                for(let j = 0; j < p.pts.length - 1; j++){
                    const s = Math.sin(p.ph + j * 0.85 + p.life * 7);
                    fx.lineWidth = p.w * (0.25 + 0.75 * Math.abs(s));
                    fx.strokeStyle = s > 0 ? p.tone[1] : p.tone[2];
                    fx.beginPath();
                    fx.moveTo(p.pts[j].x, p.pts[j].y);
                    fx.lineTo(p.pts[j + 1].x, p.pts[j + 1].y);
                    fx.stroke();
                }
            } else if ((p.k === 'spk' || p.k === 'rkt') && p.solid) {
                fx.setTransform(D, 0, 0, D, 0, 0);
                this.drawSpark(fx, p);
            }
        }
        fx.globalAlpha = 1;
        fx.setTransform(D, 0, 0, D, 0, 0);
        fx.globalCompositeOperation = 'lighter';
        for (const p of this.parts){
            if ((p.k === 'spk' || p.k === 'rkt') && !p.solid) this.drawSpark(fx, p);
            else if (p.k === 'twk') {
                const a = Math.sin(Math.PI * p.life / p.max);
                fx.strokeStyle = `rgba(255,255,255,${a})`;
                fx.lineWidth = 1.2;
                fx.beginPath();
                fx.moveTo(p.x - p.s, p.y);
                fx.lineTo(p.x + p.s, p.y);
                fx.moveTo(p.x, p.y - p.s);
                fx.lineTo(p.x, p.y + p.s);
                fx.stroke();
            } else if (p.k === 'ring') {
                const t = p.life / p.max;
                fx.strokeStyle = `rgba(${p.col},${(1 - t) * 0.9})`;
                fx.lineWidth = p.w * (1 - t) + 0.5;
                fx.beginPath();
                fx.arc(p.x, p.y, lerp(p.r0, p.r1, easeOut(t)), 0, 6.283);
                fx.stroke();
            }
        }
        fx.globalCompositeOperation = 'source-over';
        for (const p of this.parts)if (p.k === 'spl') {
            const t = p.life / p.max, s = p.s * Math.sin(Math.PI * Math.min(1, t * 1.3 + 0.05));
            fx.setTransform(D, 0, 0, D, D * p.x, D * p.y);
            fx.rotate(p.rot);
            fx.fillStyle = p.col;
            fx.beginPath();
            for(let j = 0; j < 8; j++){
                const a = j * Math.PI / 4, rr = j % 2 ? s * 0.28 : s;
                fx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
            }
            fx.closePath();
            fx.fill();
        }
        for (const f of this.flys){
            const s = f.size * (1 - 0.3 * f.e) * (1 + 0.3 * Math.sin(Math.PI * f.e));
            fx.setTransform(D * Math.cos(f.rot), D * Math.sin(f.rot), -D * Math.sin(f.rot), D * Math.cos(f.rot), D * f.x, D * f.y);
            fx.drawImage(this.star(), -s / 2, -s / 2, s, s);
        }
        fx.setTransform(1, 0, 0, 1, 0, 0);
        fx.globalAlpha = 1;
    }
    drawSpark(fx, p) {
        if (p.k === 'rkt') {
            fx.drawImage(this.sprite(p.solid ? '240,150,40' : '255,220,160', !p.solid), p.x - 9, p.y - 9, 18, 18);
            return;
        }
        const t = p.life / p.max, a = Math.max(0, 1 - t * t), col = p.col2 && t > 0.5 && !p.split ? p.col2 : p.col;
        if (p.tr.length > 2) {
            fx.strokeStyle = `rgba(${col},${a * (p.solid ? 0.7 : 0.5)})`;
            fx.lineWidth = p.size * (p.solid ? 1.1 : 0.9);
            fx.beginPath();
            fx.moveTo(p.tr[0], p.tr[1]);
            for(let j = 2; j < p.tr.length; j += 2)fx.lineTo(p.tr[j], p.tr[j + 1]);
            fx.lineTo(p.x, p.y);
            fx.stroke();
        }
        const r = p.size * (p.solid ? 3 : 4.5) * (p.glit && Math.random() < 0.3 ? 1.6 : 1);
        fx.globalAlpha = a;
        fx.drawImage(this.sprite(col, !p.solid), p.x - r, p.y - r, r * 2, r * 2);
        fx.globalAlpha = 1;
    }
    paintEmpty() {
        const cv = this.canvas;
        if (this.ctx && cv) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, cv.width, cv.height);
        }
        if (cv) cv.dataset.live = '0';
    }
    idle() {
        return !this.parts.length && !this.flys.length && !this.emitters.length && !this.timers.length;
    }
    wake() {
        if (this.raf || !this.canvas || typeof requestAnimationFrame === 'undefined') return;
        this.last = performance.now();
        const loop = (now)=>{
            const dt = Math.min(0.05, (now - this.last) / 1000);
            this.last = now;
            this.step(dt);
            this.draw();
            this.stats.frames++;
            if (this.canvas && this.stats.frames % 10 === 0) this.canvas.dataset.live = String(this.live);
            if (this.idle()) {
                this.raf = 0;
                this.paintEmpty();
                return;
            }
            this.raf = requestAnimationFrame(loop);
        };
        this.raf = requestAnimationFrame(loop);
    }
}
root.fx = new FxEngine();

})(window);
