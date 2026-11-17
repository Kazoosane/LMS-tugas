const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const STORAGE_KEY = 'lms-library-framework-v1';

const SEED = [
  {
    id: "c1", title: "Pengenalan Library & npm", desc: "Memahami library, framework, dan cara mengelola package dengan npm.",
    modules: [
      { title: "Modul 1: Konsep Dasar", lessons: [
        { id: "c1-1", title: "Library vs Framework", content: "Library adalah kumpulan fungsi siap pakai yang kita panggil sesuai kebutuhan. Framework menyediakan kerangka kerja, dan alur programnya yang memanggil kode kita (inversion of control)." },
        { id: "c1-2", title: "Apa itu npm?", content: "npm (Node Package Manager) adalah alat untuk mengunduh, memasang, dan mengelola library dari registry npm." }
      ]},
      { title: "Modul 2: Mengelola Package", lessons: [
        { id: "c1-3", title: "Menginstal library", content: "Jalankan npm install nama-library di folder proyek. Library akan masuk ke folder node_modules." },
        { id: "c1-4", title: "File package.json", content: "package.json mencatat nama proyek dan daftar dependensi. Dengan file ini, orang lain cukup menjalankan npm install untuk memasang ulang semua library." }
      ]}
    ],
    quiz: [
      { q: "Perbedaan utama library dan framework adalah...", options: ["Library yang memanggil kode kita, framework yang kita panggil", "Kita yang memanggil library, framework yang mengatur alur program", "Keduanya sama persis"], answer: 1 },
      { q: "Perintah npm untuk menginstal library ke proyek adalah...", options: ["npm get", "npm install", "npm add-lib"], answer: 1 },
      { q: "File yang mencatat daftar dependensi proyek adalah...", options: ["index.html", "package.json", "README.md"], answer: 1 }
    ]
  },
  {
    id: "c2", title: "Library di React", desc: "Menggunakan library eksternal di proyek React, dari instalasi sampai pemakaian.",
    modules: [
      { title: "Modul 1: Instalasi dan Import", lessons: [
        { id: "c2-1", title: "Instalasi library di React", content: "Di dalam proyek React (misalnya dibuat dengan Vite), jalankan npm install axios. Setelah itu library siap dipakai di seluruh proyek." },
        { id: "c2-2", title: "Import library ke komponen", content: "Impor library di bagian atas file komponen, misalnya import axios from 'axios';. Nama yang diimpor bebas, tetapi biasanya mengikuti nama library." }
      ]},
      { title: "Modul 2: Contoh Praktis", lessons: [
        { id: "c2-3", title: "Routing dengan React Router", content: "Bungkus aplikasi dengan BrowserRouter, lalu definisikan halaman dengan Routes dan Route. Library ini membuat navigasi antar halaman tanpa memuat ulang browser." },
        { id: "c2-4", title: "Mengambil data dengan Axios", content: "Panggil axios.get('/api/data') di dalam useEffect saat komponen pertama kali dirender, lalu simpan hasilnya dengan useState." }
      ]}
    ],
    quiz: [
      { q: "Perintah untuk menginstal axios ke proyek React adalah...", options: ["npm install axios", "import axios", "npm run axios"], answer: 0 },
      { q: "Cara mengimpor library ke komponen React adalah...", options: ["import axios from 'axios';", "require axios;", "include 'axios';"], answer: 0 },
      { q: "Hook yang tepat untuk memanggil API saat komponen pertama kali dirender adalah...", options: ["useState", "useEffect", "useRef"], answer: 1 },
      { q: "Komponen yang membungkus aplikasi agar routing React Router aktif adalah...", options: ["<Router>", "<BrowserRouter>", "<Route>"], answer: 1 }
    ]
  },
  {
    id: "c3", title: "Library di Vue", desc: "Menggunakan library dan plugin di aplikasi Vue.",
    modules: [
      { title: "Modul 1: Instalasi", lessons: [
        { id: "c3-1", title: "Instalasi library di Vue", content: "Di proyek Vue, jalankan npm install vue-router atau npm install axios sesuai kebutuhan. Library akan langsung tercatat di package.json." },
        { id: "c3-2", title: "Mengimpor library di komponen", content: "Pada blok <script setup>, gunakan import untuk memakai library. Contoh: import axios from 'axios';." }
      ]},
      { title: "Modul 2: Plugin", lessons: [
        { id: "c3-3", title: "Mendaftarkan plugin dengan app.use()", content: "Plugin seperti Vue Router didaftarkan ke aplikasi dengan app.use(router) di file main.js sebelum aplikasi di-mount." },
        { id: "c3-4", title: "Mengambil data dengan Axios", content: "Gunakan axios.get() di dalam onMounted untuk mengambil data saat komponen dipasang, lalu simpan hasilnya di ref." }
      ]}
    ],
    quiz: [
      { q: "Cara mendaftarkan Vue Router ke aplikasi Vue adalah...", options: ["app.use(router)", "app.register(router)", "app.load(router)"], answer: 0 },
      { q: "Cara paling umum mengimpor library ke komponen Vue adalah...", options: ["Mengimpor dengan import di blok script atau script setup", "Menulis library langsung di file .html", "Menyalin kode library ke dalam template"], answer: 0 },
      { q: "Method Axios untuk mengambil data adalah...", options: ["axios.get()", "axios.fetch()", "axios.read()"], answer: 0 }
    ]
  }
];

