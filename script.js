/* ============================================================================
   BRAIN MASTER — TO'LIQ ISHLAYDIGAN 40 TA O'YIN VA PLATFORMASI (VANILLA JS)
   ============================================================================ */

// ==================== 1. OVOZ EFFEKTLARI (WEB AUDIO API) ====================
class SoundEngine {
    constructor() {
        this.enabled = true;
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
    }
    playTone(freq, type = 'sine', duration = 0.18, gainVal = 0.14) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    click() { this.playTone(520, 'sine', 0.08, 0.08); }
    correct() {
        this.playTone(587.33, 'triangle', 0.12, 0.15);
        setTimeout(() => this.playTone(880, 'triangle', 0.22, 0.15), 90);
    }
    wrong() {
        this.playTone(220, 'sawtooth', 0.18, 0.12);
        setTimeout(() => this.playTone(165, 'sawtooth', 0.24, 0.12), 110);
    }
    countdown(isGo = false) {
        this.playTone(isGo ? 880 : 440, 'sine', isGo ? 0.3 : 0.14, 0.14);
    }
    win() {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.15), i * 110);
        });
    }
    animalSound(animal) {
        const map = {
            "It": [320, 260], "Mushuk": [680, 540], "Sigir": [140, 130],
            "Xo'roz": [750, 920], "Qo'y": [360, 340], "Qurbaqa": [240, 420],
            "Arslon": [110, 95], "Qush": [1100, 1350], "Bo'ri": [280, 460], "O'rdak": [430, 390]
        };
        const freqs = map[animal] || [440, 550];
        this.playTone(freqs[0], 'sawtooth', 0.2, 0.14);
        setTimeout(() => this.playTone(freqs[1], 'triangle', 0.28, 0.14), 160);
    }
}
const sfx = new SoundEngine();

// ==================== 2. KONFETTI ANIMATSIYASI ====================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#a855f7', '#f43f5e'];
    const pieces = Array.from({ length: 130 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 2.5,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 10
    }));

    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.vrot;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        if (frame < 150) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
}

