# TaskFlow Kuliah — Aplikasi Manajemen Tugas Kuliah

Aplikasi web manajemen daftar tugas perkuliahan berbasis **TypeScript**, **Vite**, dan **Tailwind CSS v4** yang dibangun untuk memenuhi tugas mata kuliah **Pengembangan Aplikasi Web**.

## Fitur Utama

- **Daftar Tugas Kuliah**: Menampilkan daftar tugas beserta mata kuliah, bobot SKS, tingkat prioritas, tenggat waktu (*deadline*), dan ringkasan progres selesai.
- **Tambah Tugas Baru**: Formulir interaktif untuk menambahkan tugas perkuliahan baru.
- **Edit & Hapus Tugas**: Memperbarui informasi tugas yang sudah ada atau menghapus tugas dari daftar.
- **Manajemen & Filter Status**: Mengubah status tugas antara **Belum Selesai** dan **Selesai**, serta menyaring tampilan daftar berdasarkan status.
- **Penyimpanan Lokal (*Type-Safe*)**: Menyimpan data tugas secara otomatis di browser menggunakan `localStorage` dengan fungsi TypeScript Generics.
- **Tampilan Responsif**: Tata letak adaptif untuk layar desktop maupun perangkat *mobile* menggunakan Tailwind CSS.

## Teknologi yang Digunakan

- **Vite** — *Build tool* dan *development server* modern
- **TypeScript** — Penulisan logika aplikasi dengan *static type checking*
- **Tailwind CSS v4** (`@tailwindcss/vite`) — *Utility-first CSS framework*
- **Web Storage API (`localStorage`)** — Persistensi data di sisi klien

## Struktur Proyek

```text
manajemen-tugas-kuliah/
├── src/
│   ├── main.ts          # Logika utama aplikasi, CRUD, event handling, dan rendering UI
│   ├── style.css        # Konfigurasi Tailwind CSS
│   └── types.ts         # Definisi tipe TypeScript (interface, union type, generics, storage helper)
├── .env                 # Konfigurasi environment lokal (tidak diunggah ke GitHub)
├── .env.example         # Template konfigurasi environment variables
├── .gitignore           # Daftar file dan folder yang dikecualikan dari Git
├── index.html           # Halaman utama aplikasi
├── package.json         # Konfigurasi dependencies, devDependencies, dan npm scripts
├── tsconfig.json        # Konfigurasi compiler TypeScript
└── vite.config.ts       # Konfigurasi Vite dan plugin Tailwind CSS