// State utama. Progres (done, scores) dan status login disimpan ke localStorage.
const state = {
  user: null,
  view: 'dashboard',
  courseId: null,
  openLesson: null,
  courses: JSON.parse(JSON.stringify(SEED)),
  done: {},      // { lessonId: true }
  scores: {}     // { courseId: { score, total } }
};

// ---------- Penyimpanan lokal (localStorage) ----------
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      state.done = data.done && typeof data.done === 'object' ? data.done : {};
      state.scores = data.scores && typeof data.scores === 'object' ? data.scores : {};
      state.user = data.user && data.user.name ? data.user : null;
    }
  } catch (err) {
    console.warn('Gagal memuat progres:', err);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      done: state.done,
      scores: state.scores,
      user: state.user
    }));
  } catch (err) {
    console.warn('Gagal menyimpan progres:', err);
  }
}

function resetProgress() {
  state.done = {};
  state.scores = {};
  try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* abaikan */ }
  if (state.user) saveProgress();
}

// ---------- Helper ----------
const isTeacher = () => state.user?.role === 'pengajar';
const currentCourse = () => state.courses.find(c => c.id === state.courseId);
const lessonsOf = c => c.modules.flatMap(m => m.lessons);
function progressOf(c) {
  const ls = lessonsOf(c);
  if (!ls.length) return 0;
  return Math.round(ls.filter(l => state.done[l.id]).length / ls.length * 100);
}
const pct = s => Math.round(s.score / s.total * 100);

// ---------- Tampilan ----------
function loginHtml() {
  return `<div class="login"><form id="login-form" class="card login-card">
    <h1>🎓 LMS Library di Framework</h1>
    <label>Nama<input name="nama" required placeholder="Nama lengkap"></label>
    <label>Peran<select name="peran"><option value="siswa">Siswa</option><option value="pengajar">Pengajar</option></select></label>
    <button class="primary" style="width:100%">Masuk</button>
  </form></div>`;
}

function shell(content) {
  const nav = [['dashboard', '🏠 Beranda'], ['courses', '📚 Kursus'], ['progress', '📈 Progres']];
  if (isTeacher()) nav.push(['add', '➕ Tambah Kursus']);
  return `<div class="app">
    <aside class="sidebar">
      <div class="brand">🎓 LMS</div>
      <nav>${nav.map(([k, l]) => `<button class="nav-btn ${state.view === k ? 'active' : ''}" data-nav="${k}">${l}</button>`).join('')}</nav>
      <div class="me">
        <div><strong>${esc(state.user.name)}</strong><br><small class="muted">${isTeacher() ? 'Pengajar' : 'Siswa'}</small></div>
        <button class="ghost" data-action="logout">Keluar</button>
      </div>
    </aside>
    <main>${content}</main>
  </div>`;
}