// ==================== 3. SAVOLLAR BAZALARI VA GENERATORLAR ====================
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// --- 4–8 YOSH: KICHKINTOYLAR FUNKSIYALARI ---
const kidsGenerators = {
    // 1. Ranglarni top
    kids_1: () => {
        const items = [
            { name: "Qizil", hex: "#ef4444", obj: "🍓 Qulupnay" },
            { name: "Ko'k", hex: "#3b82f6", obj: "🐳 Kit" },
            { name: "Yashil", hex: "#10b981", obj: "🐸 Qurbaqa" },
            { name: "Sariq", hex: "#eab308", obj: "🍌 Banan" },
            { name: "To'q sariq", hex: "#f97316", obj: "🍊 Apelsin" },
            { name: "Binafsha", hex: "#a855f7", obj: "🍇 Uzum" },
            { name: "Pushti", hex: "#ec4899", obj: "🌸 Gul" },
            { name: "Jigarrang", hex: "#92400e", obj: "🐻 Ayiq" }
        ];
        const target = rand(items);
        const opts = shuffle([target, ...shuffle(items.filter(i => i.name !== target.name)).slice(0, 3)]);
        return {
            type: 'mcq',
            prompt: `Qaysi rang "${target.name}" rang hisoblanadi? (${target.obj})`,
            visualHtml: `<div style="width:90px;height:90px;border-radius:50%;background:${target.hex};margin:0 auto;box-shadow:0 0 25px ${target.hex}"></div>`,
            options: opts.map(o => o.name),
            answer: target.name
        };
    },
    // 2. Hayvonlar ovozini top
    kids_2: () => {
        const animals = [
            { name: "It", emoji: "🐶", sound: "Vov-vov! Akillaydi va uyni qo'riqlaydi." },
            { name: "Mushuk", emoji: "🐱", sound: "Miyov-miyov! Sut ichishni yaxshi ko'radi." },
            { name: "Sigir", emoji: "🐮", sound: "Mooo-mooo! Bizga mazali sut beradi." },
            { name: "Xo'roz", emoji: "🐓", sound: "Qu-qu-ri-quuu! Ertalab hammani uyg'otadi." },
            { name: "Qo'y", emoji: "🐑", sound: "Baaa-baaa! Junidan issiq kiyim to'qiladi." },
            { name: "Qurbaqa", emoji: "🐸", sound: "Va-vaq, va-vaq! Suvda sakrab yuradi." },
            { name: "Arslon", emoji: "🦁", sound: "Rrrrr! O'rmon shohi bo'lib na'ra tortadi." },
            { name: "O'rdak", emoji: "🦆", sound: "G'aq-g'aq! Ko'lda suzib yuradi." }
        ];
        const target = rand(animals);
        const opts = shuffle([target, ...shuffle(animals.filter(a => a.name !== target.name)).slice(0, 3)]);
        return {
            type: 'mcq',
            prompt: `Bu qaysi hayvonning ovozi? "${target.sound}"`,
            visualHtml: `<button type="button" class="secondary-btn" onclick="sfx.animalSound('${target.name}')">🔊 Ovozni tinglash</button>`,
            options: opts.map(o => `${o.emoji} ${o.name}`),
            answer: `${target.emoji} ${target.name}`,
            onRender: () => sfx.animalSound(target.name)
        };
    },
    // 3. Bir xil rasmlarni juftlashtir
    kids_3: () => {
        const pool = ["🍎", "🐶", "🚗", "🌟", "🎈", "🦋", "🍦", "⚽"];
        const chosen = shuffle(pool).slice(0, 4);
        const deck = shuffle([...chosen, ...chosen]);
        return {
            type: 'memory_match',
            prompt: "Bir xil rasmlarni topib juftlashtiring!",
            deck
        };
    },
    // 4. Shakllarni joylashtir
    kids_4: () => {
        const shapes = [
            { name: "Doira", icon: "🔴", desc: "Burchaklari yo'q, dumaloq shakl" },
            { name: "Kvadrat", icon: "🟦", desc: "4 ta teng tomoni va 4 ta burchagi bor" },
            { name: "Uchburchak", icon: "🔺", desc: "3 ta tomoni va 3 ta burchagi bor" },
            { name: "Yulduz", icon: "⭐", desc: "5 ta uchli nurga ega shakl" },
            { name: "Romb", icon: "🔶", desc: "Qiyshaygan kvadratga o'xshash 4 burchak" },
            { name: "Yurak", icon: "❤️", desc: "Mehr ramzi bo'lgan chiroyli shakl" }
        ];
        const target = rand(shapes);
        const opts = shuffle([target, ...shuffle(shapes.filter(s => s.name !== target.name)).slice(0, 3)]);
        return {
            type: 'mcq',
            prompt: `To'g'ri shaklni joylashtiring: "${target.desc}"`,
            visual: "❓",
            options: opts.map(o => `${o.icon} ${o.name}`),
            answer: `${target.icon} ${target.name}`
        };
    },
    // 5. Mevalarni ajrat
    kids_5: () => {
        const fruits = ["🍎 Olma", "🍌 Banan", "🍇 Uzum", "🍓 Qulupnay", "🍉 Tarvuz", "🍒 Gilos", "🍍 Ananas", "🍑 Shaftoli"];
        const others = ["🥕 Sabzi", "🥔 Kartoshka", "🚕 Taksi", "⚽ To'p", "📚 Kitob", "🧸 Ayiqcha", "👟 Krossovka", "⏰ Soat"];
        const correctFruit = rand(fruits);
        const wrongItems = shuffle(others).slice(0, 3);
        return {
            type: 'mcq',
            prompt: "Quyidagilar orasidan MEVANI ajratib ko'rsating!",
            visual: "🧺 ❓",
            options: shuffle([correctFruit, ...wrongItems]),
            answer: correctFruit
        };
    },
    // 6. Sonlarni sanash
    kids_6: (lvl) => {
        const emojis = ["🍎", "🐥", "⭐", "🎈", "🦋", "🍓", "🐠"];
        const item = rand(emojis);
        const count = randInt(2, Math.min(12, 5 + lvl));
        return {
            type: 'mcq',
            prompt: `Rasmda nechta ${item} bor? Sanab ko'ring!`,
            visual: Array(count).fill(item).join(" "),
            options: shuffle([count, count + 1, Math.max(1, count - 1), count + 2].map(String)),
            answer: String(count)
        };
    },
    // 7. Rasmdagi farqni top
    kids_7: () => {
        const sets = [
            { base: "🐶", diff: "🐺", label: "Bo'ri" },
            { base: "🍎", diff: "🍅", label: "Pomidor" },
            { base: "😀", diff: "😉", label: "Ko'z qisgan smayl" },
            { base: "🚗", diff: "🚕", label: "Taksi" },
            { base: "🌕", diff: "🌞", label: "Quyosh" },
            { base: "🐱", diff: "🐯", label: "Yo'lbars" }
        ];
        const s = rand(sets);
        const pos = randInt(0, 7);
        const grid = Array.from({ length: 8 }, (_, idx) => (idx === pos ? s.diff : s.base));
        return {
            type: 'spot_diff',
            prompt: "Boshqalaridan farq qiladigan rasmni bosing!",
            grid,
            answerIdx: pos
        };
    },
    // 8. Xotira kartalari
    kids_8: () => {
        const pool = ["🦁", "🐼", "🦊", "🐸", "🦄", "🐙"];
        const chosen = shuffle(pool).slice(0, 4);
        return {
            type: 'memory_match',
            prompt: "Xotira kartalarini oching va bir xil hayvonlarni toping!",
            deck: shuffle([...chosen, ...chosen])
        };
    },
    // 9. Qaysi rasm ortiqcha?
    kids_9: () => {
        const groups = [
            { items: ["🍎 Olma", "🍌 Banan", "🍇 Uzum"], odd: "🚗 Mashina" },
            { items: ["🐶 It", "🐱 Mushuk", "🐰 Quyon"], odd: "✈️ Samolyot" },
            { items: ["🔴 Doira", "🟦 Kvadrat", "🔺 Uchburchak"], odd: "🍦 Muzqaymoq" },
            { items: ["☀️ Quyosh", "🌙 Oy", "⭐ Yulduz"], odd: "👟 Oyoq kiyim" },
            { items: ["🎸 Gitara", "🎹 Pianino", "🥁 Baraban"], odd: "🥦 Karam" }
        ];
        const g = rand(groups);
        return {
            type: 'mcq',
            prompt: "Qaysi rasm mantiqan ortiqcha?",
            visual: shuffle([...g.items, g.odd]).map(x => x.split(" ")[0]).join("  "),
            options: shuffle([...g.items, g.odd]),
            answer: g.odd
        };
    },
    // 10. Oddiy matematik misollar
    kids_10: (lvl) => {
        const a = randInt(1, 5 + lvl * 2);
        const b = randInt(1, 5 + lvl);
        const isAdd = Math.random() > 0.35;
        const ans = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);
        const expr = isAdd ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`;
        const opts = new Set([ans]);
        while (opts.size < 4) opts.add(Math.max(0, ans + randInt(-3, 4)));
        return {
            type: 'mcq',
            prompt: "Oddiy misolni yeching:",
            visual: expr,
            options: shuffle([...opts].map(String)),
            answer: String(ans)
        };
    }
};

// --- 9–14 YOSH: YOSH DAHOLAR FUNKSIYALARI ---
const juniorsGenerators = {
    // 1. Matematik jang
    juniors_1: (lvl) => {
        const a = randInt(6, 15 + lvl * 3);
        const b = randInt(3, 12 + lvl * 2);
        const op = rand(["+", "-", "×"]);
        const ans = op === "+" ? a + b : op === "-" ? a - b : a * randInt(2, 9);
        const promptExpr = op === "×" ? `${a} × ${ans / a}` : `${a} ${op} ${b}`;
        const opts = new Set([ans]);
        while (opts.size < 4) opts.add(ans + randInt(-8, 9));
        return {
            type: 'mcq',
            prompt: "Matematik jangda g'olib bo'lish uchun to'g'ri javobni tanlang!",
            visual: `${promptExpr} = ?`,
            options: shuffle([...opts].map(String)),
            answer: String(ans)
        };
    },
    // 2. Xotira chempioni
    juniors_2: (lvl) => {
        const len = Math.min(8, 4 + Math.floor(lvl / 2));
        const digits = Array.from({ length: len }, () => randInt(1, 9)).join("");
        return {
            type: 'flash_memory',
            prompt: "Raqamlar ketma-ketligini eslab qoling va kiriting!",
            secret: digits,
            showMs: 2400
        };
    },
    // 3. Mantiqiy jumboqlar
    juniors_3: () => {
        const riddles = [
            { q: "Agar 3 ta mushuk 3 ta sichqonni 3 daqiqada tutsa, 100 ta mushuk 100 ta sichqonni necha daqiqada tutadi?", opts: ["3 daqiqada", "100 daqiqada", "1 daqiqada", "30 daqiqada"], a: "3 daqiqada" },
            { q: "Yilning nechta oyida 28 kun bor?", opts: ["Barcha 12 oyda", "Faqat 1 oyda", "6 oyda", "2 oyda"], a: "Barcha 12 oyda" },
            { q: "Yugurish musobaqasida 2-o'rindagi ishtirokchini quvib o'tsangiz, nechanchi o'ringa chiqasiz?", opts: ["2-o'ringa", "1-o'ringa", "3-o'ringa", "Oxirgi o'ringa"], a: "2-o'ringa" },
            { q: "U sizga tegishli, lekin undan boshqalar sizdan ko'ra ko'proq foydalanadi. Bu nima?", opts: ["Ismingiz", "Telefoningiz", "Kitobingiz", "Ruchkangiz"], a: "Ismingiz" },
            { q: "Qaysi idishdan hech qachon ovqat yeb bo'lmaydi?", opts: ["Bo'sh idishdan", "Katta idishdan", "Chuqur idishdan", "Issiq idishdan"], a: "Bo'sh idishdan" },
            { q: "Daraxt shoxida 5 ta qush o'tirgan edi. Ovchi 1 tasini otdi. Shoxda nechta qush qoldi?", opts: ["0 ta (qolganlari uchib ketdi)", "4 ta", "5 ta", "1 ta"], a: "0 ta (qolganlari uchib ketdi)" }
        ];
        const r = rand(riddles);
        return { type: 'mcq', prompt: r.q, visual: "🧩 MANTIQIY JUMBOG'", options: shuffle(r.opts), answer: r.a };
    },
    // 4. Tezkor hisoblash
    juniors_4: (lvl) => {
        const a = randInt(10, 40 + lvl * 5);
        const b = randInt(10, 35 + lvl * 4);
        const ans = a + b;
        return {
            type: 'input',
            prompt: "Tezkor hisoblang va javobni yozing:",
            visual: `${a} + ${b} = ?`,
            answer: String(ans)
        };
    },
    // 5. So'z topish
    juniors_5: () => {
        const words = [
            { word: "MANTIQ", hint: "Aql va tafakkur qonuniyatlari fani" },
            { word: "KOSMOS", hint: "Yulduzlar va sayyoralar joylashgan kenglik" },
            { word: "ALGORITM", hint: "Masalani yechish uchun aniq qadamlar ketma-ketligi" },
            { word: "DASTUR", hint: "Kompyuter bajaradigan buyruqlar majmui" },
            { word: "ZAKOVAT", hint: "O'tkir aql va donolik" },
            { word: "CHEMPION", hint: "Musobaqa g'olibi" },
            { word: "GALAKTIKA", hint: "Milliardsiz yulduzlar tizimi" }
        ];
        const w = rand(words);
        const scrambled = shuffle(w.word.split("")).join(" ");
        return {
            type: 'input',
            prompt: `Aralashgan harflardan to'g'ri so'zni tuzing! (Maslahat: ${w.hint})`,
            visual: scrambled,
            answer: w.word
        };
    },
    // 6. Ketma-ketlikni davom ettir
    juniors_6: (lvl) => {
        const start = randInt(2, 10);
        const step = randInt(2, 6 + lvl);
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const ans = start + step * 4;
        const opts = new Set([ans]);
        while (opts.size < 4) opts.add(ans + randInt(-6, 8));
        return {
            type: 'mcq',
            prompt: "Sonlar ketma-ketligidagi keyingi sonni toping:",
            visual: `${seq.join(", ")}, ?`,
            options: shuffle([...opts].map(String)),
            answer: String(ans)
        };
    },
    // 7. Kodni yech
    juniors_7: () => {
        const codes = [
            { clue: "A=1, B=2, D=4, O=15 → 'ODOB' kodi nechaga teng?", ans: "15-4-15-2", opts: ["15-4-15-2", "15-2-15-4", "14-4-14-2", "15-5-15-2"] },
            { clue: "Agar 123 = 'KOD' va 456 = 'SIR' bo'lsa, 153 nimani bildiradi?", ans: "KID", opts: ["KID", "KOD", "SOD", "KIR"] },
            { clue: "Har bir harf alifboda 1 ta oldinga surilgan: 'B R M' aslida qaysi so'z?", ans: "AQL", opts: ["AQL", "ASR", "BQL", "OQL"] },
            { clue: "2★3 = 7, 3★4 = 13, 4★5 = 21 bo'lsa, 5★6 = ?", ans: "31", opts: ["31", "30", "29", "25"] }
        ];
        const c = rand(codes);
        return { type: 'mcq', prompt: c.clue, visual: "🔐 MAXFIY KOD", options: shuffle(c.opts), answer: c.ans };
    },
    // 8. Shakllar labirinti
    juniors_8: () => {
        const mazes = [
            [
                [0, 1, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 1, 0],
                [1, 1, 0, 1, 0],
                [0, 0, 0, 0, 2]
            ],
            [
                [0, 0, 0, 1, 0],
                [1, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1],
                [0, 0, 0, 0, 2]
            ]
        ];
        return {
            type: 'maze',
            prompt: "🤖 Robotni to'siqlardan o'tkazib 🏁 bayroqqa yetkazing!",
            grid: rand(mazes)
        };
    },
    // 9. Diqqatni sinash
    juniors_9: () => {
        const colors = [
            { word: "QIZIL", color: "#3b82f6", realColorName: "Ko'k" },
            { word: "YASHIL", color: "#ef4444", realColorName: "Qizil" },
            { word: "KO'K", color: "#eab308", realColorName: "Sariq" },
            { word: "SARIQ", color: "#10b981", realColorName: "Yashil" }
        ];
        const c = rand(colors);
        return {
            type: 'mcq',
            prompt: "So'zning ma'nosiga EMAS, uning RANGIGA qarang! Bu so'z qaysi rangda yozilgan?",
            visualHtml: `<div style="font-size:2.6rem;font-weight:900;color:${c.color}">${c.word}</div>`,
            options: shuffle(["Qizil", "Ko'k", "Yashil", "Sariq"]),
            answer: c.realColorName
        };
    },
    // 10. Sirli savollar
    juniors_10: () => {
        const qs = [
            { q: "Qaysi sayyora Quyosh tizimidagi eng katta sayyora hisoblanadi?", opts: ["Yupiter", "Saturn", "Mars", "Yer"], a: "Yupiter" },
            { q: "Inson tanasidagi eng katta a'zo qaysi?", opts: ["Teri", "Jigar", "Yurak", "O'pka"], a: "Teri" },
            { q: "Yorug'lik tezligi taxminan sekundiga necha kilometr?", opts: ["300 000 km/s", "150 000 km/s", "30 000 km/s", "3 000 km/s"], a: "300 000 km/s" },
            { q: "Shaxmat taxtasida jami nechta katak bor?", opts: ["64 ta", "32 ta", "48 ta", "81 ta"], a: "64 ta" },
            { q: "Suv necha gradus Selsiyda qaynaydi (normal bosimda)?", opts: ["100°C", "90°C", "120°C", "80°C"], a: "100°C" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "🔮 SIRLI SAVOL", options: shuffle(item.opts), answer: item.a };
    }
};

