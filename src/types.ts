// 1. Type Alias & Union Type
export type TaskStatus = 'Belum Selesai' | 'Selesai';
export type PriorityLevel = 'Rendah' | 'Sedang' | 'Tinggi';

// 2. Interface dengan Primitive Types (string, number, boolean)
export interface CourseTask {
  id: string;
  title: string;
  courseName: string;
  deadline: string;
  sks: number;
  isCompleted: boolean;
  status: TaskStatus;
  priority: PriorityLevel;
}

// 3. Array Type
export type TaskList = CourseTask[];

// 4. Generics Sederhana
export interface AppState<T> {
  items: T[];
  lastUpdated: number;
}

export function loadStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}