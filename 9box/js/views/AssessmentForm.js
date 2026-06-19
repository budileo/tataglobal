import { store } from '../store.js';

export default function AssessmentForm() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';

  const employees = store.getEmployees();
  const periods = store.getPeriods();

  container.innerHTML = `
    <div>
      <h2 class="text-3xl font-bold tracking-tight text-slate-800">Form Asesmen Baru</h2>
      <p class="text-slate-500 mt-1">Penilaian Potensial Leadership dan Performa KPI (9-Box Matrix)</p>
    </div>

    <form id="assessment-form" class="space-y-8">
      
      <!-- DATA UTAMA -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i data-feather="info" class="text-blue-500"></i> Data Asesmen
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Periode</label>
            <input type="text" id="as-period" required list="period-list" placeholder="Contoh: Q1 2026" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <datalist id="period-list">
              ${periods.map(p => `<option value="${p}">`).join('')}
            </datalist>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Karyawan dinilai</label>
            <select id="as-employee" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Pilih Karyawan --</option>
              ${employees.map(e => `<option value="${e.id}">${e.name} (${e.position})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nama Asesor / Penilai</label>
            <input type="text" id="as-assessor" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
            <input type="date" id="as-date" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <!-- BAGIAN 1: POTENSIAL LEADERSHIP (Sumbu Y) -->
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
        <h3 class="text-2xl font-bold text-slate-800 mb-2">1. Potensial Leadership</h3>
        <p class="text-slate-500 mb-6 pb-4 border-b">Menilai kemampuan memimpin, memengaruhi, dan berkembang (Sumbu Y).</p>
        
        <div class="space-y-6">
          ${renderSelectBox('l_influence', '1. Influence (Pengaruh)', 'Kemampuan meyakinkan orang, mengubah pendapat, ide diterima.', [
            '1 - Tidak pernah', '2 - Pernah tapi gagal', '3 - Kadang berhasil', '4 - Sering berhasil', '5 - Sangat kuat mempengaruhi'
          ])}
          ${renderSelectBox('l_ownership', '2. Ownership', 'Ambil tanggung jawab di luar tugas, selesaikan masalah ekstra.', [
            '1 - Nunggu disuruh', '2 - Kadang bantu', '3 - Cukup tanggung jawab', '4 - Proaktif', '5 - Sangat ownership'
          ])}
          ${renderSelectBox('l_decision', '3. Decision Making', 'Keputusan sulit & saat dalam tekanan.', [
            '1 - Menghindari', '2 - Ikut orang lain', '3 - Keputusan sederhana', '4 - Tepat & berani', '5 - Tegas & berdampak'
          ])}
          ${renderSelectBox('l_people', '4. People Development', 'Membantu orang berkembang, mengajari/membimbing.', [
            '1 - Tidak pernah', '2 - Jarang', '3 - Basic', '4 - Aktif membantu', '5 - Dampak nyata'
          ])}
          ${renderSelectBox('l_integrity', '5. Integrity & Value', 'Jujur walau berisiko, konsisten dengan nilai.', [
            '1 - Menghindar', '2 - Kompromi', '3 - Netral', '4 - Jujur walau sulit', '5 - Sangat berprinsip'
          ])}
          ${renderSelectBox('l_closing', '6. Nilai Penutup (Sikap Karyawan)', 'Kejujuran, Kedewasaan, Cara Berpikir (Catatan closing).', [
            '1 - Pencitraan / defensif', '2 - Kurang jujur / kurang dewasa', '3 - Cukup jujur, mulai reflektif', '4 - Jujur, dewasa, solutif', '5 - Sangat reflektif, growth mindset'
          ])}
        </div>
      </div>

      <!-- BAGIAN 2: PERFORMA KPI (Sumbu X) -->
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
        <h3 class="text-2xl font-bold text-slate-800 mb-2">2. Performa KPI</h3>
        <p class="text-slate-500 mb-6 pb-4 border-b">Menilai produktivitas, kualitas, efisiensi kerja berdasarkan data (Sumbu X).</p>
        
        <div class="space-y-6">
          ${renderSelectBox('k_prod', '1. Produktivitas (Target vs Realisasi)', 'Mencapai target volume/kuantitas, konsistensi output.', [
            '1 - Di bawah target (≤75%)', '2 - Mendekati target (76-89%)', '3 - Mencapai target (90-100%)', '4 - Melebihi target (101-115%)', '5 - Jauh melebihi target (>115%)'
          ])}
          ${renderSelectBox('k_qual', '2. Kualitas Kerja', 'Tingkat error, akurasi pekerjaan.', [
            '1 - Banyak kesalahan (>10%)', '2 - Cukup banyak (6-10%)', '3 - Standar (3-5%)', '4 - Baik (1-2%)', '5 - Excellent (<1%)'
          ])}
          ${renderSelectBox('k_eff', '3. Efisiensi & Deadline', 'Ketepatan waktu, optimasi sumber daya.', [
            '1 - Sering terlambat (<70%)', '2 - Kadang terlambat (70-79%)', '3 - Cukup tepat (80-89%)', '4 - Tepat waktu (90-99%)', '5 - Selalu tepat waktu (100%)'
          ])}
          ${renderSelectBox('k_init', '4. Inisiatif & Improvement', 'Usulan perbaikan, inovasi.', [
            '1 - Tidak pernah', '2 - Jarang (1-2x)', '3 - Cukup (3-4x)', '4 - Aktif (5-6x dampaknya)', '5 - Sangat inovatif'
          ])}
          ${renderSelectBox('k_collab', '5. Kolaborasi Tim', 'Membantu rekan, dampak ke pencapaian tim.', [
            '1 - Bekerja sendiri', '2 - Kadang membantu', '3 - Cukup kooperatif', '4 - Aktif berkontribusi', '5 - Kunci keberhasilan'
          ])}
          ${renderSelectBox('k_closing', '6. Komitmen KPI (Penutup)', 'Tanggungjawab bila target tidak tercapai.', [
            '1 - Defensif / menyalahkan', '2 - Menghindar', '3 - Cukup jujur', '4 - Dewasa, ada action plan', '5 - Growth mindset jelas'
          ])}
        </div>
      </div>

      <!-- KESIMPULAN -->
      <div class="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <label class="block text-amber-900 font-bold mb-2">Kesimpulan Asesor & Rekomendasi (Opsional)</label>
        <textarea id="as-notes" rows="3" class="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white" placeholder="Tulis catatan penting..."></textarea>
      </div>

      <div class="flex justify-end pt-4 pb-12">
        <button type="submit" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 text-lg flex items-center gap-3">
          <i data-feather="save"></i> Simpan & Lihat Hasil 9-Box
        </button>
      </div>

    </form>
  `;

  function renderSelectBox(id, title, desc, options) {
    return \`
      <div class="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-[15px]">\${title}</h4>
            <p class="text-xs text-slate-500 mt-1">\${desc}</p>
          </div>
          <select id="\${id}" required class="w-full md:w-64 px-3 py-2 border border-slate-300 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500">
            <option value="">-- Pilih Nilai --</option>
            \${options.map((opt, i) => \`<option value="\${i+1}">\${opt}</option>\`).join('')}
          </select>
        </div>
      </div>
    \`;
  }

  setTimeout(() => {
    if (window.feather) window.feather.replace();
    
    // Set default date today
    container.querySelector('#as-date').valueAsDate = new Date();

    container.querySelector('#assessment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const period = container.querySelector('#as-period').value;
      const employeeId = container.querySelector('#as-employee').value;
      const assessor = container.querySelector('#as-assessor').value;
      const date = container.querySelector('#as-date').value;
      const notes = container.querySelector('#as-notes').value;
      
      // Save period if new
      store.savePeriod(period);

      // Collect scores
      const leadershipScores = {
        influence: parseInt(container.querySelector('#l_influence').value),
        ownership: parseInt(container.querySelector('#l_ownership').value),
        decision: parseInt(container.querySelector('#l_decision').value),
        people: parseInt(container.querySelector('#l_people').value),
        integrity: parseInt(container.querySelector('#l_integrity').value),
        closing: parseInt(container.querySelector('#l_closing').value),
      };

      const kpiScores = {
        prod: parseInt(container.querySelector('#k_prod').value),
        qual: parseInt(container.querySelector('#k_qual').value),
        eff: parseInt(container.querySelector('#k_eff').value),
        init: parseInt(container.querySelector('#k_init').value),
        collab: parseInt(container.querySelector('#k_collab').value),
        closing: parseInt(container.querySelector('#k_closing').value),
      };

      const totalLeadership = Object.values(leadershipScores).reduce((a, b) => a + b, 0);
      const totalKpi = Object.values(kpiScores).reduce((a, b) => a + b, 0);

      // Determine 9-box category logically.
      // Sumbu X (Performa KPI) = max 30
      // Sumbu Y (Potensial LDR) = max 30
      // Usually categorized as Low(1-15), Med(16-22), High(23-30) for simpler logic or logic defined in requirements.
      // In user's HTML it says > 26 is Future Leader etc. 
      // But 9 box matrix needs both axes.
      
      let xLevel = totalKpi <= 16 ? 0 : (totalKpi <= 24 ? 1 : 2); // 0=Low, 1=Med, 2=High
      let yLevel = totalLeadership <= 16 ? 0 : (totalLeadership <= 24 ? 1 : 2); 

      // Matrix: Box 1 to 9 mapping
      const matrixMap = [
        ['Box 1 (Underperformer)', 'Box 2 (Effective)', 'Box 4 (High Performer)'],          // y=0 (Low Potential)
        ['Box 3 (Inconsistent)', 'Box 5 (Core Player)', 'Box 8 (High Impact)'],           // y=1 (Med Potential)
        ['Box 6 (Potential)',    'Box 7 (High Potential)', 'Box 9 (Future Leader)']   // y=2 (High Potential)
      ];
      
      const category = matrixMap[yLevel][xLevel];

      const assessment = store.saveAssessment({
        employeeId,
        period,
        date,
        assessor,
        notes,
        leadershipScores,
        kpiScores,
        totalLeadership,
        totalKpi,
        category,
        xLevel,
        yLevel
      });

      window.appNavigate('/result?id=' + assessment.id);
    });
  }, 0);

  return container;
}