// --- 15–20 YOSH: BRAIN CHALLENGE FUNKSIYALARI ---
const teensGenerators = {
    // 1. IQ Challenge
    teens_1: () => {
        const qs = [
            { q: "Agar barcha Bloplar — Ziplar bo'lsa, va ba'zi Ziplar — Loolar bo'lsa, quyidagilardan qaysi biri albatta to'g'ri?", opts: ["Yuqoridagilarning hech biri aniq emas", "Barcha Bloplar Loolardir", "Hech bir Blop Loo emas", "Barcha Loolar Bloplardir"], a: "Yuqoridagilarning hech biri aniq emas" },
            { q: "2, 6, 12, 20, 30, ? — Ketma-ketlikning keyingi hadini toping:", opts: ["42", "40", "38", "44"], a: "42" },
            { q: "Soat 3:15 ni ko'rsatmoqda. Soat va daqiqa millari orasidagi burchak necha gradus?", opts: ["7.5°", "0°", "15°", "5°"], a: "7.5°" },
            { q: "5 ta mashina 5 ta detalni 5 daqiqada yasaydi. 100 ta mashina 100 ta detalni necha daqiqada yasaydi?", opts: ["5 daqiqada", "100 daqiqada", "20 daqiqada", "1 daqiqada"], a: "5 daqiqada" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "🧠 IQ TEST", options: shuffle(item.opts), answer: item.a };
    },
    // 2. Murakkab matematik masalalar
    teens_2: (lvl) => {
        const x = randInt(4, 12 + lvl);
        const a = randInt(2, 5);
        const b = randInt(3, 15);
        const res = a * x * x - b;
        return {
            type: 'input',
            prompt: `Tenglamani yeching (x > 0): ${a}x² - ${b} = ${res}`,
            visual: `x = ?`,
            answer: String(x)
        };
    },
    // 3. Kriptografik kodlarni yechish
    teens_3: () => {
        const ciphers = [
            { q: "Sezar shifri (+3 siljish): 'D T O' so'zini deshifrlang:", opts: ["A Q L", "B R M", "E U P", "C S N"], a: "A Q L" },
            { q: "Ikkilik sanoq tizimi (Binary): 01001010 (74) dan 00001010 (10) ni ayiring (o'nlikda):", opts: ["64", "62", "54", "68"], a: "64" },
            { q: "Atbash shifri (A↔Z, B↔Y, C↔X): 'X Z G' so'zi inglizchada nima bo'ladi?", opts: ["CAT", "DOG", "BAT", "RAT"], a: "CAT" },
            { q: "HEX kod: #FF0000 qaysi rangni ifodalaydi?", opts: ["Sof Qizil", "Sof Yashil", "Sof Ko'k", "Oq"], a: "Sof Qizil" }
        ];
        const c = rand(ciphers);
        return { type: 'mcq', prompt: c.q, visual: "🛡️ CRYPTO DECODE", options: shuffle(c.opts), answer: c.a };
    },
    // 4. Strategik qarorlar
    teens_4: () => {
        const scenarios = [
            { q: "O'yin nazariyasi (Mahbus dilemmasi): Ikkala tomon ham faqat o'z manfaatini ko'zlab sotqinlik qilsa, natija qanday bo'ladi?", opts: ["Nash muvozanati, lekin ikkalasi uchun ham yomonroq jazo", "Ikkalasi ham ozod bo'ladi", "Faqat bittasi yutadi", "O'yin to'xtaydi"], a: "Nash muvozanati, lekin ikkalasi uchun ham yomonroq jazo" },
            { q: "Resurslaringiz cheklangan: 80% natijani 20% harakat bilan beradigan vazifalarni tanlash qaysi qonunga asoslanadi?", opts: ["Pareto prinsipi", "Merfi qonuni", "Parkinson qonuni", "Moor qonuni"], a: "Pareto prinsipi" },
            { q: "Startapda raqobatchi narxni 20% tushirdi. Eng oqilona strategik javob qaysi?", opts: ["Mahsulot qiymati va noyob funksiyasini kuchaytirish", "Zararga kirsa ham narxni 50% tushirish", "Marketingni butunlay to'xtatish", "Hech narsa qilmaslik"], a: "Mahsulot qiymati va noyob funksiyasini kuchaytirish" }
        ];
        const s = rand(scenarios);
        return { type: 'mcq', prompt: s.q, visual: "♟️ STRATEGIK QAROR", options: shuffle(s.opts), answer: s.a };
    },
    // 5. Tezkor xotira
    teens_5: (lvl) => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const len = Math.min(9, 5 + Math.floor(lvl / 2));
        const code = Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join("");
        return {
            type: 'flash_memory',
            prompt: "Kodni 2 soniya ichida eslab qoling va xatosiz kiriting!",
            secret: code,
            showMs: 2000
        };
    },
    // 6. Mantiqiy detektiv
    teens_6: () => {
        const cases = [
            { q: "Qish kuni muzeydan olmos o'g'irlandi. 3 gumondor bor: Ali ('Men kutubxonada kitob o'qiyotgan edim'), Vali ('Men hovlida gul sug'orayotgan edim'), G'ani ('Men sport zalida edim'). Kim yolg'on gapiryapti?", opts: ["Vali (qishda hovlida gul sug'orilmaydi)", "Ali", "G'ani", "Hech kim"], a: "Vali (qishda hovlida gul sug'orilmaydi)" },
            { q: "Xonada chiroq o'chiq, deraza yo'q. Stol ustida shisha sinig'i va suv bor, yerda esa Romeo va Julyetta jonsiz yotibdi. Ular kim edi?", opts: ["Akvariumdagi baliqlar", "Odamlar", "Mushuklar", "Qushlar"], a: "Akvariumdagi baliqlar" },
            { q: "Detektiv xat topdi: '710 57735 34 5508'. Qog'ozni teskari (180°) o'girib o'qiganda qanday ism chiqadi?", opts: ["BOSS HE SELLS OIL", "AGENT 007", "HELP ME NOW", "SECRET CODE"], a: "BOSS HE SELLS OIL" }
        ];
        const c = rand(cases);
        return { type: 'mcq', prompt: c.q, visual: "🕵️ DETEKTIV ISHI", options: shuffle(c.opts), answer: c.a };
    },
    // 7. Matematik ketma-ketlik
    teens_7: () => {
        const seqs = [
            { s: "1, 1, 2, 3, 5, 8, 13, ?", a: "21", opts: ["21", "20", "19", "24"] },
            { s: "3, 7, 15, 31, 63, ?", a: "127", opts: ["127", "125", "120", "95"] },
            { s: "1, 4, 9, 16, 25, 36, ?", a: "49", opts: ["49", "45", "64", "42"] },
            { s: "2, 3, 5, 7, 11, 13, 17, ?", a: "19", opts: ["19", "21", "18", "23"] }
        ];
        const item = rand(seqs);
        return { type: 'mcq', prompt: "Keyingi hadni aniqlang:", visual: item.s, options: shuffle(item.opts), answer: item.a };
    },
    // 8. Reaksiya tezligi
    teens_8: () => ({
        type: 'reaction',
        prompt: "Qizil maydon YASHIL rangga kirishi bilan darhol bosing! (350ms dan tezroq bosing)",
        thresholdMs: 360
    }),
    // 9. Murakkab labirint
    teens_9: () => ({
        type: 'maze',
        prompt: "⚡ Neyron labirintdan eng qisqa yo'l bilan chiqing!",
        grid: [
            [0, 1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 2]
        ]
    }),
    // 10. Genius Quiz
    teens_10: () => {
        const qs = [
            { q: "Eynshteynning maxsus nisbiylik nazariyasidagi mashhur formula qaysi?", opts: ["E = mc²", "F = ma", "a² + b² = c²", "PV = nRT"], a: "E = mc²" },
            { q: "DNK molekulasining tuzilishi qanday shaklga ega?", opts: ["Qo'sh spiral", "Yassi uchburchak", "Kubik panjara", "Halqa"], a: "Qo'sh spiral" },
            { q: "Kompyuter protsessorida 'CPU' qisqartmasi nimani anglatadi?", opts: ["Central Processing Unit", "Computer Power Unit", "Core Program Utility", "Control Panel User"], a: "Central Processing Unit" },
            { q: "Pi (π) sonining dastlabki 5 ta raqami qaysi?", opts: ["3.1415", "3.1419", "3.1459", "3.1425"], a: "3.1415" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "⚡ GENIUS QUIZ", options: shuffle(item.opts), answer: item.a };
    }
};

// --- 22–40 YOSH: EXTREME BRAIN FUNKSIYALARI ---
const adultsGenerators = {
    // 1. Extreme IQ Test
    adults_1: () => {
        const qs = [
            { q: "Matritsa qonuniyati: [2, 4, 8] | [3, 9, 27] | [4, 16, ?] — So'roq o'rnidagi sonni toping:", opts: ["64", "32", "48", "256"], a: "64" },
            { q: "Agar 1 = 5, 2 = 25, 3 = 125, 4 = 625 bo'lsa, 5 nechaga teng?", opts: ["1 (birinchi shartga qarang)", "3125", "1250", "2500"], a: "1 (birinchi shartga qarang)" },
            { q: "12 ta tangadan bittasi soxta (og'ir yoki yengil ekani noma'lum). Pallasiz tarozida eng kamida nechta o'lchashda uni aniq topish mumkin?", opts: ["3 ta", "2 ta", "4 ta", "6 ta"], a: "3 ta" },
            { q: "Ketma-ketlik: O, T, T, F, F, S, S, E, N, ? — Keyingi harf qaysi? (Inglizcha raqamlar bosh harfi)", opts: ["T (Ten)", "E (Eleven)", "N (Nine)", "S (Six)"], a: "T (Ten)" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "👑 EXTREME IQ", options: shuffle(item.opts), answer: item.a };
    },
    // 2. Matematik Mastermind
    adults_2: () => {
        const a = randInt(12, 25);
        const b = randInt(11, 19);
        const c = randInt(15, 40);
        const ans = a * b - c;
        return {
            type: 'input',
            prompt: "Kalkulyatorsiz hisoblang:",
            visual: `(${a} × ${b}) - ${c} = ?`,
            answer: String(ans)
        };
    },
    // 3. Kriptografik shifrlar
    adults_3: () => {
        const qs = [
            { q: "RSA shifrlash algoritmi qaysi matematik muammoning murakkabligiga asoslangan?", opts: ["Katta sonlarni tub ko'paytuvchilarga ajratish", "Diskret logarifm", "Matritsalarni ko'paytirish", "Chiziqli tenglamalar"], a: "Katta sonlarni tub ko'paytuvchilarga ajratish" },
            { q: "XOR mantiqiy amali: Agar Kalit = 1011 va Shifr = 1110 bo'lsa, asl xabar (Shifr XOR Kalit) nima?", opts: ["0101", "1010", "1111", "0001"], a: "0101" },
            { q: "Vijener (Vigenère) shifrida kalit so'z 'B' (siljish +1) bo'lsa, 'X A V F' nimani anglatadi?", opts: ["W Z U E", "Y B W G", "V Y T D", "Z C X H"], a: "W Z U E" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "🔐 MASTER CIPHER", options: shuffle(item.opts), answer: item.a };
    },
    // 4. Strategik biznes qarorlari
    adults_4: () => {
        const qs = [
            { q: "Kompaniyada CAC (Mijoz jalb qilish narxi) = $120, LTV (Mijozning umrboqiy daromadi) = $110. Bu biznes modeli qanday holatda?", opts: ["Zararli — har bir yangi mijoz $10 zarar keltiradi", "Yuqori foydali", "Barqaror o'sishda", "Monopol holatda"], a: "Zararli — har bir yangi mijoz $10 zarar keltiradi" },
            { q: "Qaytarib bo'lmaydigan oldingi xarajatlarga bog'lanib qolib, foydasiz loyihani davom ettirish qaysi kognitiv xato?", opts: ["Sunk Cost Fallacy (Yo'qotilgan xarajatlar tuzog'i)", "Dunning-Kruger effekti", "Confirmation Bias", "Survivor Bias"], a: "Sunk Cost Fallacy (Yo'qotilgan xarajatlar tuzog'i)" },
            { q: "Bozorda talab elastikligi yuqori bo'lsa, narxni keskin oshirish nimaga olib keladi?", opts: ["Umumiy tushumning keskin kamayishiga", "Foydaning 2 barobar oshishiga", "Talab o'zgarmasligiga", "Xarajatlar nolga tushishiga"], a: "Umumiy tushumning keskin kamayishiga" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "💼 EXECUTIVE STRATEGY", options: shuffle(item.opts), answer: item.a };
    },
    // 5. 60 soniyalik xotira sinovi
    adults_5: (lvl) => {
        const symbols = ["♠️", "♥️", "♦️", "♣️", "⚡", "🔥", "💎", "👑", "🎯"];
        const len = Math.min(8, 5 + Math.floor(lvl / 2));
        const seq = Array.from({ length: len }, () => rand(symbols));
        return {
            type: 'symbol_memory',
            prompt: "Belgilar zanjirini eslab qoling va xuddi shu tartibda tering!",
            seq,
            palette: symbols
        };
    },
    // 6. Detektiv: jinoyat sirini yech
    adults_6: () => {
        const cases = [
            { q: "Millioner yakshanba kuni o'z kabinetida o'lik holda topildi. Xotini: 'Men uxlayotgan edim', Oshpaz: 'Men nonushta tayyorlayotgan edim', Bog'bon: 'Men daraxtlarni butayotgan edim', Pochta xodimi: 'Men yakshanba kungi xatlarni olib kelgan edim'. Qotil kim?", opts: ["Pochta xodimi (yakshanba kuni pochta ishlamaydi)", "Oshpaz", "Bog'bon", "Xotini"], a: "Pochta xodimi (yakshanba kuni pochta ishlamaydi)" },
            { q: "Jinoyatchi seyfdan 4 xonali kodni buzib ochgan. Kuzatuv kamerasida u avval 1, keyin 9, keyin 4, oxirida 5 raqamini bosgani ko'rindi, lekin seyf ochilmadi. Asl kod esa teskari tartibda edi. Kod nima?", opts: ["5491", "1945", "9154", "4519"], a: "5491" },
            { q: "Qotil qurbonning telefoni ekraniga qon bilan '7718' deb yozib ketgan. Gumondorlar: Bill, Mark, Jon, Pol. Qotil kim?", opts: ["Bill (kalkulyatorda 7718 teskari o'qilsa BILL)", "Mark", "Jon", "Pol"], a: "Bill (kalkulyatorda 7718 teskari o'qilsa BILL)" }
        ];
        const c = rand(cases);
        return { type: 'mcq', prompt: c.q, visual: "🩸 CRIME SCENE LOGIC", options: shuffle(c.opts), answer: c.a };
    },
    // 7. Murakkab mantiqiy paradokslar
    adults_7: () => {
        const qs = [
            { q: "Monti Xoll (Monty Hall) paradoksi: 3 ta eshikdan 1 tasida avtomobil bor. Siz 1-eshikni tanladingiz, boshlovchi echki bor 3-eshikni ochdi. Tanlovni 2-eshikka o'zgartirsangiz yutish ehtimolingiz necha bo'ladi?", opts: ["2/3 (66.7%)", "1/2 (50%)", "1/3 (33.3%)", "1/4 (25%)"], a: "2/3 (66.7%)" },
            { q: "Epimenid (Yolg'onchi) paradoksi: Kritlik Epimenid 'Barcha kritliklar yolg'onchidir' desa, bu gapning mantiqiy holati qanday?", opts: ["O'z-o'zini inkor etuvchi paradoks", "Mutlaq haqiqat", "Matematik aksioma", "Oddiy fakt"], a: "O'z-o'zini inkor etuvchi paradoks" },
            { q: "Tesey kemasi paradoksi nimani muhokama qiladi?", opts: ["Barcha qismlari almashtirilgan obyekt o'sha asl obyekt bo'lib qoladimi?", "Yorug'lik tezligidan oshish mumkinmi?", "Vaqt sayohati oqibatlari", "Cheksiz mehmonxona sig'imi"], a: "Barcha qismlari almashtirilgan obyekt o'sha asl obyekt bo'lib qoladimi?" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "♾️ LOGIC PARADOX", options: shuffle(item.opts), answer: item.a };
    },
    // 8. Tezkor reaksiyalar
    adults_8: () => ({
        type: 'reaction',
        prompt: "Ekstremal reaksiya sinovi! Yashil chiroq yongan zahoti bosing (290ms dan tezroq).",
        thresholdMs: 295
    }),
    // 9. Shaxmat strategiyasi
    adults_9: () => {
        const qs = [
            { q: "Oqlar yuradi: Oq Shoh g1 da, Oq Ruh a1 da, Qora Shoh g8 da (f7, g7, h7 piyodalar bilan to'silgan). Oqlarning 1 yurishda mot qiluvchi yurishi qaysi?", opts: ["Ra8#", "Ra7+", "Kf1", "Rh1"], a: "Ra8#" },
            { q: "Shaxmatda 'Sanchqi' (Fork) taktikasi deganda nima tushuniladi?", opts: ["Bitta dona bilan bir vaqtning o'zida raqibning ikki yoki undan ortiq donasiga hujum qilish", "Shohni burchakka qamash", "Piyodani farzinga chiqarish", "Rokirovka qilish"], a: "Bitta dona bilan bir vaqtning o'zida raqibning ikki yoki undan ortiq donasiga hujum qilish" },
            { q: "Qaysi shaxmat donasi yurish davomida boshqa donalar ustidan sakrab o'ta oladi?", opts: ["Ot (Knight)", "Fil (Bishop)", "Ruh (Rook)", "Farzin (Queen)"], a: "Ot (Knight)" },
            { q: "Endshpilda Shoh va Piyoda bilan raqibning yolg'iz Shohiga qarshi g'alaba qozonish uchun qaysi tushuncha hal qiluvchi ahamiyatga ega?", opts: ["Oppozitsiya (Shohlarning ro'para turishi)", "Fianketto", "Gambit", "Suyuq markaz"], a: "Oppozitsiya (Shohlarning ro'para turishi)" }
        ];
        const item = rand(qs);
        return { type: 'mcq', prompt: item.q, visual: "♔ GRANDMASTER CHESS", options: shuffle(item.opts), answer: item.a };
    },
    // 10. Ultimate Brain Challenge
    adults_10: (lvl) => {
        const pool = [
            adultsGenerators.adults_1,
            adultsGenerators.adults_2,
            adultsGenerators.adults_3,
            adultsGenerators.adults_6,
            adultsGenerators.adults_7,
            adultsGenerators.adults_9
        ];
        return rand(pool)(lvl);
    }
};

// ==================== 4. 40 TA O'YIN KATALOGI ====================
const CATEGORIES = {
    kids: {
        id: "kids",
        badge: "4–8 YOSH",
        title: "Kichkintoylar Olami",
        desc: "Rangli, multfilm uslubidagi quvnoq va rivojlantiruvchi o'yinlar!",
        games: [
            { id: "kids_1", icon: "🎨", name: "Ranglarni top", desc: "Yorqin ranglar va quvnoq buyumlarni to'g'ri ajrating.", endless: true, rules: "Ekranda ko'rsatilgan rang nomini o'qing va to'g'ri variantni tanlang." },
            { id: "kids_2", icon: "🐾", name: "Hayvonlar ovozini top", desc: "Hayvonlarning ovozi va ta'rifiga qarab ularni toping.", endless: true, rules: "Ovoz tugmasini bosing va qaysi hayvon ekanini toping." },
            { id: "kids_3", icon: "🃏", name: "Bir xil rasmlarni juftlashtir", desc: "Yashiringan juft rasmlarni eslab qoling va oching.", endless: false, rules: "Kartalarni navbatma-navbat ochib, barcha 4 juftlikni toping." },
            { id: "kids_4", icon: "🔺", name: "Shakllarni joylashtir", desc: "Geometrik shakllarni ta'rifiga ko'ra joylashtiring.", endless: true, rules: "Shakl haqidagi ta'rifni o'qing va mos shaklni tanlang." },
            { id: "kids_5", icon: "🍓", name: "Mevalarni ajrat", desc: "Buyumlar orasidan mazali mevalarni ajratib oling.", endless: true, rules: "Berilgan 4 ta variant ichidan haqiqiy mevani belgilang." },
            { id: "kids_6", icon: "🔢", name: "Sonlarni sanash", desc: "Rasmdagi quvnoq shakllarni sanab to'g'ri sonni toping.", endless: true, rules: "Rasmdagi barcha buyumlarni sanang va to'g'ri raqamni bosing." },
            { id: "kids_7", icon: "🔍", name: "Rasmdagi farqni top", desc: "Bir xil rasmlar orasidagi yashirin farqni toping.", endless: true, rules: "8 ta katak ichidan boshqalaridan farq qiladigan rasmni bosing." },
            { id: "kids_8", icon: "🧩", name: "Xotira kartalari", desc: "Kichkintoylar uchun hayvonlar xotira o'yini.", endless: false, rules: "Barcha bir xil hayvon kartalarini juftlab chiqing." },
            { id: "kids_9", icon: "❓", name: "Qaysi rasm ortiqcha?", desc: "Mantiqan guruhga kirmaydigan rasmni aniqlang.", endless: true, rules: "4 ta rasmdan 3 tasi bir guruhga tegishli, ortiqchasini toping." },
            { id: "kids_10", icon: "➕", name: "Oddiy matematik misollar", desc: "Qo'shish va ayirishga oid ilk misollar.", endless: true, rules: "Misolni hisoblang va to'g'ri javobni tanlang." }
        ]
    },
    juniors: {
        id: "juniors",
        badge: "9–14 YOSH",
        title: "Yosh Daholar",
        desc: "Neon ko'k va binafsha olamda mantiq, tezkorlik va zukkolik sinovi!",
        games: [
            { id: "juniors_1", icon: "⚔️", name: "Matematik jang", desc: "Arifmetik amallar bilan aqliy jangda g'olib bo'ling.", endless: true, rules: "Tez va aniq hisoblab, to'g'ri javobni tanlang." },
            { id: "juniors_2", icon: "🧠", name: "Xotira chempioni", desc: "Ko'rsatilgan raqamlar zanjirini eslab qoling.", endless: true, rules: "Raqamlar 2.4 soniya ko'rinadi, so'ng ularni xatosiz yozing." },
            { id: "juniors_3", icon: "💡", name: "Mantiqiy jumboqlar", desc: "Zukkolik talab qiluvchi qiziqarli topishmoqlar.", endless: true, rules: "Jumboqni diqqat bilan o'qing va mantiqiy javobni tanlang." },
            { id: "juniors_4", icon: "⚡", name: "Tezkor hisoblash", desc: "Ikki xonali sonlarni miyada tez qo'shish sinovi.", endless: true, rules: "Javobni klaviaturada yozing va tekshiring." },
            { id: "juniors_5", icon: "🔤", name: "So'z topish", desc: "Aralashgan harflardan yashirin so'zni tiklang.", endless: true, rules: "Maslahatga qarab harflardan to'g'ri so'z tuzing." },
            { id: "juniors_6", icon: "📈", name: "Ketma-ketlikni davom ettir", desc: "Sonlar qatoridagi qonuniyatni toping.", endless: true, rules: "Qator qanday o'sayotganini aniqlang va keyingi sonni toping." },
            { id: "juniors_7", icon: "🔐", name: "Kodni yech", desc: "Harflar va raqamlar shifrini oching.", endless: false, rules: "Berilgan kalit asosida maxfiy kodni toping." },
            { id: "juniors_8", icon: "🌀", name: "Shakllar labirinti", desc: "Yo'nalish tugmalari bilan labirintdan chiqing.", endless: false, rules: "Tugmalar yoki klaviatura strelkalari bilan 🏁 ga yeting." },
            { id: "juniors_9", icon: "👁️", name: "Diqqatni sinash", desc: "Stroop effekti: so'z ma'nosi va rangini ajrating.", endless: true, rules: "Yozilgan so'zning o'zini emas, uning rangini tanlang." },
            { id: "juniors_10", icon: "🔮", name: "Sirli savollar", desc: "Fan, koinot va dunyo haqidagi sirli savollar.", endless: true, rules: "To'g'ri ilmiy javobni belgilang." }
        ]
    },
    teens: {
        id: "teens",
        badge: "15–20 YOSH",
        title: "Brain Challenge",
        desc: "Professional gaming uslubidagi IQ, kriptografiya va strategiya arenasi.",
        games: [
            { id: "teens_1", icon: "🧬", name: "IQ Challenge", desc: "Kognitiv mantiq va abstrakt tafakkur testi.", endless: true, rules: "Mantiqiy bog'liqlikni tahlil qiling va yagona to'g'ri javobni tanlang." },
            { id: "teens_2", icon: "📐", name: "Murakkab matematik masalalar", desc: "Kvadrat tenglamalar va algebraik hisoblar.", endless: true, rules: "Tenglamani yechib, musbat ildiz qiymatini kiriting." },
            { id: "teens_3", icon: "🛡️", name: "Kriptografik kodlarni yechish", desc: "Sezar, Atbash va ikkilik shifrlarni buzish.", endless: false, rules: "Shifrlash kalitidan foydalanib asl matn yoki sonni toping." },
            { id: "teens_4", icon: "♟️", name: "Strategik qarorlar", desc: "O'yin nazariyasi va biznes strategiyasi keyslari.", endless: false, rules: "Eng samarali strategik yechimni tanlang." },
            { id: "teens_5", icon: "💾", name: "Tezkor xotira", desc: "Murakkab harf-raqam tokenlarini 2 soniyada eslang.", endless: true, rules: "Ekrandagi maxfiy tokenni eslab qoling va kiriting." },
            { id: "teens_6", icon: "🕵️", name: "Mantiqiy detektiv", desc: "Guvohlar ko'rsatmasidagi yolg'onni fosh eting.", endless: false, rules: "Dalillarni solishtiring va jinoyatchini toping." },
            { id: "teens_7", icon: "♾️", name: "Matematik ketma-ketlik", desc: "Fibonachchi, tub sonlar va darajali qatorlar.", endless: true, rules: "Qator formulasini aniqlab keyingi hadni toping." },
            { id: "teens_8", icon: "⚡", name: "Reaksiya tezligi", desc: "Millisekundlik reflekslarni sinovdan o'tkazing.", endless: true, rules: "Maydon yashil bo'lishi bilan maksimal tezlikda bosing." },
            { id: "teens_9", icon: "🧭", name: "Murakkab labirint", desc: "6x6 o'lchamli neyron labirintdan chiqish.", endless: false, rules: "To'siqlarni aylanib o'tib finish nuqtasiga yeting." },
            { id: "teens_10", icon: "🏆", name: "Genius Quiz", desc: "Ilm-fan va texnologiya bo'yicha intellektual viktorina.", endless: true, rules: "Savolga aniq javob bering." }
        ]
    },
    adults: {
        id: "adults",
        badge: "22–40 YOSH",
        title: "Extreme Brain",
        desc: "Qora, qizil va oltin rangli elita intellektual sinovlar platformasi.",
        games: [
            { id: "adults_1", icon: "👑", name: "Extreme IQ Test", desc: "Yuqori murakkablikdagi matritsa va mantiqiy testlar.", endless: true, rules: "Chuqur tahlil orqali to'g'ri yechimni toping." },
            { id: "adults_2", icon: "🧮", name: "Matematik Mastermind", desc: "Tezkor mental arifmetika va ko'p bosqichli amallar.", endless: true, rules: "Kalkulyatorsiz hisoblang va natijani yozing." },
            { id: "adults_3", icon: "🔑", name: "Kriptografik shifrlar", desc: "RSA, XOR va Vijener shifrlash tizimlari.", endless: false, rules: "Kriptografik qonuniyat asosida javobni tanlang." },
            { id: "adults_4", icon: "💼", name: "Strategik biznes qarorlari", desc: "Moliya, unit-ekonomika va kognitiv xatolar tahlili.", endless: false, rules: "Biznes ko'rsatkichlari asosida optimal qaror qabul qiling." },
            { id: "adults_5", icon: "⏱️", name: "60 soniyalik xotira sinovi", desc: "Belgilar ketma-ketligini eslab qolish va qayta tiklash.", endless: true, rules: "Ko'rsatilgan belgilar zanjirini xuddi shu tartibda bosing." },
            { id: "adults_6", icon: "🩸", name: "Detektiv: jinoyat sirini yech", desc: "Murakkab jinoyat ishlaridagi alibilarni tekshiring.", endless: false, rules: "Mantiqiy nomuvofiqlikni topib qotilni aniqlang." },
            { id: "adults_7", icon: "🌀", name: "Murakkab mantiqiy paradokslar", desc: "Monti Xoll, Epimenid va falsafiy paradokslar.", endless: false, rules: "Ehtimollar nazariyasi va mantiqqa tayaning." },
            { id: "adults_8", icon: "🔥", name: "Tezkor reaksiyalar", desc: "295 millisekundlik ekstremal reaksiya chegarasi.", endless: true, rules: "Yashil signal berilishi bilan darhol bosing." },
            { id: "adults_9", icon: "♔", name: "Shaxmat strategiyasi", desc: "Grossmeyster darajasidagi mot va taktika masalalari.", endless: false, rules: "Eng kuchli shaxmat yurishi yoki taktikani tanlang." },
            { id: "adults_10", icon: "💎", name: "Ultimate Brain Challenge", desc: "Barcha ekstremal yo'nalishlarni birlashtirgan final sinov!", endless: true, rules: "Har bir bosqichda turli ekstremal topshiriqlarni bajaring." }
        ]
    }
};

const ALL_GENERATORS = {
    ...kidsGenerators,
    ...juniorsGenerators,
    ...teensGenerators,
    ...adultsGenerators
};

// ==================== 5. STATE VA LOCALSTORAGE BOSHQARUVI ====================
const STORAGE_KEY = "brain_master_platform_v1";

const DEFAULT_MISSIONS = [
    { id: "m1", title: "5 ta savolga to'g'ri javob ber", target: 5, progress: 0, rewardScore: 100, rewardXp: 150, claimed: false, type: "correct" },
    { id: "m2", title: "3 ta o'yinni oxirigacha tugat", target: 3, progress: 0, rewardScore: 150, rewardXp: 200, claimed: false, type: "games" },
    { id: "m3", title: "5 ta ketma-ket to'g'ri javob ber", target: 5, progress: 0, rewardScore: 120, rewardXp: 180, claimed: false, type: "streak" },
    { id: "m4", title: "Jami 250 ball to'pla", target: 250, progress: 0, rewardScore: 200, rewardXp: 250, claimed: false, type: "score" },
    { id: "m5", title: "Xotira yoki tezkor o'yinda g'alaba qozon", target: 1, progress: 0, rewardScore: 130, rewardXp: 170, claimed: false, type: "memory_win" }
];

let appState = {
    currentUser: null, // { username, age, category }
    theme: "dark",
    sound: true,
    users: {} // username -> profile data
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            appState = { ...appState, ...parsed };
        }
    } catch (e) {
        console.error("Storage yuklashda xatolik:", e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("Storage saqlashda xatolik:", e);
    }
}

function getOrCreateUserProfile(username, age, category) {
    const key = username.trim();
    if (!appState.users[key]) {
        appState.users[key] = {
            username: key,
            age: Number(age),
            category: category,
            totalScore: 0,
            xp: 0,
            gamesPlayed: 0,
            bestSingleScore: 0,
            streak: 0,
            records: {}, // gameId -> best score
            completedGames: [], // array of gameIds
            missions: JSON.parse(JSON.stringify(DEFAULT_MISSIONS))
        };
    } else {
        appState.users[key].age = Number(age);
        appState.users[key].category = category;
    }
    return appState.users[key];
}

function getCurrentProfile() {
    if (!appState.currentUser) return null;
    return appState.users[appState.currentUser.username];
}

// ==================== 6. YOSH TOIFASINI ANIQLASH ====================
function detectAgeCategory(age) {
    if (age >= 4 && age <= 8) return "kids";
    if (age >= 9 && age <= 14) return "juniors";
    if (age >= 15 && age <= 20) return "teens";
    if (age >= 22 && age <= 40) return "adults";
    if (age > 40) return "adults";
    return null; // 21 uchun maxsus modal ochiladi
}

// ==================== 7. UI VA SAHIFALARNI YANGILASH ====================
let activeCategory = "kids";

function applyThemeAndGroup(group) {
    document.documentElement.setAttribute("data-theme", appState.theme);
    document.documentElement.setAttribute("data-age-group", group);
    document.getElementById("theme-toggle-btn").textContent = appState.theme === "dark" ? "🌙" : "☀️";
    document.getElementById("sound-toggle-btn").textContent = appState.sound ? "🔊" : "🔇";
    sfx.enabled = appState.sound;
}

function enterPlatform(username, age, chosenCategory) {
    const profile = getOrCreateUserProfile(username, age, chosenCategory);
    appState.currentUser = { username: profile.username, age: profile.age, category: chosenCategory };
    activeCategory = chosenCategory;
    saveState();

    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("age21-modal").classList.add("hidden");
    document.getElementById("app-shell").classList.remove("hidden");

    applyThemeAndGroup(activeCategory);
    refreshAllUI();
}

function refreshAllUI() {
    const profile = getCurrentProfile();
    if (!profile) return;

    const level = Math.floor(profile.xp / 500) + 1;
    const xpInLevel = profile.xp % 500;

    // Navbar & Personalized Greetings
    document.getElementById("nav-greeting").textContent = `Salom, ${profile.username}! Bugun aqlingni sinashga tayyormisan?`;
    document.getElementById("nav-level").textContent = level;
    document.getElementById("nav-score").textContent = profile.totalScore;
    document.getElementById("nav-xp").textContent = profile.xp;

    // Category buttons active state
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === activeCategory);
    });

    renderCategoryGames();
    renderMissions();
    renderProfile(level, xpInLevel);
    renderLeaderboard();
}

function renderCategoryGames() {
    const profile = getCurrentProfile();
    const cat = CATEGORIES[activeCategory];
    applyThemeAndGroup(activeCategory);

    document.getElementById("cat-badge").textContent = cat.badge;
    document.getElementById("cat-title").textContent = cat.title;
    document.getElementById("cat-welcome").textContent = `Salom, ${profile.username}! ${cat.desc}`;

    const completedInCat = cat.games.filter(g => profile.completedGames.includes(g.id)).length;
    document.getElementById("cat-progress-text").textContent = `${completedInCat} / 10 o'yin`;
    document.getElementById("cat-progress-fill").style.width = `${(completedInCat / 10) * 100}%`;

    const grid = document.getElementById("games-grid");
    grid.innerHTML = "";

    cat.games.forEach((game, idx) => {
        const best = profile.records[game.id] || 0;
        const isDone = profile.completedGames.includes(game.id);
        const card = document.createElement("div");
        card.className = "game-card";
        card.style.animationDelay = `${idx * 0.04}s`;
        card.innerHTML = `
            <div>
                <div class="card-top">
                    <div class="game-icon-box">${game.icon}</div>
                    <div class="card-badges">
                        ${game.endless ? `<span class="endless-pill">♾️ Cheksiz rejim</span>` : `<span class="record-pill">🎯 5 bosqich</span>`}
                        <span class="record-pill">${isDone ? "✅" : "🏆"} Rekord: ${best}</span>
                    </div>
                </div>
                <h3>${idx + 1}. ${game.name}</h3>
                <p>${game.desc}</p>
            </div>
            <button class="play-card-btn" data-game-id="${game.id}">▶️ O'ynash</button>
        `;
        card.querySelector(".play-card-btn").addEventListener("click", () => {
            sfx.click();
            openGameIntro(game, cat);
        });
        grid.appendChild(card);
    });
}

function renderMissions() {
    const profile = getCurrentProfile();
    const list = document.getElementById("missions-list");
    list.innerHTML = "";

    document.getElementById("missions-subtitle").textContent = `${profile.username}, kundalik missiyalarni bajarib qo'shimcha XP oling!`;

    let readyCount = 0;
    profile.missions.forEach(m => {
        const isReady = m.progress >= m.target && !m.claimed;
        if (isReady) readyCount++;
        const pct = Math.min(100, Math.round((m.progress / m.target) * 100));

        const card = document.createElement("div");
        card.className = `mission-card ${m.claimed ? "completed" : ""}`;
        card.innerHTML = `
            <div class="mission-top">
                <strong>${m.claimed ? "✅" : "🎯"} ${m.title}</strong>
                <span class="mission-reward">+${m.rewardScore} ball | +${m.rewardXp} XP</span>
            </div>
            <div class="progress-label">
                <span>Jarayon: ${Math.min(m.progress, m.target)} / ${m.target}</span>
                <span>${pct}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width:${pct}%"></div>
            </div>
            ${m.claimed
                ? `<button class="ghost-btn" disabled>Mukofot olingan ✔️</button>`
                : isReady
                    ? `<button class="primary-glow-btn claim-btn" data-mid="${m.id}">🎁 Mukofotni olish</button>`
                    : `<button class="ghost-btn" disabled>Jarayonda...</button>`
            }
        `;
        const cBtn = card.querySelector(".claim-btn");
        if (cBtn) {
            cBtn.addEventListener("click", () => claimMission(m.id));
        }
        list.appendChild(card);
    });

    const claimedTotal = profile.missions.filter(m => m.claimed).length;
    document.getElementById("mission-badge").textContent = `${claimedTotal}/${profile.missions.length}`;
}

function claimMission(missionId) {
    const profile = getCurrentProfile();
    const m = profile.missions.find(x => x.id === missionId);
    if (!m || m.claimed || m.progress < m.target) return;

    m.claimed = true;
    profile.totalScore += m.rewardScore;
    profile.xp += m.rewardXp;
    sfx.win();
    launchConfetti();
    saveState();
    refreshAllUI();
}

function renderProfile(level, xpInLevel) {
    const profile = getCurrentProfile();
    const catName = CATEGORIES[profile.category]?.title || "Brain Master";
    const doneMissions = profile.missions.filter(m => m.claimed).length;

    document.getElementById("profile-username").textContent = profile.username;
    document.getElementById("profile-age-label").textContent = `Yosh: ${profile.age} • ${catName}`;
    document.getElementById("profile-level").textContent = level;
    document.getElementById("profile-xp-next").textContent = `${xpInLevel} / 500 XP`;
    document.getElementById("profile-xp-bar").style.width = `${(xpInLevel / 500) * 100}%`;

    document.getElementById("stat-total-score").textContent = profile.totalScore;
    document.getElementById("stat-total-xp").textContent = profile.xp;
    document.getElementById("stat-games-played").textContent = profile.gamesPlayed;
    document.getElementById("stat-best-score").textContent = profile.bestSingleScore;
    document.getElementById("stat-missions-done").textContent = `${doneMissions} / ${profile.missions.length}`;
    document.getElementById("stat-unique-games").textContent = `${profile.completedGames.length} / 40`;
}

function renderLeaderboard() {
    const profile = getCurrentProfile();
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    const allUsers = Object.values(appState.users).sort((a, b) => b.totalScore - a.totalScore || b.xp - a.xp);
    allUsers.forEach((u, index) => {
        const lvl = Math.floor(u.xp / 500) + 1;
        const catTitle = CATEGORIES[u.category]?.title || "Brain Master";
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
        const tr = document.createElement("tr");
        if (u.username === profile.username) tr.className = "current-user-row";
        tr.innerHTML = `
            <td><strong>${medal}</strong></td>
            <td>${u.username} ${u.username === profile.username ? "(Siz)" : ""}</td>
            <td>${u.age} yosh • ${catTitle}</td>
            <td>⭐ Lvl ${lvl}</td>
            <td>⚡ ${u.xp}</td>
            <td><strong>💎 ${u.totalScore}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

// ==================== 8. O'YIN ARENASI VA MEXANIKASI ====================
let currentGameSession = null;

function openGameIntro(game, categoryObj) {
    const profile = getCurrentProfile();
    currentGameSession = {
        game,
        categoryObj,
        mode: "standard",
        stage: 1,
        maxStages: 5,
        score: 0,
        correctCount: 0,
        questionData: null,
        selectedOption: null,
        answered: false,
        usedPrompts: new Set(),
        timerInterval: null
    };

    document.getElementById("game-arena").classList.remove("hidden");
    document.getElementById("arena-intro").classList.remove("hidden");
    document.getElementById("arena-play").classList.add("hidden");
    document.getElementById("arena-results").classList.add("hidden");

    document.getElementById("arena-cat-tag").textContent = categoryObj.badge;
    document.getElementById("arena-game-title").textContent = game.name;
    document.getElementById("hud-user").textContent = profile.username;
    document.getElementById("hud-stage").textContent = "1/5";
    document.getElementById("hud-score").textContent = "0";
    document.getElementById("hud-timer-box").classList.add("hidden");

    document.getElementById("intro-game-icon").textContent = game.icon;
    document.getElementById("intro-game-name").textContent = game.name;
    document.getElementById("intro-user-prompt").textContent = `${profile.username}, qoidalar bilan tanishing va o'yinni boshlang!`;
    document.getElementById("intro-rules-text").textContent = game.rules;
    document.getElementById("intro-best-record").textContent = profile.records[game.id] || 0;

    // Endless mode visibility
    const endlessLabel = document.getElementById("endless-mode-label");
    const stdRadio = document.querySelector('input[name="gameMode"][value="standard"]');
    stdRadio.checked = true;
    if (game.endless) {
        endlessLabel.classList.remove("hidden");
    } else {
        endlessLabel.classList.add("hidden");
    }
}

function runCountdown(callback) {
    const overlay = document.getElementById("countdown-overlay");
    const numEl = document.getElementById("countdown-number");
    const txtEl = document.getElementById("countdown-text");
    const profile = getCurrentProfile();

    overlay.classList.remove("hidden");
    let count = 3;
    numEl.textContent = count;
    txtEl.textContent = `${profile.username}, tayyorlaning!`;
    sfx.countdown(false);

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            numEl.textContent = count;
            sfx.countdown(false);
        } else if (count === 0) {
            numEl.textContent = "GO!";
            txtEl.textContent = "Olg'a!";
            sfx.countdown(true);
        } else {
            clearInterval(timer);
            overlay.classList.add("hidden");
            callback();
        }
    }, 600);
}

