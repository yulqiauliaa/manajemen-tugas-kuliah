(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=localStorage.getItem(e);if(!n)return t;try{return JSON.parse(n)}catch{return t}}function t(e,t){localStorage.setItem(e,JSON.stringify(t))}var n=`TaskFlow Kuliah`,r=`1.0.0`,i=`kuliah_tasks_v1`;document.title=n,document.body.className=`bg-slate-50 text-slate-900 min-h-screen antialiased`;var a=e(i,{items:[{id:`task-1`,title:`Implementasi TypeScript & Vite`,courseName:`Pengembangan Aplikasi Web`,deadline:`2026-11-28`,sks:3,isCompleted:!1,status:`Belum Selesai`,priority:`Tinggi`}],lastUpdated:Date.now()}),o=null,s=`Semua`;function c(){a.lastUpdated=Date.now(),t(i,a)}function l(){let e=document.querySelector(`#app`);e&&(e.innerHTML=`
    <div class="max-w-4xl mx-auto px-4 py-8">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">${n}</h1>
            <span class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">v${r}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">Kelola jadwal dan progres tugas perkuliahan secara terstruktur.</p>
        </div>
        <div id="stats-badge" class="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg"></div>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        <section class="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200 h-fit">
          <h2 id="form-title" class="text-base font-semibold text-slate-900 mb-4">Tambah Tugas Baru</h2>
          <form id="task-form" class="space-y-3.5">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Judul Tugas</label>
              <input type="text" id="title" required placeholder="Contoh: Laporan Praktikum Git"
                class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Mata Kuliah</label>
              <input type="text" id="courseName" required placeholder="Contoh: Pengembangan Aplikasi Web"
                class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Bobot SKS</label>
                <input type="number" id="sks" min="1" max="6" value="3" required
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Prioritas</label>
                <select id="priority"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-600">
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang" selected>Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Tenggat Waktu (Deadline)</label>
              <input type="date" id="deadline" required
                class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600" />
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" id="submit-btn"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition cursor-pointer">
                Simpan Tugas
              </button>
              <button type="button" id="cancel-edit-btn"
                class="hidden bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 px-3 rounded-lg transition cursor-pointer">
                Batal
              </button>
            </div>
          </form>
        </section>

        <section class="md:col-span-7 space-y-4">
          <div class="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter Status</span>
            <div class="flex gap-1.5" id="filter-buttons">
              <button data-filter="Semua" class="filter-btn px-3 py-1 text-xs font-medium rounded-md cursor-pointer">Semua</button>
              <button data-filter="Belum Selesai" class="filter-btn px-3 py-1 text-xs font-medium rounded-md cursor-pointer">Belum Selesai</button>
              <button data-filter="Selesai" class="filter-btn px-3 py-1 text-xs font-medium rounded-md cursor-pointer">Selesai</button>
            </div>
          </div>

          <div id="task-list" class="space-y-3"></div>
        </section>
      </main>
    </div>
  `,d(),u())}function u(){let e=document.getElementById(`task-list`),t=document.getElementById(`stats-badge`);if(!e||!t)return;let n=a.items.length;t.textContent=`Selesai: ${a.items.filter(e=>e.isCompleted).length} / ${n} Tugas`,document.querySelectorAll(`.filter-btn`).forEach(e=>{e.className=e.dataset.filter===s?`filter-btn px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white cursor-pointer`:`filter-btn px-3 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer`});let r=a.items.filter(e=>s===`Semua`||e.status===s);e.innerHTML=r.length===0?`
      <div class="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <p class="text-sm text-slate-500">Tidak ada tugas pada kategori ini.</p>
      </div>
    `:r.map(e=>{let t=e.isCompleted?`bg-emerald-100 text-emerald-700`:`bg-amber-100 text-amber-800`,n=e.priority===`Tinggi`?`text-red-600 bg-red-50`:e.priority===`Sedang`?`text-blue-600 bg-blue-50`:`text-slate-600 bg-slate-100`;return`
        <article class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 transition hover:border-slate-300">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="px-2 py-0.5 text-[11px] font-semibold rounded-md ${t}">
                  ${e.status}
                </span>
                <span class="px-2 py-0.5 text-[11px] font-medium rounded-md ${n}">
                  Prioritas ${e.priority}
                </span>
                <span class="text-xs text-slate-400">• ${e.sks} SKS</span>
              </div>
              <h3 class="text-base font-semibold ${e.isCompleted?`line-through text-slate-400`:`text-slate-900`}">
                ${e.title}
              </h3>
              <p class="text-xs text-slate-600 mt-0.5">${e.courseName} — Deadline: <span class="font-medium">${e.deadline}</span></p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button data-action="toggle" data-id="${e.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer">
              ${e.isCompleted?`Tandai Belum Selesai`:`Tandai Selesai`}
            </button>
            <button data-action="edit" data-id="${e.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer">
              Edit
            </button>
            <button data-action="delete" data-id="${e.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer">
              Hapus
            </button>
          </div>
        </article>
      `}).join(``)}function d(){let e=document.getElementById(`task-form`),t=document.getElementById(`title`),n=document.getElementById(`courseName`),r=document.getElementById(`sks`),i=document.getElementById(`priority`),l=document.getElementById(`deadline`),d=document.getElementById(`form-title`),f=document.getElementById(`submit-btn`),p=document.getElementById(`cancel-edit-btn`),m=document.getElementById(`task-list`),h=()=>{o=null,e.reset(),r.value=`3`,d.textContent=`Tambah Tugas Baru`,f.textContent=`Simpan Tugas`,p.classList.add(`hidden`)};p.addEventListener(`click`,h),e.addEventListener(`submit`,e=>{e.preventDefault();let s=t.value.trim(),d=n.value.trim(),f=Number(r.value),p=i.value,m=l.value;s&&d&&m&&(a.items=o?a.items.map(e=>e.id===o?{...e,title:s,courseName:d,sks:f,priority:p,deadline:m}:e):[{id:`task-${Date.now()}`,title:s,courseName:d,sks:f,priority:p,deadline:m,isCompleted:!1,status:`Belum Selesai`},...a.items],c(),h(),u())}),document.querySelectorAll(`.filter-btn`).forEach(e=>{e.addEventListener(`click`,()=>{s=e.dataset.filter||`Semua`,u()})}),m.addEventListener(`click`,e=>{let s=e.target.closest(`button[data-action]`);if(!s)return;let m=s.dataset.action,g=s.dataset.id;if(g){if(m===`toggle`)a.items=a.items.map(e=>{if(e.id!==g)return e;let t=!e.isCompleted;return{...e,isCompleted:t,status:t?`Selesai`:`Belum Selesai`}}),c(),u();else if(m===`edit`){let e=a.items.find(e=>e.id===g);if(!e)return;o=e.id,t.value=e.title,n.value=e.courseName,r.value=String(e.sks),i.value=e.priority,l.value=e.deadline,d.textContent=`Edit Tugas`,f.textContent=`Update Tugas`,p.classList.remove(`hidden`),t.focus()}else m===`delete`&&(a.items=a.items.filter(e=>e.id!==g),o===g&&h(),c(),u())}})}l();