function stat(label, value) {
  return `<div class="card stat"><span class="muted small">${label}</span><strong>${value}</strong></div>`;
}

function cardsHtml(list) {
  if (!list.length) return '<p class="muted">Belum ada kursus.</p>';
  return `<div class="grid">${list.map(c => {
    const p = progressOf(c);
    return `<div class="card stack">
      <h3 style="margin:0">${esc(c.title)}</h3>
      <p class="muted" style="margin:0">${esc(c.desc)}</p>
      <div><div class="bar"><span style="width:${p}%"></span></div><span class="muted small">${p}% selesai</span></div>
      <div class="row">
        <button class="primary" data-open="${esc(c.id)}">${p ? 'Lanjutkan' : 'Mulai'}</button>
        ${isTeacher() ? `<button class="danger ghost" data-delete="${esc(c.id)}">Hapus</button>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function dashboardView() {
  const scores = Object.values(state.scores);
  const avg = scores.length ? Math.round(scores.reduce((a, s) => a + pct(s), 0) / scores.length) + '%' : '-';
  return `<h1>Halo, ${esc(state.user.name)} 👋</h1>
    <p class="muted">Selamat datang! Yuk lanjutkan belajarmu.</p>
    <div class="stats">
      ${stat('Kursus tersedia', state.courses.length)}
      ${stat('Materi selesai', Object.keys(state.done).length)}
      ${stat('Rata-rata kuis', avg)}
    </div>
    <h2>Kursus</h2>${cardsHtml(state.courses)}`;
}

function coursesView() {
  return `<h1>Kursus</h1>${cardsHtml(state.courses)}`;
}

function quizHtml(c) {
  if (!c.quiz.length) return '';
  const s = state.scores[c.id];
  let inner;
  if (s) {
    inner = `<p><strong>Nilai: ${s.score}/${s.total} (${pct(s)}%)</strong></p>
      <button class="ghost" data-retake="${esc(c.id)}">Ulangi kuis</button>`;
  } else if (progressOf(c) < 100) {
    inner = `<p class="muted">Selesaikan semua materi untuk membuka kuis.</p>`;
  } else {
    inner = `<form id="quiz-form">${c.quiz.map((q, i) => `
      <fieldset><legend>${i + 1}. ${esc(q.q)}</legend>
        ${q.options.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}" required> ${esc(o)}</label>`).join('')}
      </fieldset>`).join('')}
      <button class="primary">Kirim jawaban</button></form>`;
  }
  return `<section class="card" style="margin-top:20px"><h2 style="margin-top:0">Kuis</h2>${inner}</section>`;
}

function courseView() {
  const c = currentCourse();
  const p = progressOf(c);
  const modules = c.modules.map(m => `
    <h3>${esc(m.title)}</h3>
    ${m.lessons.map(l => {
      const d = !!state.done[l.id];
      return `<div class="lesson">
        <button class="check ${d ? 'done' : ''}" data-done="${esc(l.id)}" title="Tandai selesai">${d ? '✔' : '○'}</button>
        <button class="title" data-lesson="${esc(l.id)}">${esc(l.title)}</button>
      </div>
      ${state.openLesson === l.id ? `<div class="content">${esc(l.content)}</div>` : ''}`;
    }).join('')}`).join('');
  return `<button class="ghost" data-nav="courses">← Kembali</button>
    <div class="card" style="margin-top:12px">
      <h1 style="margin-bottom:4px">${esc(c.title)}</h1>
      <p class="muted">${esc(c.desc)}</p>
      <div class="bar"><span style="width:${p}%"></span></div>
      <span class="muted small">${p}% selesai</span>
      <div style="margin-top:16px">${modules || '<p class="muted">Belum ada materi.</p>'}</div>
    </div>
    ${quizHtml(c)}`;
}