function startActiveGame() {
    const selectedMode = document.querySelector('input[name="gameMode"]:checked')?.value || "standard";
    currentGameSession.mode = selectedMode;
    currentGameSession.stage = 1;
    currentGameSession.maxStages = selectedMode === "endless" ? Infinity : 5;
    currentGameSession.score = 0;
    currentGameSession.correctCount = 0;
    currentGameSession.usedPrompts.clear();

    runCountdown(() => {
        document.getElementById("arena-intro").classList.add("hidden");
        document.getElementById("arena-results").classList.add("hidden");
        document.getElementById("arena-play").classList.remove("hidden");
        loadNextStage();
    });
}

function getUniqueQuestion(gameId, level) {
    const gen = ALL_GENERATORS[gameId];
    let q = gen(level);
    let attempts = 0;
    while (currentGameSession.usedPrompts.has(q.prompt + (q.visual || "")) && attempts < 12) {
        q = gen(level);
        attempts++;
    }
    currentGameSession.usedPrompts.add(q.prompt + (q.visual || ""));
    return q;
}

function loadNextStage() {
    clearInterval(currentGameSession.timerInterval);
    const s = currentGameSession;
    s.answered = false;
    s.selectedOption = null;

    document.getElementById("hud-stage").textContent = s.mode === "endless" ? `♾️ #${s.stage}` : `${s.stage}/${s.maxStages}`;
    document.getElementById("hud-score").textContent = s.score;

    const fb = document.getElementById("game-feedback");
    fb.classList.add("hidden");
    fb.className = "feedback-box hidden";

    const checkBtn = document.getElementById("check-answer-btn");
    const nextBtn = document.getElementById("next-stage-btn");
    const finishEndlessBtn = document.getElementById("finish-endless-btn");

    checkBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    if (s.mode === "endless" && s.stage > 1) {
        finishEndlessBtn.classList.remove("hidden");
    } else {
        finishEndlessBtn.classList.add("hidden");
    }

    const q = getUniqueQuestion(s.game.id, s.stage);
    s.questionData = q;
    const board = document.getElementById("game-board");
    board.innerHTML = "";

    // Prompt
    const promptEl = document.createElement("div");
    promptEl.className = "q-prompt";
    promptEl.textContent = q.prompt;
    board.appendChild(promptEl);

    // Visual block
    if (q.visualHtml) {
        const vis = document.createElement("div");
        vis.innerHTML = q.visualHtml;
        board.appendChild(vis);
    } else if (q.visual) {
        const vis = document.createElement("div");
        vis.className = "q-visual";
        vis.textContent = q.visual;
        board.appendChild(vis);
    }

    // Render by interactive mechanic type
    if (q.type === "mcq") {
        const grid = document.createElement("div");
        grid.className = "options-grid";
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "opt-btn";
            btn.textContent = opt;
            btn.addEventListener("click", () => {
                if (s.answered) return;
                sfx.click();
                grid.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                s.selectedOption = opt;
                checkBtn.classList.remove("hidden");
            });
            grid.appendChild(btn);
        });
        board.appendChild(grid);
        if (q.onRender) q.onRender();
    }
    else if (q.type === "input") {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "text-answer-input";
        inp.placeholder = "Javobingizni kiriting...";
        inp.addEventListener("input", () => {
            s.selectedOption = inp.value.trim();
            if (s.selectedOption.length > 0 && !s.answered) checkBtn.classList.remove("hidden");
        });
        inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !s.answered && s.selectedOption) verifyCurrentAnswer();
        });
        board.appendChild(inp);
        setTimeout(() => inp.focus(), 50);
    }
    else if (q.type === "flash_memory") {
        const box = document.createElement("div");
        box.className = "q-visual";
        box.textContent = q.secret;
        board.appendChild(box);

        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "text-answer-input hidden";
        inp.placeholder = "Eslab qolgan kodni yozing...";
        board.appendChild(inp);

        setTimeout(() => {
            box.textContent = "🔒 Yashirildi! Endi kiriting";
            inp.classList.remove("hidden");
            inp.focus();
            inp.addEventListener("input", () => {
                s.selectedOption = inp.value.trim().toUpperCase();
                if (s.selectedOption.length > 0 && !s.answered) checkBtn.classList.remove("hidden");
            });
            inp.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !s.answered && s.selectedOption) verifyCurrentAnswer();
            });
        }, q.showMs || 2200);
    }
    else if (q.type === "symbol_memory") {
        const box = document.createElement("div");
        box.className = "q-visual";
        box.textContent = q.seq.join("  ");
        board.appendChild(box);

        const userSeq = [];
        const preview = document.createElement("div");
        preview.className = "q-visual hidden";
        preview.textContent = "Sizning tanlovingiz: ...";
        board.appendChild(preview);

        const pal = document.createElement("div");
        pal.className = "options-grid hidden";
        q.palette.forEach(sym => {
            const b = document.createElement("button");
            b.className = "opt-btn";
            b.style.fontSize = "1.6rem";
            b.textContent = sym;
            b.addEventListener("click", () => {
                if (s.answered || userSeq.length >= q.seq.length) return;
                sfx.click();
                userSeq.push(sym);
                preview.textContent = userSeq.join("  ");
                s.selectedOption = userSeq.join("");
                if (userSeq.length === q.seq.length) checkBtn.classList.remove("hidden");
            });
            pal.appendChild(b);
        });
        board.appendChild(pal);

        setTimeout(() => {
            box.textContent = `🔒 ${q.seq.length} ta belgini tartib bilan bosing`;
            preview.classList.remove("hidden");
            pal.classList.remove("hidden");
        }, 2600);
    }
    else if (q.type === "memory_match") {
        const grid = document.createElement("div");
        grid.className = "memory-grid";
        let flipped = [];
        let matchedPairs = 0;
        const totalPairs = q.deck.length / 2;

        q.deck.forEach((symbol) => {
            const card = document.createElement("button");
            card.className = "mem-card";
            card.textContent = "?";
            card.addEventListener("click", () => {
                if (s.answered || card.classList.contains("revealed") || card.classList.contains("matched") || flipped.length === 2) return;
                sfx.click();
                card.classList.add("revealed");
                card.textContent = symbol;
                flipped.push({ card, symbol });

                if (flipped.length === 2) {
                    const [c1, c2] = flipped;
                    if (c1.symbol === c2.symbol) {
                        c1.card.classList.add("matched");
                        c2.card.classList.add("matched");
                        flipped = [];
                        matchedPairs++;
                        sfx.correct();
                        if (matchedPairs === totalPairs) {
                            handleDirectStageWin("Barcha juftliklar topildi! (+30 ball)");
                        }
                    } else {
                        setTimeout(() => {
                            c1.card.classList.remove("revealed");
                            c2.card.classList.remove("revealed");
                            c1.card.textContent = "?";
                            c2.card.textContent = "?";
                            flipped = [];
                        }, 650);
                    }
                }
            });
            grid.appendChild(card);
        });
        board.appendChild(grid);
    }
    else if (q.type === "spot_diff") {
        const grid = document.createElement("div");
        grid.className = "memory-grid";
        q.grid.forEach((icon, idx) => {
            const btn = document.createElement("button");
            btn.className = "opt-btn";
            btn.style.fontSize = "2.2rem";
            btn.textContent = icon;
            btn.addEventListener("click", () => {
                if (s.answered) return;
                if (idx === q.answerIdx) {
                    btn.classList.add("correct");
                    handleDirectStageWin("Ajoyib! Farqni aniq topdingiz!");
                } else {
                    btn.classList.add("wrong");
                    handleDirectStageLoss("Bu bir xil rasm edi! Boshqasini sinab ko'ring.");
                }
            });
            grid.appendChild(btn);
        });
        board.appendChild(grid);
    }
    else if (q.type === "maze") {
        const rows = q.grid.length;
        const cols = q.grid[0].length;
        let player = { r: 0, c: 0 };

        const mazeDiv = document.createElement("div");
        mazeDiv.className = "maze-grid";
        mazeDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        function drawMaze() {
            mazeDiv.innerHTML = "";
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement("div");
                    cell.className = "maze-cell";
                    if (q.grid[r][c] === 1) cell.classList.add("wall");
                    if (q.grid[r][c] === 2) {
                        cell.classList.add("goal");
                        cell.textContent = "🏁";
                    }
                    if (player.r === r && player.c === c) cell.textContent = "🤖";
                    mazeDiv.appendChild(cell);
                }
            }
        }

        function move(dr, dc) {
            if (s.answered) return;
            const nr = player.r + dr;
            const nc = player.c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && q.grid[nr][nc] !== 1) {
                player = { r: nr, c: nc };
                sfx.click();
                drawMaze();
                if (q.grid[nr][nc] === 2) {
                    handleDirectStageWin("Labirintdan muvaffaqiyatli o'tdingiz!");
                }
            }
        }

        drawMaze();
        board.appendChild(mazeDiv);

        const ctrls = document.createElement("div");
        ctrls.className = "maze-controls";
        ctrls.innerHTML = `
            <div></div><button class="maze-btn" id="m-up">⬆️</button><div></div>
            <button class="maze-btn" id="m-left">⬅️</button><button class="maze-btn" id="m-down">⬇️</button><button class="maze-btn" id="m-right">➡️</button>
        `;
        ctrls.querySelector("#m-up").onclick = () => move(-1, 0);
        ctrls.querySelector("#m-down").onclick = () => move(1, 0);
        ctrls.querySelector("#m-left").onclick = () => move(0, -1);
        ctrls.querySelector("#m-right").onclick = () => move(0, 1);
        board.appendChild(ctrls);
    }
    else if (q.type === "reaction") {
        const pad = document.createElement("div");
        pad.className = "reaction-pad wait";
        pad.innerHTML = `<span>⏳ Kuting... Yashil bo'lganda bosing!</span>`;
        let readyTime = 0;
        let isReady = false;

        const delay = randInt(1400, 3200);
        const to = setTimeout(() => {
            if (s.answered) return;
            isReady = true;
            readyTime = performance.now();
            pad.className = "reaction-pad ready";
            pad.innerHTML = `<span>⚡ HOZIR BOSING!</span>`;
        }, delay);

        pad.addEventListener("click", () => {
            if (s.answered) return;
            if (!isReady) {
                clearTimeout(to);
                handleDirectStageLoss("Juda erta bosdingiz! Yashil chiroqni kuting.");
            } else {
                const diff = Math.round(performance.now() - readyTime);
                if (diff <= q.thresholdMs) {
                    handleDirectStageWin(`Zo'r reaksiya: ${diff} ms! (Chegara: ${q.thresholdMs} ms)`);
                } else {
                    handleDirectStageLoss(`Sekinroq bo'ldi: ${diff} ms (Chegara: ${q.thresholdMs} ms)`);
                }
            }
        });
        board.appendChild(pad);
    }
}

