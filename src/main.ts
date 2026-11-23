/// <reference types="vite/client" />
import './style.css';
import type { AppState, CourseTask, PriorityLevel, TaskList, TaskStatus } from './types';
import { loadStorage, saveStorage } from './types';

const APP_NAME: string = import.meta.env.VITE_APP_NAME || 'TaskFlow Kuliah';
const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '1.0.0';
const STORAGE_KEY = 'kuliah_tasks_v1';

document.title = APP_NAME;
document.body.className = 'bg-slate-50 text-slate-900 min-h-screen antialiased';

let state: AppState<CourseTask> = loadStorage<AppState<CourseTask>>(STORAGE_KEY, {
  items: [
    {
      id: 'task-1',
      title: 'Implementasi TypeScript & Vite',
      courseName: 'Pengembangan Aplikasi Web',
      deadline: '2026-11-28',
      sks: 3,
      isCompleted: false,
      status: 'Belum Selesai',
      priority: 'Tinggi',
    },
  ],
  lastUpdated: Date.now(),
});

let editingTaskId: string | null = null;
let currentFilter: 'Semua' | TaskStatus = 'Semua';

function persistState(): void {
  state.lastUpdated = Date.now();
  saveStorage<AppState<CourseTask>>(STORAGE_KEY, state);
}

function renderLayout(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">${APP_NAME}</h1>
            <span class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">v${APP_VERSION}</span>
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
      <footer class="text-center text-xs text-slate-400 mt-8">Dibuat oleh Yulqi Aulia • 2026</footer>
    </div>
  `;

  bindEvents();
  renderTasks();
}

function renderTasks(): void {
  const listContainer = document.getElementById('task-list');
  const statsBadge = document.getElementById('stats-badge');
  if (!listContainer || !statsBadge) return;

  const total: number = state.items.length;
  const completedCount: number = state.items.filter((t) => t.isCompleted).length;
  statsBadge.textContent = `Selesai: ${completedCount} / ${total} Tugas`;

  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.className = isActive
      ? 'filter-btn px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white cursor-pointer'
      : 'filter-btn px-3 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
  });

  const filteredTasks: TaskList = state.items.filter((task) => {
    if (currentFilter === 'Semua') return true;
    return task.status === currentFilter;
  });

  if (filteredTasks.length === 0) {
    listContainer.innerHTML = `
      <div class="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <p class="text-sm text-slate-500">Tidak ada tugas pada kategori ini.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filteredTasks
    .map((task) => {
      const statusBadgeClass = task.isCompleted
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-800';

      const priorityBadgeClass =
        task.priority === 'Tinggi'
          ? 'text-red-600 bg-red-50'
          : task.priority === 'Sedang'
          ? 'text-blue-600 bg-blue-50'
          : 'text-slate-600 bg-slate-100';

      return `
        <article class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 transition hover:border-slate-300">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="px-2 py-0.5 text-[11px] font-semibold rounded-md ${statusBadgeClass}">
                  ${task.status}
                </span>
                <span class="px-2 py-0.5 text-[11px] font-medium rounded-md ${priorityBadgeClass}">
                  Prioritas ${task.priority}
                </span>
                <span class="text-xs text-slate-400">• ${task.sks} SKS</span>
              </div>
              <h3 class="text-base font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}">
                ${task.title}
              </h3>
              <p class="text-xs text-slate-600 mt-0.5">${task.courseName} — Deadline: <span class="font-medium">${task.deadline}</span></p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button data-action="toggle" data-id="${task.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer">
              ${task.isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
            </button>
            <button data-action="edit" data-id="${task.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer">
              Edit
            </button>
            <button data-action="delete" data-id="${task.id}"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer">
              Hapus
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function bindEvents(): void {
  const form = document.getElementById('task-form') as HTMLFormElement;
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const courseInput = document.getElementById('courseName') as HTMLInputElement;
  const sksInput = document.getElementById('sks') as HTMLInputElement;
  const prioritySelect = document.getElementById('priority') as HTMLSelectElement;
  const deadlineInput = document.getElementById('deadline') as HTMLInputElement;
  const formTitle = document.getElementById('form-title') as HTMLHeadingElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const cancelBtn = document.getElementById('cancel-edit-btn') as HTMLButtonElement;
  const taskListEl = document.getElementById('task-list') as HTMLDivElement;

  const resetForm = (): void => {
    editingTaskId = null;
    form.reset();
    sksInput.value = '3';
    formTitle.textContent = 'Tambah Tugas Baru';
    submitBtn.textContent = 'Simpan Tugas';
    cancelBtn.classList.add('hidden');
  };

  cancelBtn.addEventListener('click', resetForm);

  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();

    const title: string = titleInput.value.trim();
    const courseName: string = courseInput.value.trim();
    const sks: number = Number(sksInput.value);
    const priority = prioritySelect.value as PriorityLevel;
    const deadline: string = deadlineInput.value;

    if (!title || !courseName || !deadline) return;

    if (editingTaskId) {
      state.items = state.items.map((item) =>
        item.id === editingTaskId
          ? { ...item, title, courseName, sks, priority, deadline }
          : item
      );
    } else {
      const newTask: CourseTask = {
        id: `task-${Date.now()}`,
        title,
        courseName,
        sks,
        priority,
        deadline,
        isCompleted: false,
        status: 'Belum Selesai',
      };
      state.items = [newTask, ...state.items];
    }

    persistState();
    resetForm();
    renderTasks();
  });

  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = (btn.dataset.filter as 'Semua' | TaskStatus) || 'Semua';
      renderTasks();
    });
  });

  taskListEl.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!id) return;

    if (action === 'toggle') {
      state.items = state.items.map((item) => {
        if (item.id !== id) return item;
        const nextCompleted = !item.isCompleted;
        return {
          ...item,
          isCompleted: nextCompleted,
          status: nextCompleted ? 'Selesai' : 'Belum Selesai',
        };
      });
      persistState();
      renderTasks();
    } else if (action === 'edit') {
      const targetTask = state.items.find((item) => item.id === id);
      if (!targetTask) return;

      editingTaskId = targetTask.id;
      titleInput.value = targetTask.title;
      courseInput.value = targetTask.courseName;
      sksInput.value = String(targetTask.sks);
      prioritySelect.value = targetTask.priority;
      deadlineInput.value = targetTask.deadline;

      formTitle.textContent = 'Edit Tugas';
      submitBtn.textContent = 'Update Tugas';
      cancelBtn.classList.remove('hidden');
      titleInput.focus();
    } else if (action === 'delete') {
      state.items = state.items.filter((item) => item.id !== id);
      if (editingTaskId === id) resetForm();
      persistState();
      renderTasks();
    }
  });
}

renderLayout();