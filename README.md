# Sprintline

Tracker sprint & backlog sederhana. Semua data disimpan di localStorage
browser lo — tidak ada server, tidak ada akun, jalan 100% di sisi lo sendiri.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build untuk production (opsional)

```bash
npm run build
npm run preview
```

## Cara pakai

- **Backlog** — tempat nyatet semua tugas sebelum dijadwalin ke sprint.
- **Sprint baru** — tombol di sidebar bawah, isi nama, tujuan, dan
  tanggal mulai/selesai.
- Buka sprint, tambah tugas langsung ke sprint itu, atau pindahin task
  dari backlog lewat tombol "Ubah" (klik kartu task) lalu ganti field Sprint.
- Drag task antar kolom (To Do / Doing / Done) buat update status.
- Klik **Buat Lanjutan** untuk membuat sprint berikutnya dengan nomor dan rentang tanggal otomatis. Rantai dua sprint atau lebih tampil sebagai folder di sidebar.
- Gunakan **Buat task spesific backlog** di atas board untuk menyimpan task khusus, lalu keluarkan ke sprint aktif atau sprint lain dalam rantai yang sama.
- Klik nama sprint di board buat ubah tanggal/tujuan, atau hapus sprint
  (task-nya otomatis balik ke backlog, tidak ikut kehapus).

## Struktur data (localStorage)

- `sprintline:sprints` — daftar sprint
- `sprintline:tasks` — daftar semua task (backlog + yang ada di sprint)

Reset total: buka DevTools > Application > Local Storage > hapus dua key
di atas.

## Struktur folder

```
src/
  lib/storage.js       # semua logic baca/tulis localStorage
  components/
    Sidebar.jsx         # navigasi backlog + daftar sprint
    BacklogView.jsx      # list task yang belum masuk sprint
    SprintBoard.jsx       # kanban board (To Do/Doing/Done) + progress bar
    TaskCard.jsx           # kartu task
    TaskModal.jsx            # form tambah/ubah task
    SprintModal.jsx           # form tambah/ubah sprint
  App.jsx                      # nyatuin semua state & view
  app.css                        # semua styling
```

Mau nambah fitur (misal: filter prioritas, export JSON, dark mode)
tinggal edit `App.jsx` dan `storage.js` — semuanya plain React state,
tidak ada state management library tambahan biar gampang di-trace.