function verifyCurrentAnswer() {
    const s = currentGameSession;
    if (!s || s.answered || !s.selectedOption) return;

    const q = s.questionData;
    const expected = q.type === "symbol_memory" ? q.seq.join("") : String(q.answer).trim().toLowerCase();
    const actual = String(s.selectedOption).trim().toLowerCase();

    if (actual === expected) {
        if (q.type === "mcq") {
            document.querySelectorAll(".opt-btn").forEach(b => {
                if (b.textContent.trim().toLowerCase() === expected) b.classList.add("correct");
            });
        }
        handleDirectStageWin("To'g'ri javob! +25 ball");
    } else {
        if (q.type === "mcq") {
            document.querySelectorAll(".opt-btn").forEach(b => {
                if (b.classList.contains("selected")) b.classList.add("wrong");
                if (b.textContent.trim().toLowerCase() === expected) b.classList.add("correct");
            });
        }
        const correctDisplay = q.type === "symbol_memory" ? q.seq.join(" ") : q.answer;
        handleDirectStageLoss(`Noto'g'ri! To'g'ri javob: ${correctDisplay}`);
    }
}

function handleDirectStageWin(msg) {
    const s = currentGameSession;
    const profile = getCurrentProfile();
    s.answered = true;
    s.correctCount++;
    const bonus = 25 + (s.stage - 1) * 5;
    s.score += bonus;

    // Update streak & mission progress
    profile.streak = (profile.streak || 0) + 1;
    updateMissionProgress("correct", 1);
    updateMissionProgress("streak", profile.streak, true);
    updateMissionProgress("score", bonus);
    if (s.game.id.includes("memory") || s.game.id.endsWith("_2") || s.game.id.endsWith("_5") || s.game.id.endsWith("_8")) {
        updateMissionProgress("memory_win", 1);
    }

    sfx.correct();
    document.getElementById("hud-score").textContent = s.score;
    document.getElementById("check-answer-btn").classList.add("hidden");

    const fb = document.getElementById("game-feedback");
    fb.textContent = `✅ ${profile.username}, ${msg} (+${bonus} ball)`;
    fb.className = "feedback-box success";
    fb.classList.remove("hidden");

    const nextBtn = document.getElementById("next-stage-btn");
    nextBtn.textContent = (s.mode === "standard" && s.stage >= s.maxStages) ? "🏆 Natijalarni ko'rish" : "➡️ Keyingi Bosqich";
    nextBtn.classList.remove("hidden");

    if (s.mode === "endless") {
        document.getElementById("finish-endless-btn").classList.remove("hidden");
    }
}

