/*
 * Dunia hidup dilukis pada canvas 2D (diport dari School Ready Kids): lapisan statik dicache setiap resize,
 * setiap bingkai hanya melukis yang bergerak. Cahaya dari kiri-atas, sama seperti seni SVG.
 * Ditambah: bandar, kota, laut + pulau, taman bunga untuk enam dunia Misi 3M.
 */
(function (root) {
const TAU = Math.PI * 2;
const rnd = (a, b)=>a + Math.random() * (b - a);
const pick = (a)=>a[Math.random() * a.length | 0];
const circle = (g, x, y, r)=>{
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
};
const vgrad = (g, y0, y1, stops)=>{
    const gr = g.createLinearGradient(0, y0, 0, y1);
    stops.forEach((s, i)=>gr.addColorStop(i / Math.max(1, stops.length - 1), s));
    return gr;
};
const ball = (g, x, y, r, tones)=>{
    const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r * 1.1);
    gr.addColorStop(0, tones[0]);
    gr.addColorStop(0.55, tones[1]);
    gr.addColorStop(1, tones[2]);
    g.fillStyle = gr;
    circle(g, x, y, r);
};
function layer(w, h, dpr) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * dpr));
    c.height = Math.max(1, Math.round(h * dpr));
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [
        c,
        g
    ];
}
function hill(g, W, H, yB, amp, f, ph, top, bottom) {
    g.beginPath();
    g.moveTo(0, H);
    for(let i = 0; i <= 48; i++)g.lineTo(i / 48 * W, yB - amp * (0.5 + 0.5 * Math.sin(i / 48 * f * TAU + ph)));
    g.lineTo(W, H);
    g.closePath();
    g.fillStyle = vgrad(g, yB - amp, H, [
        top,
        bottom
    ]);
    g.fill();
}
const CLOUD = [
    [
        0,
        0,
        28
    ],
    [
        26,
        -12,
        25
    ],
    [
        52,
        0,
        27
    ],
    [
        24,
        8,
        25
    ],
    [
        -22,
        6,
        18
    ],
    [
        74,
        8,
        17
    ]
];
function cloudSprite(s, dpr, tint = '#DCEBFF') {
    const [c, g] = layer(150 * s, 90 * s, dpr);
    g.translate(38 * s, 46 * s);
    g.fillStyle = 'rgba(140,175,230,.35)';
    for (const p of CLOUD)circle(g, p[0] * s, p[1] * s + 7 * s, p[2] * s);
    g.fillStyle = vgrad(g, -34 * s, 30 * s, [
        '#FFFFFF',
        tint
    ]);
    for (const p of CLOUD)circle(g, p[0] * s, p[1] * s, p[2] * s);
    g.fillStyle = 'rgba(255,255,255,.9)';
    circle(g, 16 * s, -20 * s, 9 * s);
    return c;
}
const LEAF = [
    '#CBF79A',
    '#74CC3E',
    '#3E8E22'
];
const LEAF_DEEP = [
    '#A8E68C',
    '#4FB34A',
    '#22702A'
];
function treeSprite(s, dpr, tones) {
    const w = 130 * s, h = 180 * s, ox = 65 * s, oy = 175 * s;
    const [c, g] = layer(w, h, dpr);
    g.translate(ox, oy);
    const tr = g.createLinearGradient(-8 * s, 0, 8 * s, 0);
    tr.addColorStop(0, '#C98A55');
    tr.addColorStop(1, '#7A4A22');
    g.fillStyle = tr;
    g.fillRect(-7 * s, -72 * s, 14 * s, 72 * s);
    const C = [
        [
            0,
            -100,
            46
        ],
        [
            -34,
            -78,
            34
        ],
        [
            34,
            -80,
            36
        ],
        [
            -14,
            -126,
            32
        ],
        [
            20,
            -122,
            30
        ]
    ];
    g.fillStyle = 'rgba(30,90,30,.32)';
    for (const k of C)circle(g, k[0] * s + 5 * s, k[1] * s + 7 * s, k[2] * s);
    for (const k of C){
        const gr = g.createRadialGradient((k[0] - k[2] * 0.35) * s, (k[1] - k[2] * 0.4) * s, 2, k[0] * s, k[1] * s, k[2] * s * 1.1);
        gr.addColorStop(0, tones[0]);
        gr.addColorStop(0.55, tones[1]);
        gr.addColorStop(1, tones[2]);
        g.fillStyle = gr;
        circle(g, k[0] * s, k[1] * s, k[2] * s);
    }
    g.fillStyle = 'rgba(255,255,255,.32)';
    circle(g, -20 * s, -118 * s, 9 * s);
    return {
        c,
        ox,
        oy
    };
}
function pineSprite(s, dpr) {
    const w = 90 * s, h = 190 * s, ox = 45 * s, oy = 185 * s;
    const [c, g] = layer(w, h, dpr);
    g.translate(ox, oy);
    g.fillStyle = '#7A4A22';
    g.fillRect(-5 * s, -26 * s, 10 * s, 26 * s);
    for(let i = 0; i < 4; i++){
        const y = -26 * s - i * 34 * s, hw = (40 - i * 8) * s;
        const gr = g.createLinearGradient(-hw, 0, hw, 0);
        gr.addColorStop(0, '#5FC24A');
        gr.addColorStop(0.6, '#2E8B3A');
        gr.addColorStop(1, '#1D5E2A');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(-hw, y);
        g.lineTo(0, y - 52 * s);
        g.lineTo(hw, y);
        g.closePath();
        g.fill();
        g.fillStyle = 'rgba(255,255,255,.18)';
        g.beginPath();
        g.moveTo(-hw * 0.7, y - 4 * s);
        g.lineTo(0, y - 48 * s);
        g.lineTo(-hw * 0.2, y - 4 * s);
        g.closePath();
        g.fill();
    }
    return {
        c,
        ox,
        oy
    };
}
function balloonSprite(s, dpr, a, b) {
    const [c, g] = layer(70 * s, 110 * s, dpr);
    g.translate(35 * s, 38 * s);
    g.save();
    g.beginPath();
    g.ellipse(0, 0, 30 * s, 34 * s, 0, 0, TAU);
    g.clip();
    for(let i = -3; i <= 3; i++){
        g.fillStyle = i % 2 ? a : b;
        g.beginPath();
        g.ellipse(i * 9 * s, 0, 6 * s, 36 * s, 0, 0, TAU);
        g.fill();
    }
    const sh = g.createRadialGradient(-12 * s, -14 * s, 2, 0, 0, 40 * s);
    sh.addColorStop(0, 'rgba(255,255,255,.5)');
    sh.addColorStop(0.4, 'rgba(255,255,255,0)');
    sh.addColorStop(1, 'rgba(40,20,80,.45)');
    g.fillStyle = sh;
    g.fillRect(-32 * s, -36 * s, 64 * s, 72 * s);
    g.restore();
    g.strokeStyle = '#8A6A4A';
    g.lineWidth = 1.4 * s;
    g.beginPath();
    g.moveTo(-14 * s, 28 * s);
    g.lineTo(-8 * s, 52 * s);
    g.moveTo(14 * s, 28 * s);
    g.lineTo(8 * s, 52 * s);
    g.stroke();
    g.fillStyle = '#B07446';
    g.fillRect(-9 * s, 52 * s, 18 * s, 13 * s);
    g.fillStyle = 'rgba(255,255,255,.3)';
    g.fillRect(-7 * s, 54 * s, 6 * s, 3 * s);
    return c;
}
function glowSprite(col) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.18, `rgba(${col},.9)`);
    gr.addColorStop(0.5, `rgba(${col},.25)`);
    gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return c;
}
function butterfly(g, x, y, t, a, b) {
    const fl = 0.25 + 0.75 * Math.abs(Math.sin(t * 13));
    for (const side of [
        -1,
        1
    ]){
        g.save();
        g.translate(x, y);
        g.scale(side * fl, 1);
        const gr = g.createRadialGradient(4, -4, 1, 6, -2, 12);
        gr.addColorStop(0, a);
        gr.addColorStop(1, b);
        g.fillStyle = gr;
        g.beginPath();
        g.ellipse(7, -5, 8, 6, 0.5, 0, TAU);
        g.fill();
        g.beginPath();
        g.ellipse(6, 5, 5.5, 4, -0.4, 0, TAU);
        g.fill();
        g.restore();
    }
    g.fillStyle = '#3A3150';
    g.fillRect(x - 1.2, y - 7, 2.4, 14);
}
function bird(g, x, y, s, t) {
    const f = Math.sin(t * 9) * 5 * s;
    g.strokeStyle = 'rgba(60,50,110,.7)';
    g.lineWidth = 2.2 * s;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x - 10 * s, y - f);
    g.quadraticCurveTo(x - 4 * s, y - 4 * s, x, y);
    g.quadraticCurveTo(x + 4 * s, y - 4 * s, x + 10 * s, y - f);
    g.stroke();
}
function makeStars(n, top) {
    return Array.from({
        length: n
    }, ()=>({
            x: Math.random(),
            y: Math.random() * top,
            r: rnd(0.6, 1.6),
            ph: rnd(0, TAU),
            sp: rnd(0.8, 3),
            big: Math.random() < 0.12
        }));
}
function drawStars(g, stars, W, H, t, glow) {
    for (const s of stars){
        const a = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)), x = s.x * W, y = s.y * H;
        g.globalAlpha = a;
        if (s.big) {
            g.drawImage(glow, x - s.r * 6, y - s.r * 6, s.r * 12, s.r * 12);
            g.strokeStyle = 'rgba(255,255,255,.7)';
            g.lineWidth = 0.8;
            g.beginPath();
            g.moveTo(x - s.r * 5, y);
            g.lineTo(x + s.r * 5, y);
            g.moveTo(x, y - s.r * 5);
            g.lineTo(x, y + s.r * 5);
            g.stroke();
        } else {
            g.fillStyle = '#fff';
            circle(g, x, y, s.r);
        }
    }
    g.globalAlpha = 1;
}
function meadowScene(o) {
    let W = 1, H = 1, D = 1, base = null;
    let clouds = [];
    let trees = [];
    let blades = [];
    let balloons = [];
    let flag = {
        x: 0,
        y: 0,
        s: 0
    };
    let sun = {
        x: 0,
        y: 0,
        r: 0
    };
    let glow = null;
    const flies = Array.from({
        length: o.butterflies
    }, (_, i)=>({
            cx: [
                0.22,
                0.78,
                0.5
            ][i % 3],
            cy: [
                0.44,
                0.38,
                0.3
            ][i % 3],
            ph: i * 2.1,
            c: i % 2 ? [
                '#C9BBFF',
                '#7357F5'
            ] : [
                '#FFC6E1',
                '#FF77B7'
            ]
        }));
    const bugs = Array.from({
        length: o.fireflies ?? 0
    }, ()=>({
            x: Math.random(),
            y: rnd(0.45, 0.85),
            ph: rnd(0, TAU),
            sp: rnd(0.3, 0.8)
        }));
    const birds = Array.from({
        length: o.birds ?? 0
    }, ()=>({
            x: Math.random(),
            y: rnd(0.08, 0.3),
            sp: rnd(0.02, 0.04),
            s: rnd(0.7, 1.1),
            ph: rnd(0, TAU)
        }));
    function school(g, x, y, s) {
        g.save();
        g.translate(x, y);
        g.fillStyle = vgrad(g, -80 * s, 0, [
            '#FFE58A',
            '#F2B33D'
        ]);
        g.fillRect(-70 * s, -80 * s, 140 * s, 80 * s);
        g.fillStyle = vgrad(g, -132 * s, -74 * s, [
            '#FF8C8C',
            '#C2303C'
        ]);
        g.beginPath();
        g.moveTo(-82 * s, -76 * s);
        g.lineTo(0, -132 * s);
        g.lineTo(82 * s, -76 * s);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(255,255,255,.35)';
        g.lineWidth = 3 * s;
        g.beginPath();
        g.moveTo(-66 * s, -84 * s);
        g.lineTo(0, -126 * s);
        g.stroke();
        g.fillStyle = '#fff';
        circle(g, 0, -96 * s, 11 * s);
        g.strokeStyle = '#2A2350';
        g.lineWidth = 2 * s;
        g.beginPath();
        g.moveTo(0, -96 * s);
        g.lineTo(0, -103 * s);
        g.moveTo(0, -96 * s);
        g.lineTo(5 * s, -96 * s);
        g.stroke();
        for (const wx of [
            -50,
            -22,
            22,
            50
        ]){
            g.fillStyle = vgrad(g, -64 * s, -40 * s, [
                '#E3F4FF',
                '#5AA8EC'
            ]);
            g.fillRect((wx - 9) * s, -64 * s, 18 * s, 22 * s);
            g.fillStyle = 'rgba(255,255,255,.7)';
            g.fillRect((wx - 7) * s, -62 * s, 5 * s, 9 * s);
        }
        g.fillStyle = vgrad(g, -36 * s, 0, [
            '#B07446',
            '#74461F'
        ]);
        g.fillRect(-11 * s, -36 * s, 22 * s, 36 * s);
        g.fillStyle = '#8D95A8';
        g.fillRect(56 * s, -170 * s, 3 * s, 94 * s);
        g.restore();
        flag = {
            x: x + 59 * s,
            y: y - 168 * s,
            s
        };
    }
    function paintBase(g) {
        g.fillStyle = vgrad(g, 0, H * 0.75, o.sky);
        g.fillRect(0, 0, W, H);
        const m = Math.min(W, H);
        sun = {
            x: W * 0.09,
            y: H * 0.13,
            r: m * 0.07
        };
        if (!o.cloudFloor) {
            const gr = g.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.r * 2.4);
            gr.addColorStop(0, 'rgba(255,245,190,.9)');
            gr.addColorStop(1, 'rgba(255,245,190,0)');
            g.fillStyle = gr;
            circle(g, sun.x, sun.y, sun.r * 2.4);
            ball(g, sun.x, sun.y, sun.r, [
                '#FFF7C2',
                '#FFD84A',
                '#FFB52E'
            ]);
        }
        if (o.rainbow) {
            const cx = W * 0.62, cy = H * 0.78, R = Math.max(W, H) * 0.5;
            g.globalAlpha = 0.5;
            [
                '#FF7A8A',
                '#FFB45A',
                '#FFE066',
                '#7BE08A',
                '#6EC3FF',
                '#9C8CFF'
            ].forEach((c, i)=>{
                g.strokeStyle = c;
                g.lineWidth = R * 0.035;
                g.beginPath();
                g.arc(cx, cy, R - i * R * 0.035, Math.PI * 1.05, Math.PI * 1.95);
                g.stroke();
            });
            g.globalAlpha = 1;
        }
        if (o.cloudFloor) {
            for(let i = 0; i < 9; i++){
                const s = rnd(1.6, 2.6) * (W / 1000 + 0.5), c = cloudSprite(s, D, '#F3E6FF');
                g.drawImage(c, i / 8 * W - 70 * s, H * rnd(0.74, 0.84) - 45 * s, 150 * s, 90 * s);
            }
            g.fillStyle = vgrad(g, H * 0.86, H, [
                'rgba(255,255,255,.95)',
                '#F6EEFF'
            ]);
            g.fillRect(0, H * 0.88, W, H * 0.12);
            return;
        }
        if (o.far) hill(g, W, H, H * 0.62, H * 0.1, 1.3, 0.6, o.far[0], o.far[1]);
        if (o.extra) o.extra(g, W, H, Math.min(W, H));
        if (o.pines) {
            const p = pineSprite(Math.min(W, H) / 900, D);
            for(let i = 0; i < 14; i++){
                const x = i / 13 * W + rnd(-20, 20), sc = rnd(0.7, 1.1);
                g.globalAlpha = 0.85;
                g.drawImage(p.c, x - p.ox * sc, H * 0.66 - p.oy * sc, p.c.width / D * sc, p.c.height / D * sc);
            }
            g.globalAlpha = 1;
        }
        if (o.school) {
            const narrow = W < 640;
            school(g, W * (narrow ? 0.8 : 0.9), H * (narrow ? 0.6 : 0.58), m / (narrow ? 900 : 640));
        }
        if (o.near) hill(g, W, H, H * 0.74, H * 0.08, 1.9, 2.4, o.near[0], o.near[1]);
        if (o.mushrooms) for (const [x, s] of [
            [
                0.14,
                1
            ],
            [
                0.22,
                0.7
            ],
            [
                0.83,
                0.9
            ]
        ]){
            const X = W * x, Y = H * 0.86, k = m / 700 * s;
            g.fillStyle = '#FFF2DE';
            g.fillRect(X - 6 * k, Y - 22 * k, 12 * k, 22 * k);
            g.fillStyle = vgrad(g, Y - 44 * k, Y - 18 * k, [
                '#FF8C8C',
                '#C2303C'
            ]);
            g.beginPath();
            g.ellipse(X, Y - 22 * k, 24 * k, 18 * k, 0, Math.PI, TAU);
            g.fill();
            g.fillStyle = '#fff';
            for (const [dx, dy, r] of [
                [
                    -10,
                    -30,
                    4
                ],
                [
                    6,
                    -34,
                    3
                ],
                [
                    12,
                    -26,
                    2.5
                ]
            ])circle(g, X + dx * k, Y + dy * k, r * k);
        }
        if (o.ground) {
            g.fillStyle = vgrad(g, H * 0.84, H, o.ground);
            g.fillRect(0, H * 0.86, W, H * 0.14);
        }
        if (o.extraFront) o.extraFront(g, W, H, Math.min(W, H));
    }
    return {
        resize (w, h, dpr) {
            W = w;
            H = h;
            D = dpr;
            const [c, g] = layer(W, H, D);
            base = c;
            glow = glowSprite('255,240,150');
            paintBase(g);
            const cs = Math.min(1.2, W / 900 + 0.3);
            clouds = Array.from({
                length: o.clouds
            }, (_, i)=>{
                const s = cs * rnd(0.55, 1.15);
                return {
                    x: rnd(-0.1, 1.1),
                    y: rnd(0.04, o.cloudFloor ? 0.55 : 0.32),
                    sp: rnd(0.006, 0.018) * (i % 2 ? 1 : 0.6),
                    c: cloudSprite(s, D),
                    w: 150 * s
                };
            });
            const ts = Math.min(W, H);
            trees = o.trees.map((t)=>{
                const sp = treeSprite(ts / 560 * t.s, D, t.deep ? LEAF_DEEP : LEAF);
                return {
                    x: t.x * W,
                    y: t.y * H,
                    ph: rnd(0, TAU),
                    ...sp
                };
            });
            blades = o.blades ? Array.from({
                length: Math.round(W / 7)
            }, ()=>({
                    x: Math.random(),
                    h: rnd(9, 24),
                    ph: rnd(0, TAU),
                    c: pick(o.blades)
                })) : [];
            balloons = Array.from({
                length: o.balloons ?? 0
            }, (_, i)=>{
                const s = ts / 700 * rnd(0.7, 1.1);
                return {
                    x: rnd(0.1, 0.9),
                    y: rnd(0.2, 0.6),
                    sp: rnd(0.008, 0.016),
                    ph: rnd(0, TAU),
                    c: balloonSprite(s, D, [
                        '#FF77B7',
                        '#FFCB45',
                        '#458BFF'
                    ][i % 3], '#FFFFFF'),
                    w: 70 * s
                };
            });
        },
        frame (g, t, dt) {
            if (!base) return;
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.drawImage(base, 0, 0);
            g.setTransform(D, 0, 0, D, 0, 0);
            if (!o.cloudFloor) {
                g.save();
                g.translate(sun.x, sun.y);
                g.rotate(t * 0.1);
                g.fillStyle = 'rgba(255,240,170,.2)';
                for(let i = 0; i < 12; i++){
                    g.beginPath();
                    g.moveTo(0, 0);
                    g.arc(0, 0, sun.r * 3.4, i * Math.PI / 6, i * Math.PI / 6 + 0.16);
                    g.closePath();
                    g.fill();
                }
                g.restore();
            }
            for (const c of clouds){
                c.x += c.sp * dt * 900 / Math.max(400, W);
                if (c.x * W > W + 20) c.x = -c.w / W - 0.05;
                g.drawImage(c.c, c.x * W, c.y * H, c.w, c.c.height / c.c.width * c.w);
            }
            for (const b of balloons){
                b.y -= b.sp * dt * 600 / Math.max(400, H);
                if (b.y < -0.2) {
                    b.y = 0.95;
                    b.x = rnd(0.1, 0.9);
                }
                g.drawImage(b.c, b.x * W + Math.sin(t * 0.6 + b.ph) * 12, b.y * H, b.w, b.c.height / b.c.width * b.w);
            }
            for (const b of birds){
                b.x += b.sp * dt;
                if (b.x > 1.1) b.x = -0.1;
                bird(g, b.x * W, b.y * H + Math.sin(t + b.ph) * 8, b.s, t + b.ph);
            }
            if (flag.s) {
                const s = flag.s;
                g.beginPath();
                g.moveTo(flag.x, flag.y);
                for(let i = 0; i <= 10; i++)g.lineTo(flag.x + i * 3.6 * s, flag.y + Math.sin(t * 5 - i * 0.6) * 3 * (i / 10) * s);
                for(let i = 10; i >= 0; i--)g.lineTo(flag.x + i * 3.6 * s, flag.y + 22 * s + Math.sin(t * 5 - i * 0.6) * 3 * (i / 10) * s);
                g.closePath();
                g.fillStyle = '#458BFF';
                g.fill();
            }
            if (o.dyn) o.dyn(g, t, W, H);
            for (const tr of trees){
                g.save();
                g.translate(tr.x, tr.y);
                g.rotate(Math.sin(t * 1.1 + tr.ph) * 0.025);
                g.drawImage(tr.c, -tr.ox, -tr.oy, tr.c.width / D, tr.c.height / D);
                g.restore();
            }
            if (blades.length) {
                g.lineCap = 'round';
                g.lineWidth = 3;
                for (const b of blades){
                    const x = b.x * W, y = H * 0.865, sw = Math.sin(t * 1.8 + b.ph + b.x * 6) * 4;
                    g.strokeStyle = b.c;
                    g.beginPath();
                    g.moveTo(x, y + 4);
                    g.quadraticCurveTo(x + sw * 0.4, y - b.h * 0.5, x + sw, y - b.h);
                    g.stroke();
                }
            }
            for (const f of flies)butterfly(g, W * (f.cx + Math.sin(t * 0.5 + f.ph) * 0.12), H * (f.cy + Math.sin(t * 1.3 + f.ph) * 0.04), t + f.ph, f.c[0], f.c[1]);
            if (bugs.length && glow) for (const b of bugs){
                const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.7 + b.ph)), x = (b.x + Math.sin(t * b.sp + b.ph) * 0.03) * W, y = (b.y + Math.cos(t * b.sp * 1.3 + b.ph) * 0.03) * H;
                g.globalAlpha = a;
                g.drawImage(glow, x - 9, y - 9, 18, 18);
            }
            g.globalAlpha = 1;
        }
    };
}
function planetBody(g, x, y, r, p) {
    let gr = g.createRadialGradient(x, y, r * 0.9, x, y, r * 1.6);
    gr.addColorStop(0, `rgba(${p.atm},.42)`);
    gr.addColorStop(1, `rgba(${p.atm},0)`);
    g.fillStyle = gr;
    circle(g, x, y, r * 1.6);
    const ring = (front)=>{
        g.save();
        g.translate(x, y);
        g.rotate(-0.35);
        for (const [k, w, col] of [
            [
                2.05,
                0.2,
                'rgba(255,214,150,.75)'
            ],
            [
                1.7,
                0.14,
                'rgba(255,170,200,.8)'
            ],
            [
                1.42,
                0.08,
                'rgba(255,240,220,.7)'
            ]
        ]){
            g.strokeStyle = col;
            g.lineWidth = r * w;
            g.beginPath();
            g.ellipse(0, 0, r * k, r * k * 0.26, 0, front ? 0 : Math.PI, front ? Math.PI : TAU);
            g.stroke();
        }
        g.restore();
    };
    if (p.ring) ring(false);
    g.save();
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.clip();
    g.fillStyle = p.tones[1];
    g.fillRect(x - r, y - r, r * 2, r * 2);
    if (p.earth) {
        g.fillStyle = '#5BD07A';
        for (const [dx, dy, rx, ry] of [
            [
                -0.3,
                -0.2,
                0.35,
                0.22
            ],
            [
                0.25,
                0.25,
                0.3,
                0.18
            ],
            [
                0.1,
                -0.55,
                0.2,
                0.1
            ]
        ]){
            g.beginPath();
            g.ellipse(x + dx * r, y + dy * r, rx * r, ry * r, 0.4, 0, TAU);
            g.fill();
        }
        g.fillStyle = 'rgba(255,255,255,.7)';
        for (const [dx, dy] of [
            [
                -0.5,
                0.3
            ],
            [
                0.4,
                -0.3
            ]
        ]){
            g.beginPath();
            g.ellipse(x + dx * r, y + dy * r, r * 0.3, r * 0.06, -0.2, 0, TAU);
            g.fill();
        }
    } else {
        g.translate(x, y);
        g.rotate(-0.35);
        for(let i = -6; i <= 6; i++){
            g.fillStyle = i % 2 ? p.tones[0] : p.tones[2];
            g.globalAlpha = 0.42;
            g.beginPath();
            g.ellipse(0, i * r * 0.17, r * 1.6, r * 0.05 + Math.abs(Math.sin(i * 1.7)) * r * 0.05, 0, 0, TAU);
            g.fill();
        }
        g.globalAlpha = 1;
        g.setTransform(1, 0, 0, 1, 0, 0);
    }
    g.restore();
    g.save();
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.clip();
    gr = g.createRadialGradient(x - r * 0.42, y - r * 0.45, 0, x, y, r * 1.45);
    gr.addColorStop(0, 'rgba(255,255,255,.5)');
    gr.addColorStop(0.32, 'rgba(255,255,255,0)');
    gr.addColorStop(0.72, 'rgba(20,8,60,.3)');
    gr.addColorStop(1, 'rgba(20,8,60,.85)');
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    g.restore();
    g.strokeStyle = 'rgba(255,255,255,.45)';
    g.lineWidth = Math.max(1.5, r * 0.03);
    g.beginPath();
    g.arc(x, y, r * 0.97, Math.PI * 1.05, Math.PI * 1.55);
    g.stroke();
    if (p.ring) ring(true);
}
function spaceScene(o) {
    let W = 1, H = 1, D = 1, base = null, stars = [], glow = null;
    let dust = [];
    let shoot = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 1,
        next: 2
    };
    function paintBase(g) {
        g.setTransform(D, 0, 0, D, 0, 0);
        if (!o.clearSky) {
            g.fillStyle = vgrad(g, 0, H, o.sky);
            g.fillRect(0, 0, W, H);
        }
        if (o.nebula && !o.clearSky) for (const [i, c] of o.nebula.entries()){
            const x = W * [
                0.25,
                0.75,
                0.55
            ][i % 3], y = H * [
                0.3,
                0.2,
                0.55
            ][i % 3], r = Math.max(W, H) * 0.45;
            const gr = g.createRadialGradient(x, y, 0, x, y, r);
            gr.addColorStop(0, `rgba(${c},.42)`);
            gr.addColorStop(1, `rgba(${c},0)`);
            g.fillStyle = gr;
            g.fillRect(0, 0, W, H);
        }
        const m = Math.min(W, H), port = W < H;
        const p = o.planet;
        planetBody(g, W * (port ? Math.min(0.78, p.x) : p.x), H * p.y, m * p.r, p);
        for (const mo of o.moons ?? [])ball(g, W * mo.x, H * mo.y, m * mo.r, [
            '#F4F0FF',
            '#C9BEEA',
            '#7E6FB0'
        ]);
        const gy = H * 0.84;
        if (o.ground === 'moon') {
            g.beginPath();
            g.moveTo(0, H);
            for(let i = 0; i <= 40; i++)g.lineTo(i / 40 * W, gy - H * 0.035 * Math.sin(i / 40 * 5 + 1));
            g.lineTo(W, H);
            g.closePath();
            g.fillStyle = vgrad(g, gy - H * 0.05, H, [
                '#E4E1F2',
                '#B3AECB',
                '#7E78A0'
            ]);
            g.fill();
            for (const [x, y, rx] of [
                [
                    0.12,
                    0.9,
                    0.05
                ],
                [
                    0.3,
                    0.95,
                    0.03
                ],
                [
                    0.55,
                    0.88,
                    0.04
                ],
                [
                    0.78,
                    0.94,
                    0.06
                ],
                [
                    0.92,
                    0.88,
                    0.025
                ]
            ]){
                g.fillStyle = 'rgba(90,80,140,.35)';
                g.beginPath();
                g.ellipse(W * x, H * y, W * rx, W * rx * 0.3, 0, 0, TAU);
                g.fill();
                g.strokeStyle = 'rgba(255,255,255,.5)';
                g.lineWidth = 2;
                g.beginPath();
                g.ellipse(W * x, H * y + 1, W * rx, W * rx * 0.3, 0, 0.1, Math.PI - 0.1);
                g.stroke();
            }
            g.fillStyle = '#8D95A8';
            g.fillRect(W * 0.86, gy - H * 0.16, 3, H * 0.16);
            g.fillStyle = vgrad(g, gy - H * 0.16, gy - H * 0.11, [
                '#FF8C8C',
                '#C2303C'
            ]);
            g.fillRect(W * 0.86 + 3, gy - H * 0.16, H * 0.07, H * 0.045);
        } else if (o.ground === 'mars') {
            g.beginPath();
            g.moveTo(0, H);
            for(let i = 0; i <= 40; i++)g.lineTo(i / 40 * W, gy - H * 0.07 - H * 0.05 * Math.sin(i / 40 * 4 + 2));
            g.lineTo(W, H);
            g.closePath();
            g.fillStyle = vgrad(g, gy - H * 0.12, H, [
                '#E9875A',
                '#B8452C'
            ]);
            g.fill();
            g.beginPath();
            g.moveTo(0, H);
            for(let i = 0; i <= 40; i++)g.lineTo(i / 40 * W, gy + H * 0.02 - H * 0.03 * Math.sin(i / 40 * 7));
            g.lineTo(W, H);
            g.closePath();
            g.fillStyle = vgrad(g, gy - H * 0.02, H, [
                '#D46A40',
                '#8E2E1E'
            ]);
            g.fill();
            for (const [x, s] of [
                [
                    0.1,
                    1
                ],
                [
                    0.34,
                    0.6
                ],
                [
                    0.7,
                    0.8
                ],
                [
                    0.9,
                    1.2
                ]
            ]){
                const X = W * x, Y = gy + H * 0.06, r = m * 0.03 * s;
                ball(g, X, Y, r, [
                    '#E9A07A',
                    '#A9472E',
                    '#6A2418'
                ]);
            }
        } else {
            const cx = W * 0.5, cy = H * 0.98, rw = W * 0.62;
            g.fillStyle = vgrad(g, cy - H * 0.12, cy + H * 0.1, [
                '#8E6BE8',
                '#5B3FC4',
                '#2E1C78'
            ]);
            g.beginPath();
            g.ellipse(cx, cy, rw, H * 0.14, 0, Math.PI, TAU);
            g.lineTo(cx + rw * 0.7, cy + H * 0.1);
            g.lineTo(cx - rw * 0.7, cy + H * 0.1);
            g.closePath();
            g.fill();
            for (const [dx, h, col] of [
                [
                    -0.35,
                    0.16,
                    '120,240,230'
                ],
                [
                    -0.15,
                    0.1,
                    '255,140,210'
                ],
                [
                    0.22,
                    0.13,
                    '255,214,90'
                ],
                [
                    0.42,
                    0.09,
                    '170,140,255'
                ]
            ]){
                const X = cx + rw * dx, Y = cy - H * 0.11, hh = H * h;
                const gr = g.createRadialGradient(X, Y - hh * 0.5, 0, X, Y - hh * 0.5, hh * 1.2);
                gr.addColorStop(0, `rgba(${col},.5)`);
                gr.addColorStop(1, `rgba(${col},0)`);
                g.fillStyle = gr;
                circle(g, X, Y - hh * 0.5, hh * 1.2);
                const cg = g.createLinearGradient(X - hh * 0.2, 0, X + hh * 0.2, 0);
                cg.addColorStop(0, `rgba(${col},1)`);
                cg.addColorStop(1, `rgba(${col},.6)`);
                g.fillStyle = cg;
                g.beginPath();
                g.moveTo(X - hh * 0.18, Y);
                g.lineTo(X, Y - hh);
                g.lineTo(X + hh * 0.18, Y);
                g.closePath();
                g.fill();
                g.fillStyle = 'rgba(255,255,255,.55)';
                g.beginPath();
                g.moveTo(X - hh * 0.1, Y - hh * 0.1);
                g.lineTo(X, Y - hh * 0.92);
                g.lineTo(X - hh * 0.02, Y - hh * 0.1);
                g.closePath();
                g.fill();
            }
        }
    }
    return {
        resize (w, h, dpr) {
            W = w;
            H = h;
            D = dpr;
            const [c, g] = layer(W, H, D);
            base = c;
            paintBase(g);
            stars = makeStars(o.stars, 0.75);
            glow = glowSprite('220,225,255');
            dust = o.dust ? Array.from({
                length: 40
            }, ()=>({
                    x: Math.random(),
                    y: rnd(0.4, 1),
                    vx: rnd(0.01, 0.04),
                    r: rnd(1, 2.6),
                    a: rnd(0.15, 0.4)
                })) : [];
        },
        frame (g, t, dt) {
            if (!base || !glow) return;
            g.setTransform(1, 0, 0, 1, 0, 0);
            if (o.clearSky) g.clearRect(0, 0, g.canvas.width, g.canvas.height);
            g.drawImage(base, 0, 0);
            g.setTransform(D, 0, 0, D, 0, 0);
            drawStars(g, stars, W, H, t, glow);
            shoot.next -= dt;
            if (shoot.next <= 0 && shoot.life >= 1) {
                const sp = Math.max(W, H) * rnd(0.8, 1.1), a = Math.PI * rnd(0.72, 0.82);
                shoot = {
                    x: rnd(W * 0.3, W),
                    y: rnd(0, H * 0.25),
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp,
                    life: 0,
                    next: rnd(3, 6)
                };
            }
            if (shoot.life < 1) {
                shoot.life += dt / 0.9;
                shoot.x += shoot.vx * dt;
                shoot.y += shoot.vy * dt;
                const a = Math.sin(Math.PI * Math.min(1, shoot.life)), tx = shoot.x - shoot.vx * 0.14, ty = shoot.y - shoot.vy * 0.14;
                const gr = g.createLinearGradient(shoot.x, shoot.y, tx, ty);
                gr.addColorStop(0, `rgba(255,255,255,${a})`);
                gr.addColorStop(1, 'rgba(180,200,255,0)');
                g.strokeStyle = gr;
                g.lineWidth = 2.2;
                g.beginPath();
                g.moveTo(shoot.x, shoot.y);
                g.lineTo(tx, ty);
                g.stroke();
            }
            for (const d of dust){
                d.x += d.vx * dt;
                if (d.x > 1.05) d.x = -0.05;
                g.fillStyle = `rgba(255,200,170,${d.a})`;
                circle(g, d.x * W, d.y * H + Math.sin(t + d.x * 9) * 6, d.r);
            }
        }
    };
}
/* ---------------- tambahan Misi 3M: bandar, kota, laut, taman ---------------- */
const roundRect = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
const HOUSE = [['#FFD6E0', '#FF8FA3', '#D4506C'], ['#FFF4B8', '#FFD24A', '#E09A12'], ['#D2F7E8', '#76DDB5', '#2E9E73'], ['#D6EEFF', '#82CCFF', '#3A86D0'], ['#E6DCFF', '#A78BFA', '#6A48D0']];
function town(g, W, H, m) {
  const base = H * 0.7, s = Math.max(0.7, m / 700);
  let x = -20;
  let i = 0;
  while (x < W + 40) {
    const w = (70 + ((i * 37) % 40)) * s, h = (60 + ((i * 53) % 50)) * s, tone = HOUSE[i % HOUSE.length];
    g.fillStyle = vgrad(g, base - h, base, [tone[0], tone[1]]); roundRect(g, x, base - h, w, h + 4, 6 * s); g.fill();
    g.fillStyle = vgrad(g, base - h - 40 * s, base - h, [tone[1], tone[2]]);
    g.beginPath(); g.moveTo(x - 8 * s, base - h + 4); g.lineTo(x + w / 2, base - h - 38 * s); g.lineTo(x + w + 8 * s, base - h + 4); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(x - 2 * s, base - h + 2); g.lineTo(x + w / 2, base - h - 32 * s); g.lineTo(x + w * 0.3, base - h + 2); g.closePath(); g.fill();
    for (let k = 0; k < 2; k++) { g.fillStyle = vgrad(g, base - h + 14 * s, base - h + 34 * s, ['#FFFDF0', '#BFE6FF']); roundRect(g, x + w * (0.18 + k * 0.44), base - h + 14 * s, w * 0.2, 18 * s, 4 * s); g.fill(); }
    g.fillStyle = vgrad(g, base - 30 * s, base, ['#C98A55', '#7A4A22']); roundRect(g, x + w * 0.4, base - 30 * s, w * 0.2, 30 * s, 5 * s); g.fill();
    x += w + 14 * s; i++;
  }
  g.fillStyle = vgrad(g, base, base + 18, ['#E9E2F5', '#CFC4E6']); g.fillRect(0, base, W, 16);
}
function city(g, W, H, m) {
  const base = H * 0.72, s = Math.max(0.7, m / 700);
  let x = -10, i = 0;
  const T = [['#FFE1C2', '#FFB27A', '#D97A3A'], ['#FFF0C8', '#FFD27A', '#D9A23A'], ['#FFD6E0', '#FF9FB2', '#D4607C'], ['#E6DCFF', '#B7A2FF', '#7A5ADA']];
  while (x < W + 30) {
    const w = (54 + ((i * 29) % 34)) * s, h = (110 + ((i * 71) % 120)) * s, tone = T[i % T.length];
    const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, tone[0]); gr.addColorStop(0.5, tone[1]); gr.addColorStop(1, tone[2]);
    g.fillStyle = gr; roundRect(g, x, base - h, w, h + 6, 8 * s); g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)';
    for (let yy = base - h + 14 * s; yy < base - 20 * s; yy += 22 * s) for (let xx = x + 9 * s; xx < x + w - 14 * s; xx += 17 * s) { roundRect(g, xx, yy, 9 * s, 12 * s, 2.5 * s); g.fill(); }
    if (i % 3 === 1) { const cx = x + w / 2, cy = base - h - 22 * s; ball(g, cx, cy, 16 * s, ['#FFFFFF', '#FFF0D6', '#E0B98A']); g.fillStyle = '#E2722A'; g.font = `700 ${22 * s}px Fredoka, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(['+', '−', '='][i % 3 === 1 ? (i / 3 | 0) % 3 : 0], cx, cy + 1); }
    x += w + 8 * s; i++;
  }
}
function sea(g, W, H, m) {
  const top = H * 0.62;
  g.fillStyle = vgrad(g, top, H, ['#9FE3FF', '#4FB7F0', '#2C86C9']); g.fillRect(0, top, W, H - top);
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, top, W, 3);
  const cx = W * 0.5, rw = Math.min(W * 0.46, 520), cy = H * 0.8;
  g.fillStyle = vgrad(g, cy - 60, cy + 40, ['#FFF1C2', '#F2D08A']); g.beginPath(); g.ellipse(cx, cy, rw, 46, 0, 0, TAU); g.fill();
  g.fillStyle = vgrad(g, cy - 70, cy, ['#A6EB8C', '#5FC24A']); g.beginPath(); g.ellipse(cx, cy - 14, rw * 0.82, 34, 0, Math.PI, TAU); g.fill();
}
function waves(g, t, W, H) {
  const top = H * 0.62;
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.4; g.lineCap = 'round';
  for (let k = 0; k < 4; k++) {
    const y = top + 24 + k * 34;
    g.beginPath();
    for (let x = -20; x <= W + 20; x += 18) { const yy = y + Math.sin(x * 0.03 + t * 1.6 + k) * 3; if (x === -20) g.moveTo(x, yy); else g.lineTo(x, yy); }
    g.globalAlpha = 0.35 + 0.15 * k; g.stroke();
  }
  g.globalAlpha = 1;
}
const FLW = [['#FFD6E0', '#FF77B7'], ['#FFF4B8', '#FFC53D'], ['#E6DCFF', '#9C7CFF'], ['#D6EEFF', '#5AA9F0']];
function flowers(g, W, H, m) {
  const s = Math.max(0.6, m / 800);
  for (let i = 0; i < W / (26 * s); i++) {
    const x = i * 26 * s + ((i * 13) % 11), y = H * (0.9 + ((i * 7) % 5) * 0.012), c = FLW[i % FLW.length];
    g.strokeStyle = '#3E9038'; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x, y + 14 * s); g.lineTo(x, y); g.stroke();
    for (let p = 0; p < 5; p++) { const a = (p / 5) * TAU; g.fillStyle = c[0]; circle(g, x + Math.cos(a) * 5 * s, y + Math.sin(a) * 5 * s, 4.2 * s); }
    g.fillStyle = c[1]; circle(g, x, y, 3 * s);
  }
}

const WORLDS = {
  welcome: () => meadowScene({ sky: ['#8ED3FF', '#C9ECFF', '#FFF6E8'], far: ['#C6F2A8', '#8FD86E'], near: ['#9EE07E', '#5CB84B'], ground: ['#7AD45E', '#45A339'], blades: ['#5FC24A', '#7AD65A', '#4BAE3C'], clouds: 6, rainbow: true, balloons: 3, birds: 3, butterflies: 2, trees: [{ x: 0.06, y: 0.8, s: 1 }, { x: 0.96, y: 0.82, s: 1.1 }] }),
  map: () => meadowScene({ sky: ['#9EDBFF', '#D2F0FF', '#FFF9EF'], clouds: 7, balloons: 2, birds: 3, butterflies: 0, trees: [] }),
  huruf: () => meadowScene({ sky: ['#7FD9C0', '#BFF0D6', '#EFFFF0'], far: ['#7FD06A', '#4E9E45'], near: ['#6CC85A', '#3E9038'], ground: ['#5FC24A', '#2F7E2C'], blades: ['#4BAE3C', '#3E9E33', '#6CC85A', '#2F7E2C'], clouds: 3, pines: true, butterflies: 3, fireflies: 14, mushrooms: true, trees: [{ x: 0.03, y: 0.8, s: 1.25, deep: true }, { x: 0.13, y: 0.84, s: 0.8 }, { x: 0.9, y: 0.82, s: 1.1, deep: true }, { x: 1.0, y: 0.78, s: 1.3 }] }),
  sukukata: () => meadowScene({ sky: ['#7FC4FF', '#BFE3FF', '#FFE8F4'], clouds: 6, rainbow: true, balloons: 3, birds: 4, butterflies: 0, extra: sea, dyn: waves, trees: [{ x: 0.36, y: 0.79, s: 0.75 }, { x: 0.62, y: 0.78, s: 0.9 }] }),
  perkataan: () => meadowScene({ sky: ['#FFC2D1', '#FFE2EA', '#FFF6EE'], far: ['#C6F2A8', '#8FD86E'], near: ['#9EE07E', '#5CB84B'], ground: ['#7AD45E', '#45A339'], blades: ['#5FC24A', '#7AD65A'], clouds: 5, birds: 3, butterflies: 1, extra: town, trees: [{ x: 0.02, y: 0.84, s: 0.9 }, { x: 0.98, y: 0.84, s: 1 }] }),
  ayat: () => meadowScene({ sky: ['#B9A7FF', '#DCD2FF', '#FFF0FA'], far: ['#C6F2A8', '#8FD86E'], near: ['#A8E68C', '#5CB84B'], ground: ['#86D96A', '#4BAE3C'], blades: ['#5FC24A', '#7AD65A'], clouds: 4, butterflies: 3, rainbow: true, extraFront: flowers, trees: [{ x: 0.05, y: 0.82, s: 1.1 }, { x: 0.93, y: 0.84, s: 1 }, { x: 0.8, y: 0.8, s: 0.7, deep: true }] }),
  nombor: () => spaceScene({ sky: ['#1B1446', '#33246E', '#56349A'], stars: 150, ground: 'moon', nebula: ['255,206,70', '150,90,255', '255,120,190'], planet: { x: 0.82, y: 0.2, r: 0.1, tones: ['#FFF4B8', '#FFD24A', '#E09A12'], atm: '255,214,90', ring: true }, moons: [{ x: 0.16, y: 0.16, r: 0.025 }] }),
  matematik: () => meadowScene({ sky: ['#FFB46B', '#FFD6A0', '#FFF1DC'], near: ['#A8E68C', '#5CB84B'], ground: ['#86D96A', '#4BAE3C'], blades: ['#5FC24A', '#7AD65A'], clouds: 4, balloons: 2, birds: 2, butterflies: 0, extra: city, trees: [{ x: 0.03, y: 0.85, s: 0.9 }, { x: 0.97, y: 0.86, s: 0.85 }] }),
};
const DARK = new Set(['nombor']);

/** Satu kanvas latar pada satu masa. Berhenti bila tab tersembunyi; statik bila gerak dikurangkan. */
const Backdrop = {
  canvas: null, scene: null, world: null, raf: 0, t: 0, last: 0, still: false, ro: null,
  mount(canvas, world, still) {
    this.stop();
    this.canvas = canvas; this.world = world; this.still = !!still;
    this.scene = (WORLDS[world] || WORLDS.map)();
    const fit = () => { const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return; const dpr = Math.min(2, root.devicePixelRatio || 1); canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); this.scene.resize(r.width, r.height, dpr); this.scene.frame(canvas.getContext('2d'), this.t, 0); };
    fit();
    this.ro = new ResizeObserver(fit); this.ro.observe(canvas);
    if (!this.still) this.loop();
  },
  loop() {
    const ctx = this.canvas.getContext('2d');
    this.last = performance.now();
    const step = (now) => {
      if (!this.canvas) return;
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      if (!document.hidden) { this.t += dt; this.scene.frame(ctx, this.t, dt); }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  },
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; if (this.ro) this.ro.disconnect(); this.ro = null; this.canvas = null; },
};
root.Scenes = { WORLDS, DARK, Backdrop };

})(window);