function progressView() {
  if (!state.courses.length) return '<h1>Progres</h1><p class="muted">Belum ada kursus.</p>';
  const cards = state.courses.map(c => {
    const s = state.scores[c.id];
    const p = progressOf(c);
    return `<div class="card">
      <div class="row"><strong>${esc(c.title)}</strong><span class="muted small">${p}% materi</span></div>
      <div class="bar"><span style="width:${p}%"></span></div>
      <p class="muted small" style="margin:0">Kuis: ${s ? `${s.score}/${s.total} (${pct(s)}%)` : 'belum dikerjakan'}</p>
    </div>`;
  }).join('');
  return `<div class="row"><h1>Progres Saya</h1>
    <button class="danger ghost" data-action="reset">Reset progres</button></div>
    <div class="stack">${cards}</div>
    <p class="muted small">Progres disimpan di browser ini.</p>`;
}

function addView() {
  return `<h1>Tambah Kursus</h1>
    <form id="add-form" class="card form-card">
      <label>Judul kursus<input name="judul" required></label>
      <label>Deskripsi<textarea name="deskripsi" rows="2"></textarea></label>
      <label>Materi (satu per baris, format: <em>Judul | isi materi</em>)
        <textarea name="materi" rows="6" required placeholder="Pengenalan | Isi materi..."></textarea></label>
      <button class="primary">Simpan kursus</button>
    </form>`;
}

function render() {
  const root = $('#root');
  if (!state.user) { root.innerHTML = loginHtml(); return; }
  if (state.view === 'course' && !currentCourse()) state.view = 'courses';
  const views = {
    dashboard: dashboardView,
    courses: coursesView,
    course: courseView,
    progress: progressView,
    add: () => isTeacher() ? addView() : dashboardView()
  };
  root.innerHTML = shell((views[state.view] || dashboardView)());
}

function toggleDone(lessonId) {
  if (state.done[lessonId]) delete state.done[lessonId];
  else state.done[lessonId] = true;
}

// ---------- Event klik ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-nav],[data-open],[data-lesson],[data-done],[data-retake],[data-delete],[data-action]');
  if (!t) return;
  const d = t.dataset;
  if (d.nav) { state.view = d.nav; state.courseId = null; state.openLesson = null; }
  if (d.open) { state.view = 'course'; state.courseId = d.open; state.openLesson = null; }
  if (d.lesson) state.openLesson = state.openLesson === d.lesson ? null : d.lesson;
  if (d.done) toggleDone(d.done);
  if (d.retake) delete state.scores[d.retake];
  if (d.delete) {
    state.courses = state.courses.filter(c => c.id !== d.delete);
    state.view = 'courses';
    state.courseId = null;
  }
  if (d.action === 'logout') { state.user = null; state.view = 'dashboard'; state.courseId = null; }
  if (d.action === 'reset') resetProgress();

  saveProgress();
  render();
});

// ---------- Event submit form ----------
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const fd = new FormData(f);

  if (f.id === 'login-form') {
    const nama = fd.get('nama').trim();
    if (!nama) return;
    state.user = { name: nama, role: fd.get('peran') };
    state.view = 'dashboard';
  }

  if (f.id === 'quiz-form') {
    const c = currentCourse();
    let score = 0;
    c.quiz.forEach((q, i) => { if (Number(fd.get('q' + i)) === q.answer) score++; });
    state.scores[c.id] = { score, total: c.quiz.length };
  }

  if (f.id === 'add-form' && isTeacher()) {
    const judul = fd.get('judul').trim();
    const lines = fd.get('materi').split('\n').map(s => s.trim()).filter(Boolean);
    if (!judul || !lines.length) return;
    const id = 'c' + Date.now();
    const lessons = lines.map((ln, i) => {
      const [t, ...rest] = ln.split('|');
      return { id: `${id}-${i}`, title: t.trim(), content: rest.join('|').trim() || 'Materi belum diisi.' };
    });
    state.courses.push({ id, title: judul, desc: fd.get('deskripsi').trim(), modules: [{ title: 'Materi', lessons }], quiz: [] });
    state.view = 'courses';
  }

  saveProgress();
  render();
});

// ---------- Mulai ----------
loadProgress();
render();