function handleDirectStageLoss(msg) {
    const s = currentGameSession;
    const profile = getCurrentProfile();
    s.answered = true;
    profile.streak = 0;

    sfx.wrong();
    document.getElementById("check-answer-btn").classList.add("hidden");

    const fb = document.getElementById("game-feedback");
    fb.textContent = `❌ ${profile.username}, ${msg}`;
    fb.className = "feedback-box error";
    fb.classList.remove("hidden");

    const nextBtn = document.getElementById("next-stage-btn");
    nextBtn.textContent = (s.mode === "standard" && s.stage >= s.maxStages) ? "🏆 Natijalarni ko'rish" : "➡️ Keyingi Bosqich";
    nextBtn.classList.remove("hidden");

    if (s.mode === "endless") {
        document.getElementById("finish-endless-btn").classList.remove("hidden");
    }
}

function advanceOrFinish() {
    const s = currentGameSession;
    if (s.mode === "standard" && s.stage >= s.maxStages) {
        finishGameSession();
    } else {
        s.stage++;
        loadNextStage();
    }
}

function finishGameSession() {
    const s = currentGameSession;
    const profile = getCurrentProfile();
    const earnedXp = Math.max(20, Math.round(s.score * 1.4));

    profile.totalScore += s.score;
    profile.xp += earnedXp;
    profile.gamesPlayed += 1;
    if (s.score > profile.bestSingleScore) profile.bestSingleScore = s.score;

    const prevGameRecord = profile.records[s.game.id] || 0;
    const isNewRecord = s.score > prevGameRecord;
    if (isNewRecord) profile.records[s.game.id] = s.score;

    if (!profile.completedGames.includes(s.game.id) && s.correctCount > 0) {
        profile.completedGames.push(s.game.id);
    }

    updateMissionProgress("games", 1);
    saveState();

    document.getElementById("arena-play").classList.add("hidden");
    document.getElementById("arena-results").classList.remove("hidden");

    document.getElementById("result-icon").textContent = s.score > 0 ? "🏆" : "💪";
    document.getElementById("result-heading").textContent = isNewRecord ? "YANGI REKORD! 🎉" : "O'yin Yakunlandi!";
    document.getElementById("result-user-msg").textContent = `Ajoyib o'yin, ${profile.username}! Siz ${s.game.name} o'yinini yakunladingiz.`;
    document.getElementById("res-score").textContent = s.score;
    document.getElementById("res-xp").textContent = `+${earnedXp} XP`;
    document.getElementById("res-correct").textContent = `${s.correctCount} ta`;
    document.getElementById("res-record").textContent = profile.records[s.game.id] || 0;

    if (s.score > 0) {
        sfx.win();
        launchConfetti();
    }
    refreshAllUI();
}

