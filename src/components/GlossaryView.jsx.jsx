const GLOSSARY = [
  {
    category: "Dasar Agile/Scrum",
    terms: [
      {
        term: "Sprint",
        desc: "Periode kerja tetap (biasanya 1–4 minggu) buat nyelesain sekumpulan task.",
      },
      {
        term: "Backlog",
        desc: "Daftar semua kerjaan/fitur yang belum dikerjain, belum tentu udah dijadwalin ke sprint.",
      },
      {
        term: "Product Backlog",
        desc: "Daftar besar semua yang mau dikerjain di seluruh proyek, belum dipilah per sprint.",
      },
      {
        term: "Sprint Backlog",
        desc: "Subset dari product backlog yang udah dipilih buat dikerjain di sprint berjalan.",
      },
      {
        term: "User Story",
        desc: 'Deskripsi fitur dari sudut pandang user. Format umum: "Sebagai [role], saya ingin [aksi], supaya [tujuan]."',
      },
      {
        term: "Epic",
        desc: 'Kumpulan user story besar dengan tema sama, misal "Epic: Sistem Pembayaran" isinya banyak story kecil.',
      },
      {
        term: "Task",
        desc: "Pecahan kerjaan teknis dari sebuah story — lebih granular dan spesifik per developer.",
      },
    ],
  },
  {
    category: "Ritual/Meeting",
    terms: [
      {
        term: "Sprint Planning",
        desc: "Meeting buat nentuin apa aja yang masuk sprint berikutnya.",
      },
      {
        term: "Daily Standup",
        desc: "Meeting harian singkat: kemarin ngapain, hari ini ngapain, ada blocker apa.",
      },
      {
        term: "Sprint Review",
        desc: "Demo hasil kerja di akhir sprint ke stakeholder.",
      },
      {
        term: "Retrospective (Retro)",
        desc: "Evaluasi sprint yang udah lewat — apa yang jalan, apa yang enggak.",
      },
    ],
  },
  {
    category: "Estimasi & Ukuran",
    terms: [
      {
        term: "Velocity",
        desc: "Ukuran seberapa banyak kerjaan yang bisa diselesain tim per sprint, biasanya dihitung dari story points.",
      },
      {
        term: "Story Points",
        desc: "Unit estimasi effort/kompleksitas, bukan waktu literal. Skala umum: Fibonacci (1, 2, 3, 5, 8, 13...).",
      },
      {
        term: "Definition of Done (DoD)",
        desc: 'Kriteria yang harus dipenuhi biar task dianggap "selesai" — misal sudah di-test, di-review, dan deploy.',
      },
      {
        term: "Acceptance Criteria",
        desc: "Syarat spesifik yang harus dipenuhi biar sebuah story dianggap sukses/diterima.",
      },
    ],
  },
  {
    category: "Status & Alur Kerja",
    terms: [
      {
        term: "To Do / In Progress / In Review / Done",
        desc: "Kolom umum di kanban board yang menandai tahap sebuah task.",
      },
      {
        term: "Blocked",
        desc: "Task yang ketahan/nggak bisa lanjut karena ada dependency lain.",
      },
      {
        term: "WIP (Work In Progress)",
        desc: "Kerjaan yang lagi jalan. Sering dibatasi jumlahnya (WIP limit) biar tim nggak multitasking berlebihan.",
      },
    ],
  },
  {
    category: "Roadmap & Prioritas",
    terms: [
      {
        term: "Roadmap",
        desc: "Rencana jangka panjang, biasanya per kuartal/tahun.",
      },
      {
        term: "Milestone",
        desc: "Titik penting/target besar dalam roadmap.",
      },
      {
        term: "MVP (Minimum Viable Product)",
        desc: "Versi paling minimal dari produk yang udah bisa dipakai/diuji ke user.",
      },
      {
        term: "Technical Debt",
        desc: "Kerjaan/refactor yang ditunda demi kecepatan, tapi akan \u201cberbunga\u201d kalau dibiarin terus.",
      },
      {
        term: "Scope Creep",
        desc: "Fitur/requirement yang terus nambah di luar rencana awal, bikin timeline molor.",
      },
    ],
  },
  {
    category: "Metode/Framework",
    terms: [
      {
        term: "Scrum",
        desc: "Framework Agile paling umum — pakai sprint, standup, review, dan retro seperti di atas.",
      },
      {
        term: "Kanban",
        desc: "Fokus ke visualisasi alur kerja lewat board, tanpa sprint tetap (continuous flow).",
      },
      {
        term: "Waterfall",
        desc: "Model lama yang linear (requirement \u2192 design \u2192 build \u2192 test \u2192 deploy), beda dari Agile yang iteratif.",
      },
    ],
  },
];

export default function GlossaryView() {
  return (
    <div className="board">
      <div className="board-header">
        <div>
          <span className="board-eyebrow mono">REFERENSI</span>
          <h1 className="board-title">Istilah PM</h1>
          <p className="board-goal">
            Catatan istilah project management/Agile yang sering dipakai, biar alur kerja
            kamu lebih tersistematisasi.
          </p>
        </div>
      </div>

      <div className="glossary">
        {GLOSSARY.map((group) => (
          <section key={group.category} className="glossary-group">
            <h2 className="glossary-group-title">{group.category}</h2>
            <div className="glossary-list">
              {group.terms.map((item) => (
                <div key={item.term} className="glossary-item">
                  <span className="glossary-term mono">{item.term}</span>
                  <p className="glossary-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <style>{`
        .glossary {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .glossary-group-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          color: var(--ink-mid);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--line);
        }
        .glossary-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        .glossary-item {
          background: #fff;
          border: 1px solid var(--line);
          border-left: 3px solid var(--ink);
          border-radius: var(--radius-sm);
          padding: 10px 12px 12px;
          box-shadow: var(--shadow-card);
        }
        .glossary-term {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .glossary-desc {
          margin: 0;
          font-size: 13px;
          line-height: 1.45;
          color: var(--slate);
        }

        @media (max-width: 860px) {
          .glossary-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}