function updateMissionProgress(type, amount, isAbsolute = false) {
    const profile = getCurrentProfile();
    if (!profile) return;
    profile.missions.forEach(m => {
        if (!m.claimed && m.type === type) {
            if (isAbsolute) m.progress = Math.max(m.progress, amount);
            else m.progress += amount;
        }
    });
}

// ==================== 9. EVENT LISTENERLAR VA INITSIALIZATSIYA ====================
document.addEventListener("DOMContentLoaded", () => {
    loadState();

    // Hide loader smoothly
    setTimeout(() => {
        const loader = document.getElementById("loader-screen");
        loader.style.opacity = "0";
        setTimeout(() => loader.classList.add("hidden"), 450);
    }, 950);

    // If user already logged in previously, prefill form or enter directly
    if (appState.currentUser && appState.users[appState.currentUser.username]) {
        const u = appState.currentUser;
        enterPlatform(u.username, u.age, u.category);
    }

    // Auth Form Submit
    document.getElementById("auth-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username-input").value.trim();
        const ageVal = document.getElementById("age-input").value.trim();
        const age = Number(ageVal);
        const errBox = document.getElementById("auth-error");

        if (!username || username.length < 2) {
            errBox.textContent = "⚠️ Iltimos, kamida 2 ta harfdan iborat username kiriting!";
            errBox.classList.remove("hidden");
            sfx.wrong();
            return;
        }
        if (!ageVal || isNaN(age) || age < 4 || age > 100) {
            errBox.textContent = "⚠️ Yosh noto'g'ri kiritildi! Iltimos, 4 dan 100 gacha bo'lgan yosh kiriting.";
            errBox.classList.remove("hidden");
            sfx.wrong();
            return;
        }

        errBox.classList.add("hidden");
        sfx.click();

        if (age === 21) {
            document.getElementById("age21-greeting").textContent = `Salom, ${username}! 21 yosh uchun alohida toifa belgilanmagan. O'zingizga mos bo'limni tanlang:`;
            document.getElementById("age21-modal").classList.remove("hidden");
            document.querySelectorAll(".age-choice-btn").forEach(btn => {
                btn.onclick = () => {
                    sfx.click();
                    enterPlatform(username, age, btn.dataset.group);
                };
            });
            return;
        }

        const category = detectAgeCategory(age);
        enterPlatform(username, age, category);
    });

    // Top Nav Controls
    document.getElementById("sound-toggle-btn").addEventListener("click", () => {
        appState.sound = !appState.sound;
        sfx.enabled = appState.sound;
        document.getElementById("sound-toggle-btn").textContent = appState.sound ? "🔊" : "🔇";
        if (appState.sound) sfx.click();
        saveState();
    });

    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        appState.theme = appState.theme === "dark" ? "light" : "dark";
        applyThemeAndGroup(activeCategory);
        sfx.click();
        saveState();
    });

    const openAuthSwitcher = () => {
        sfx.click();
        const profile = getCurrentProfile();
        if (profile) {
            document.getElementById("username-input").value = profile.username;
            document.getElementById("age-input").value = profile.age;
        }
        document.getElementById("app-shell").classList.add("hidden");
        document.getElementById("auth-screen").classList.remove("hidden");
    };

    document.getElementById("switch-user-btn").addEventListener("click", openAuthSwitcher);
    document.getElementById("edit-profile-btn").addEventListener("click", openAuthSwitcher);

    // Main Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            sfx.click();
            const target = btn.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".tab-content").forEach(sec => sec.classList.add("hidden"));
            document.getElementById(`tab-${target}`).classList.remove("hidden");
            refreshAllUI();
        });
    });

    // Category Switcher
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            sfx.click();
            activeCategory = btn.dataset.cat;
            refreshAllUI();
        });
    });

    // Claim All Missions
    document.getElementById("claim-all-btn").addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        let claimedAny = false;
        profile.missions.forEach(m => {
            if (!m.claimed && m.progress >= m.target) {
                m.claimed = true;
                profile.totalScore += m.rewardScore;
                profile.xp += m.rewardXp;
                claimedAny = true;
            }
        });
        if (claimedAny) {
            sfx.win();
            launchConfetti();
            saveState();
            refreshAllUI();
        } else {
            sfx.click();
        }
    });

    // Arena Buttons
    document.getElementById("arena-start-btn").addEventListener("click", () => {
        sfx.click();
        startActiveGame();
    });
    document.getElementById("check-answer-btn").addEventListener("click", verifyCurrentAnswer);
    document.getElementById("next-stage-btn").addEventListener("click", () => {
        sfx.click();
        advanceOrFinish();
    });
    document.getElementById("finish-endless-btn").addEventListener("click", () => {
        sfx.click();
        finishGameSession();
    });
    document.getElementById("restart-in-game-btn").addEventListener("click", () => {
        sfx.click();
        startActiveGame();
    });
    document.getElementById("play-again-btn").addEventListener("click", () => {
        sfx.click();
        startActiveGame();
    });

    const closeArena = () => {
        sfx.click();
        if (currentGameSession) clearInterval(currentGameSession.timerInterval);
        document.getElementById("game-arena").classList.add("hidden");
        refreshAllUI();
    };
    document.getElementById("exit-game-btn").addEventListener("click", closeArena);
    document.getElementById("back-to-menu-btn").addEventListener("click", closeArena);
});
