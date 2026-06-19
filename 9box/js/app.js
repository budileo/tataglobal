// --- store.js ---
const defaultEmployees = [
  { id: 'emp-1', name: 'Ahmad Fauzi', position: 'Spv Produksi', department: 'Operations' },
  { id: 'emp-2', name: 'Budi Santoso', position: 'Staf Keuangan', department: 'Finance' },
  { id: 'emp-3', name: 'Siti Aminah', position: 'HR Admin', department: 'HRD' }
];

const defaultPeriods = ['Q1 2026', 'Q2 2026', 'Annual 2025'];

const KEYS = {
  EMPLOYEES: 'hrd_employees',
  PERIODS: 'hrd_periods',
  ASSESSMENTS: 'hrd_assessments',
  POSMATCH: 'hrd_posmatch'
};

const store = {
  getEmployees() {
    const data = localStorage.getItem(KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : defaultEmployees;
  },
  saveEmployee(employee) {
    const employees = this.getEmployees();
    if (employee.id) {
      const index = employees.findIndex(e => e.id === employee.id);
      if (index !== -1) employees[index] = employee;
    } else {
      employee.id = 'emp-' + Date.now();
      employees.push(employee);
    }
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
    return employee;
  },
  deleteEmployee(id) {
    const employees = this.getEmployees().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },
  getPeriods() {
    const data = localStorage.getItem(KEYS.PERIODS);
    return data ? JSON.parse(data) : defaultPeriods;
  },
  savePeriod(period) {
    const periods = this.getPeriods();
    if (!periods.includes(period)) {
      periods.push(period);
      localStorage.setItem(KEYS.PERIODS, JSON.stringify(periods));
    }
  },
  getAssessments() {
    const data = localStorage.getItem(KEYS.ASSESSMENTS);
    return data ? JSON.parse(data) : [];
  },
  getAssessmentById(id) {
    return this.getAssessments().find(a => a.id === id);
  },
  saveAssessment(assessment) {
    const assessments = this.getAssessments();
    if (assessment.id) {
      const index = assessments.findIndex(a => a.id === assessment.id);
      if (index !== -1) assessments[index] = assessment;
    } else {
      assessment.id = 'assrv-' + Date.now();
      assessments.push(assessment);
    }
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
    return assessment;
  },
  getPosmatches() {
    const data = localStorage.getItem(KEYS.POSMATCH);
    return data ? JSON.parse(data) : [];
  },
  getPosmatchById(id) {
    return this.getPosmatches().find(a => a.id === id);
  },
  savePosmatch(assessment) {
    const assessments = this.getPosmatches();
    if (assessment.id) {
      const index = assessments.findIndex(a => a.id === assessment.id);
      if (index !== -1) assessments[index] = assessment;
    } else {
      assessment.id = 'posmatch-' + Date.now();
      assessments.push(assessment);
    }
    localStorage.setItem(KEYS.POSMATCH, JSON.stringify(assessments));
    return assessment;
  }
};

// --- views/Dashboard.js ---
function Dashboard() {
  const employees = store.getEmployees();
  const assessments = store.getAssessments();

  const totalEmployees = employees.length;
  const totalAssessments = assessments.length;
  const recentAssessments = assessments.slice().reverse().slice(0, 5);

  const html = `
    <div class="space-y-6 slide-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h2>
          <p class="text-slate-500 mt-1">Sistem Penilaian Kinerja Karyawan 9-Box Matrix</p>
        </div>
        <button onclick="window.appNavigate('/assessment')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition hover:shadow flex items-center gap-2">
          <i data-feather="plus" class="w-4 h-4"></i> Asesmen Baru
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div class="bg-blue-100 p-3 rounded-lg text-blue-600">
            <i data-feather="users" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Karyawan</p>
            <h3 class="text-2xl font-bold text-slate-800">${totalEmployees}</h3>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div class="bg-green-100 p-3 rounded-lg text-green-600">
            <i data-feather="file-text" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Asesmen</p>
            <h3 class="text-2xl font-bold text-slate-800">${totalAssessments}</h3>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between text-white relative overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all" onclick="window.appNavigate('/history')">
          <div class="z-10 relative">
            <p class="text-blue-100 font-medium mb-1">Lihat 9-Box Matrix</p>
            <h3 class="text-xl font-bold">Riwayat Asesmen</h3>
          </div>
          <i data-feather="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition z-10 relative"></i>
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800">Asesmen Terbaru</h3>
          <button onclick="window.appNavigate('/history')" class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">Lihat Semua</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th class="px-6 py-4 font-medium">Karyawan</th>
                <th class="px-6 py-4 font-medium">Periode</th>
                <th class="px-6 py-4 font-medium">Kategori 9-Box</th>
                <th class="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${recentAssessments.length > 0 ? recentAssessments.map(a => {
                const emp = employees.find(e => e.id === a.employeeId);
                return `
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-800">${emp?.name || 'Unknown'}</td>
                    <td class="px-6 py-4 text-slate-600">${a.period}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${a.category}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button onclick="window.appNavigate('/result?id=${a.id}')" class="text-blue-600 hover:text-blue-900 font-medium">Detail</button>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-slate-500">Belum ada data asesmen</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  return html;
}

// --- views/EmployeeManager.js ---
function EmployeeManager() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in';

  function render() {
    const employees = store.getEmployees();
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-slate-800">Manajemen Karyawan</h2>
          <p class="text-slate-500 mt-1">Kelola data karyawan yang akan dinilai</p>
        </div>
        <button id="btn-add-emp" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition hover:shadow flex items-center gap-2">
          <i data-feather="user-plus" class="w-4 h-4"></i> Tambah Karyawan
        </button>
      </div>

      <div id="emp-form-card" class="hidden bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 slide-in">
        <h3 class="text-lg font-semibold mb-4 text-slate-800" id="form-title">Tambah Karyawan Baru</h3>
        <form id="emp-form" class="space-y-4">
          <input type="hidden" id="emp-id">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" id="emp-name" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Departemen</label>
              <input type="text" id="emp-dept" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
              <input type="text" id="emp-pos" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" id="btn-cancel" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Batal</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">Simpan Data</button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th class="px-6 py-4 font-semibold">Nama Karyawan</th>
                <th class="px-6 py-4 font-semibold">Jabatan</th>
                <th class="px-6 py-4 font-semibold">Departemen</th>
                <th class="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${employees.map(emp => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        ${emp.name.charAt(0)}
                      </div>
                      ${emp.name}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">${emp.position}</td>
                  <td class="px-6 py-4 text-slate-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 pb-1">
                      ${emp.department}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right space-x-2">
                    <button class="text-blue-600 hover:text-blue-900 font-medium btn-edit" data-id="${emp.id}">Edit</button>
                    <button class="text-red-500 hover:text-red-700 font-medium btn-delete" data-id="${emp.id}">Hapus</button>
                  </td>
                </tr>
              `).join('')}
              ${employees.length === 0 ? `<tr><td colspan="4" class="px-6 py-12 text-center text-slate-500">Belum ada karyawan.</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
    setTimeout(attachEvents, 0);
  }

  function attachEvents() {
    if (window.feather) window.feather.replace();
    const formCard = container.querySelector('#emp-form-card');
    const form = container.querySelector('#emp-form');
    
    container.querySelector('#btn-add-emp').addEventListener('click', () => {
      form.reset();
      container.querySelector('#emp-id').value = '';
      container.querySelector('#form-title').textContent = 'Tambah Karyawan Baru';
      formCard.classList.remove('hidden');
    });

    container.querySelector('#btn-cancel').addEventListener('click', () => {
      formCard.classList.add('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = container.querySelector('#emp-id').value;
      const name = container.querySelector('#emp-name').value;
      const position = container.querySelector('#emp-pos').value;
      const department = container.querySelector('#emp-dept').value;
      store.saveEmployee({ id, name, position, department });
      render();
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const emp = store.getEmployees().find(i => i.id === id);
        if (emp) {
          container.querySelector('#emp-id').value = emp.id;
          container.querySelector('#emp-name').value = emp.name;
          container.querySelector('#emp-pos').value = emp.position;
          container.querySelector('#emp-dept').value = emp.department;
          container.querySelector('#form-title').textContent = 'Edit Karyawan';
          formCard.classList.remove('hidden');
        }
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(confirm('Hapus karyawan ini?')) {
          store.deleteEmployee(e.target.getAttribute('data-id'));
          render();
        }
      });
    });
  }
  render();
  return container;
}

// --- views/AssessmentForm.js ---
function AssessmentForm() {
  const container = document.createElement('div');
  container.className = 'space-y-8 slide-in pb-12';
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
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nama Asesor</label>
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
        <h3 class="text-2xl font-bold text-slate-800 mb-2">1. Potensial Leadership (Sumbu Y)</h3>
        <p class="text-slate-500 mb-6 pb-4 border-b">Isi jawaban/bukti karyawan langsung di bawah masing-masing poin penilaian.</p>

        <div class="space-y-4">
          ${renderSelectBox('l_influence', '1. Influence', 'Ada contoh nyata? Pelaku utama? Berhasil?', 
             '• Meyakinkan orang yang tidak setuju • Mengubah pendapat orang lain • Ide ditolak lalu diterima',
             ['1 - Tidak pernah', '2 - Pernah tapi gagal', '3 - Kadang berhasil', '4 - Sering berhasil', '5 - Sangat kuat'], 
             'j-influence', 'Jawaban Calon: Cara meyakinkan orang, mengubah pendapat...')}
             
          ${renderSelectBox('l_ownership', '2. Ownership', 'Ada inisiatif? Masalah selesai?', 
             '• Ambil tanggung jawab di luar tugas • Merasa ini tanggung jawab saya • Selesaikan masalah bukan salah sendiri',
             ['1 - Nunggu disuruh', '2 - Kadang bantu', '3 - Cukup tanggung jawab', '4 - Proaktif', '5 - Sangat ownership'], 
             'j-ownership', 'Jawaban Calon: Inisiatif di luar tugas...')}
             
          ${renderSelectBox('l_decision', '3. Decision Making', 'Pertimbangan jelas? Hasil efektif?', 
             '• Keputusan sulit • Keputusan saat tekanan • Pilihan berat',
             ['1 - Menghindari', '2 - Ikut orang lain', '3 - Sederhana', '4 - Tepat & berani', '5 - Tegas & Berdampak'], 
             'j-decision', 'Jawaban Calon: Keputusan sulit...')}
             
          ${renderSelectBox('l_people', '4. People Development', 'Dampak nyata dalam membimbing?', 
             '• Membantu orang berkembang • Mengajari / membimbing • Ada hasil nyata',
             ['1 - Tidak pernah', '2 - Jarang', '3 - Basic', '4 - Aktif membantu', '5 - Dampak nyata'], 
             'j-people', 'Jawaban Calon: Membantu orang berkembang...')}
             
          ${renderSelectBox('l_integrity', '5. Integrity & Value', 'Konsisten dengan nilai?', 
             '• Pilih kejujuran vs target • Jujur walau berisiko • Sikap saat lihat pelanggaran',
             ['1 - Menghindar', '2 - Kompromi', '3 - Netral', '4 - Jujur walau sulit', '5 - Sangat berprinsip'], 
             'j-integrity', 'Jawaban Calon: Jujur walau berisiko...')}
        </div>

        <div class="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-6">
          <h4 class="font-bold text-blue-900 mb-2">🔷 PERTANYAAN PENUTUP LEADERSHIP</h4>
          <p class="text-sm mb-3">🎯 Pilih 2–3 pertanyaan yang diajukan ke calon:</p>
          <div class="space-y-2 text-sm text-slate-800 mb-4 bg-white p-4 rounded-lg border border-blue-100">
            <label class="flex items-center gap-2"><input type="checkbox" class="ldr-closeQ" value="Apa keputusan yang kamu sesali?"> Apa keputusan yang kamu sesali?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="ldr-closeQ" value="Apa kelemahan kamu?"> Apa kelemahan kamu?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="ldr-closeQ" value="Kalau tim gagal, kamu salahkan siapa?"> Kalau tim gagal, kamu salahkan siapa?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="ldr-closeQ" value="Kalau jadi leader, apa yang kamu perbaiki?"> Kalau jadi leader, apa yang kamu perbaiki?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="ldr-closeQ" value="Kenapa kami harus pilih kamu?"> Kenapa kami harus pilih kamu?</label>
          </div>
          
          ${renderSelectBox('l_closing', '6. Nilai Penutup (Sikap)', 'Kejujuran, Kedewasaan, Growth Mindset', 
             '',
             ['1 - Pencitraan / defensif', '2 - Kurang jujur / kurang dewasa', '3 - Cukup jujur, mulai reflektif', '4 - Jujur, dewasa, solutif', '5 - Sangat reflektif, growth mindset'], 
             'j-ldr-closing-note', 'Catatan Asesor: Tulis jawaban calon untuk pertanyaan yang dipilih...')}
        </div>
      </div>

      <!-- BAGIAN 2: PERFORMA KPI (Sumbu X) -->
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
        <h3 class="text-2xl font-bold text-slate-800 mb-2">2. Performa KPI (Sumbu X)</h3>
        <p class="text-slate-500 mb-6 pb-4 border-b">Isi bukti capaian KPI karyawan langsung di bawah masing-masing indikator penilaian.</p>

        <div class="space-y-4">
          ${renderSelectBox('k_prod', '1. Produktivitas', 'Realisasi vs Target.', 
             '• Mencapai target volume/kuantitas • Konsistensi output • Tingkat penyelesaian tugas',
             ['1 - Di bawah (≤75%)', '2 - Mendekati (76-89%)', '3 - Mencapai (90-100%)', '4 - Melebihi (101-115%)', '5 - Jauh melebihi (>115%)'], 
             'j-prod', 'Bukti KPI: Target 100 unit/hari...')}
             
          ${renderSelectBox('k_qual', '2. Kualitas', 'Tingkat kesalahan.', 
             '• Tingkat kesalahan/error • Akurasi pekerjaan • Kesesuaian standar',
             ['1 - >10% error', '2 - 6-10% error', '3 - 3-5% error', '4 - 1-2% error', '5 - <1% error'], 
             'j-qual', 'Bukti KPI: Error rate 2%...')}
             
          ${renderSelectBox('k_eff', '3. Efisiensi & Deadline', 'Ketepatan waktu persentase.', 
             '• Ketepatan waktu penyelesaian • Optimalisasi sumber daya • Tingkat keterlambatan',
             ['1 - Sering terlambat (<70%)', '2 - Kadang terlambat (70-79%)', '3 - Cukup tepat (80-89%)', '4 - Tepat waktu (90-99%)', '5 - Selalu tepat waktu'], 
             'j-eff', 'Bukti KPI: 8 dari 10 proyek selesai tepat waktu...')}
             
          ${renderSelectBox('k_init', '4. Inisiatif', 'Dampak ide baru.', 
             '• Usulan perbaikan proses • Inovasi • Problem solving proaktif',
             ['1 - Tidak', '2 - Jarang', '3 - Cukup', '4 - Aktif', '5 - Sangat inovatif'], 
             'j-init', 'Bukti KPI: Mengusulkan otomatisasi...')}
             
          ${renderSelectBox('k_collab', '5. Kolaborasi', 'Kontribusi ke dalam tim.', 
             '• Kontribusi terhadap tim • Membantu rekan • Dampak pada pencapaian tim',
             ['1 - Sendiri', '2 - Kadang', '3 - Cukup', '4 - Aktif berkontribusi', '5 - Kunci keberhasilan'], 
             'j-collab', 'Bukti KPI: Membantu tim mencapai target...')}
        </div>

        <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mt-6">
          <h4 class="font-bold text-emerald-900 mb-2">🔷 PERTANYAAN PENUTUP KPI</h4>
          <p class="text-sm mb-3">🎯 Pilih 2–3 pertanyaan yang diajukan ke karyawan:</p>
          <div class="space-y-2 text-sm text-slate-800 mb-4 bg-white p-4 rounded-lg border border-emerald-100">
            <label class="flex items-center gap-2"><input type="checkbox" class="kpi-closeQ" value="Apa target KPI yang paling sulit?"> Apa target KPI yang paling sulit kamu capai?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="kpi-closeQ" value="Apa yang dilakukan saat KPI tidak tercapai?"> Apa yang kamu lakukan saat KPI tidak tercapai?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="kpi-closeQ" value="Bagaimana cara meningkatkan performa?"> Bagaimana cara kamu meningkatkan performa?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="kpi-closeQ" value="Kelemahan dalam pemenuhan KPI-mu?"> Apa kelemahan dalam pemenuhan KPI-mu?</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="kpi-closeQ" value="Saran perbaikan yang kamu minta?"> Kalau diberi saran perbaikan, apa yang kamu minta?</label>
          </div>
          
          ${renderSelectBox('k_closing', '6. Komitmen KPI', 'Tanggung jawab performa.', 
             '',
             ['1 - Defensif', '2 - Menghindar', '3 - Cukup jujur', '4 - Dewasa, ada action plan', '5 - Growth mindset jelas'], 
             'j-kpi-closing-note', 'Catatan Asesor: Tulis jawaban karyawan untuk pertanyaan yang dipilih...')}
        </div>
      </div>

      <!-- KESIMPULAN -->
      <div class="bg-slate-800 p-8 rounded-xl text-white">
        <h4 class="font-bold text-lg mb-2">📌 KESIMPULAN & REKOMENDASI ASESOR</h4>
        <textarea id="as-notes" rows="4" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" placeholder="Tulis kesimpulan asesor: kekuatan calon, area pengembangan, rekomendasi akhir..."></textarea>
      </div>

      <div class="flex justify-end pt-4 pb-12">
        <button type="submit" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition text-lg flex items-center gap-2">
          <i data-feather="save"></i> Simpan & Lihat Hasil
        </button>
      </div>
    </form>
  `;

  function renderSelectBox(id, title, desc, questionsHtmlContent, options, textareaId = null, textareaPlaceholder = '') {
    const textareaHtml = textareaId ? `
      <div class="border-t border-slate-100 pt-3 flex gap-2">
        <i data-feather="edit-2" class="w-4 h-4 text-slate-400 mt-1"></i>
        <textarea id="${textareaId}" rows="2" class="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-700 p-0 resize-none h-14" placeholder="${textareaPlaceholder}"></textarea>
      </div>
    ` : '';
    
    const questionsBlock = questionsHtmlContent ? `
      <div class="mt-2 text-[12px] text-slate-600 bg-white/70 p-2 rounded border border-slate-100">
        ${questionsHtmlContent.split('•').filter(Boolean).map(q => `<div class="mb-0.5"><span class="text-blue-500 font-bold mr-1">•</span> ${q.trim()}</div>`).join('')}
      </div>
    ` : '';

    return `
      <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-[15px]">${title}</h4>
            <p class="text-[13px] text-slate-500 mt-0.5 leading-relaxed">${desc}</p>
            ${questionsBlock}
          </div>
          <div class="w-full md:w-72 flex-shrink-0">
            <select id="${id}" required class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">-- Pilih Nilai Skor --</option>
              ${options.map((opt, i) => `<option value="${i+1}">${opt}</option>`).join('')}
            </select>
          </div>
        </div>
        ${textareaHtml}
      </div>
    `;
  }

  setTimeout(() => {
    if (window.feather) window.feather.replace();
    container.querySelector('#as-date').valueAsDate = new Date();
    
    container.querySelector('#assessment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const getVal = (id) => container.querySelector('#'+id).value;
      const getScore = (id) => parseInt(container.querySelector('#'+id).value);
      
      // Ambil teks bukti
      const ldrTexts = {
        influence: getVal('j-influence'),
        ownership: getVal('j-ownership'),
        decision: getVal('j-decision'),
        people: getVal('j-people'),
        integrity: getVal('j-integrity'),
        closingNotes: getVal('j-ldr-closing-note')
      };
      
      const kpiTexts = {
        prod: getVal('j-prod'),
        qual: getVal('j-qual'),
        eff: getVal('j-eff'),
        init: getVal('j-init'),
        collab: getVal('j-collab'),
        closingNotes: getVal('j-kpi-closing-note')
      };

      // Checkboxes selected
      const ldrQs = Array.from(container.querySelectorAll('.ldr-closeQ:checked')).map(n => n.value);
      const kpiQs = Array.from(container.querySelectorAll('.kpi-closeQ:checked')).map(n => n.value);

      // Scores
      const leadershipScores = { influence: getScore('l_influence'), ownership: getScore('l_ownership'), decision: getScore('l_decision'), people: getScore('l_people'), integrity: getScore('l_integrity'), closing: getScore('l_closing') };
      const kpiScores = { prod: getScore('k_prod'), qual: getScore('k_qual'), eff: getScore('k_eff'), init: getScore('k_init'), collab: getScore('k_collab'), closing: getScore('k_closing') };

      const totalLeadership = Object.values(leadershipScores).reduce((a, b) => a + b, 0);
      const totalKpi = Object.values(kpiScores).reduce((a, b) => a + b, 0);

      // 9 Box Calculation
      let xLevel = totalKpi <= 16 ? 0 : (totalKpi <= 24 ? 1 : 2);
      let yLevel = totalLeadership <= 16 ? 0 : (totalLeadership <= 24 ? 1 : 2); 

      const matrixMap = [
        ['Box 1 (Underperformer)', 'Box 2 (Effective)', 'Box 4 (High Performer)'],          
        ['Box 3 (Inconsistent)', 'Box 5 (Core Player)', 'Box 8 (High Impact)'],           
        ['Box 6 (Potential)',    'Box 7 (High Potential)', 'Box 9 (Future Leader)']   
      ];
      const category = matrixMap[yLevel][xLevel];

      const assessmentData = {
        employeeId: getVal('as-employee'),
        period: getVal('as-period'),
        date: getVal('as-date'),
        assessor: getVal('as-assessor'),
        notes: getVal('as-notes'),
        leadershipScores,
        kpiScores,
        ldrTexts,
        kpiTexts,
        ldrQs,
        kpiQs,
        totalLeadership,
        totalKpi,
        category,
        xLevel,
        yLevel
      };
      
      store.savePeriod(assessmentData.period);
      const assessment = store.saveAssessment(assessmentData);
      
      window.appNavigate('/result?id=' + assessment.id);
    });
  }, 0);

  return container;
}

// --- views/AssessmentResult.js ---
function AssessmentResult(params) {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';

  function render() {
    const assessment = store.getAssessmentById(params.id);
    if (!assessment) {
      container.innerHTML = '<div class="text-center py-12 text-slate-500">Asesmen tidak ditemukan.</div>';
      return;
    }
    const emp = store.getEmployees().find(e => e.id === assessment.employeeId) || { name: 'Unknown', position: '-' };
    const activeBoxIndex = (2 - assessment.yLevel) * 3 + assessment.xLevel;
    const boxes = [
      { id: 0, title: 'Box 6', label: 'Potential', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }, { id: 1, title: 'Box 7', label: 'High Potential', color: 'bg-emerald-200 text-emerald-900 border-emerald-400' }, { id: 2, title: 'Box 9', label: 'Future Leader', color: 'bg-emerald-500 text-white border-emerald-600' },
      { id: 3, title: 'Box 3', label: 'Inconsistent', color: 'bg-amber-100 text-amber-800 border-amber-300' }, { id: 4, title: 'Box 5', label: 'Core Player', color: 'bg-blue-200 text-blue-900 border-blue-400' }, { id: 5, title: 'Box 8', label: 'High Impact', color: 'bg-indigo-300 text-indigo-900 border-indigo-500' },
      { id: 6, title: 'Box 1', label: 'Underperformer', color: 'bg-red-200 text-red-900 border-red-400' }, { id: 7, title: 'Box 2', label: 'Effective', color: 'bg-amber-200 text-amber-900 border-amber-400' }, { id: 8, title: 'Box 4', label: 'High Performer', color: 'bg-blue-300 text-blue-900 border-blue-500' }
    ];

    // Safely get texts in case of old data format
    const ldrTxt = assessment.ldrTexts || {};
    const kpiTxt = assessment.kpiTexts || {};
    const ldrQs = assessment.ldrQs || [];
    const kpiQs = assessment.kpiQs || [];

    container.innerHTML = `
      <div class="flex items-center justify-between no-print">
        <button onclick="window.appNavigate('/history')" class="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <i data-feather="arrow-left" class="w-4 h-4"></i> Kembali
        </button>
        <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition hover:shadow flex items-center gap-2">
          <i data-feather="printer" class="w-4 h-4"></i> Cetak Dokumen PDF
        </button>
      </div>

      <div class="text-center mt-4 pt-12 print:pt-0">
        <h2 class="text-3xl font-bold tracking-tight text-slate-800">Dokumen Assessment 9-Box Matrix</h2>
        <p class="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">${assessment.period}</p>
        <div class="mt-6 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            ${emp.name.charAt(0)}
          </div>
          <div class="text-left">
            <h3 class="font-bold text-slate-800 leading-tight">${emp.name}</h3>
            <p class="text-xs text-slate-500">${emp.position} | ${emp.department}</p>
          </div>
        </div>
      </div>

      <!-- BAGIAN MATRIX & SKOR -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start break-after-page">
        <!-- MATRIKS -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 avoid-break flex flex-col items-center">
          <h4 class="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
            <i data-feather="grid" class="text-indigo-500 w-5 h-5 no-print"></i> Kategori: 
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded">${assessment.category}</span>
          </h4>
          <div class="relative w-full max-w-md">
            <div class="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-slate-500 tracking-widest uppercase">Potensi (Y) &rarr;</div>
            <div class="grid grid-cols-3 gap-2 w-full h-[400px] border-l-4 border-b-4 border-slate-800 p-2 relative bg-slate-50/50 rounded-bl-lg">
              ${boxes.map((box, i) => `
                <div class="border flex flex-col items-center justify-center rounded p-2 text-center relative transition-all duration-500 ${
                  i === activeBoxIndex ? `shadow-lg ring-4 ring-offset-2 ring-indigo-500 ${box.color}` : 'bg-white border-slate-200 text-slate-400'
                }">
                  <span class="text-xs font-bold ${i === activeBoxIndex ? 'opacity-90' : ''}">${box.title}</span>
                  <span class="text-sm font-semibold mt-1 leading-tight">${box.label}</span>
                  ${i === activeBoxIndex ? '<i data-feather="star" class="absolute -top-3 -right-3 text-yellow-400 fill-yellow-400 w-8 h-8 drop-shadow-md"></i>' : ''}
                </div>
              `).join('')}
            </div>
            <div class="text-center mt-4 text-sm font-bold text-slate-500 tracking-widest uppercase">Performa (X) &rarr;</div>
          </div>
          
          <div class="w-full mt-8 bg-slate-50 p-4 border rounded-xl text-sm">
            <div class="flex justify-between border-b pb-2 mb-2">
              <span class="text-slate-500">Total Potensi Leadership</span>
              <span class="font-bold">${assessment.totalLeadership} / 30</span>
            </div>
            <div class="flex justify-between border-b pb-2 mb-2">
              <span class="text-slate-500">Total Performa KPI</span>
              <span class="font-bold">${assessment.totalKpi} / 30</span>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mt-4">
              <span>Dinilai Oleh: ${assessment.assessor}</span>
              <span>Tgl: ${new Date(assessment.date).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        <!-- REKOMENDASI -->
        <div class="bg-slate-800 p-6 rounded-2xl border avoid-break text-white h-full">
          <h4 class="font-bold mb-4 flex items-center gap-2 text-lg text-emerald-400">
            <i data-feather="check-square" class="w-5 h-5"></i> Kesimpulan Asesor
          </h4>
          <p class="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">${assessment.notes || '-'}</p>
        </div>
      </div>

      <!-- LAMPIRAN JAWABAN (PRINT-FRIENDLY REPLICA OF THE HTML) -->
      <h3 class="text-xl font-bold border-b pb-2 mt-12 mb-6">📝 Lampiran I: Rekam Jawaban Asesmen</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- LEADERSHIP ANSWERS -->
        <div class="bg-white p-6 border rounded-xl shadow-sm text-sm">
          <h4 class="font-bold text-blue-700 uppercase mb-4 pb-2 border-b">A. Kepemimpinan (Leadership)</h4>
          <ul class="space-y-4 text-slate-700">
            <li><strong class="block text-slate-900 mb-1">Influence (Pengaruh):</strong> ${ldrTxt.influence || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Ownership:</strong> ${ldrTxt.ownership || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Decision Making:</strong> ${ldrTxt.decision || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">People Development:</strong> ${ldrTxt.people || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Integrity:</strong> ${ldrTxt.integrity || '-'}</li>
          </ul>
          
          <div class="mt-6 bg-blue-50 p-4 rounded-lg">
            <h5 class="font-bold text-slate-800 mb-2">Pertanyaan Penutup LDR:</h5>
            <div class="text-xs text-slate-600 mb-2">${ldrQs.length ? ldrQs.map(q=>`• ${q}`).join('<br>') : 'Tidak ada'}</div>
            <strong class="block text-slate-900 mt-3 mb-1">Jawaban Calon:</strong>
            <p>${ldrTxt.closingNotes || '-'}</p>
          </div>
        </div>

        <!-- KPI ANSWERS -->
        <div class="bg-white p-6 border rounded-xl shadow-sm text-sm">
          <h4 class="font-bold text-emerald-700 uppercase mb-4 pb-2 border-b">B. Bukti Performa (KPI)</h4>
          <ul class="space-y-4 text-slate-700">
            <li><strong class="block text-slate-900 mb-1">Produktivitas:</strong> ${kpiTxt.prod || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Kualitas Kerja:</strong> ${kpiTxt.qual || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Efisiensi & Deadline:</strong> ${kpiTxt.eff || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Inisiatif & Improvement:</strong> ${kpiTxt.init || '-'}</li>
            <li><strong class="block text-slate-900 mb-1">Kolaborasi & Tim:</strong> ${kpiTxt.collab || '-'}</li>
          </ul>

          <div class="mt-6 bg-emerald-50 p-4 rounded-lg">
            <h5 class="font-bold text-slate-800 mb-2">Pertanyaan Penutup KPI:</h5>
            <div class="text-xs text-slate-600 mb-2">${kpiQs.length ? kpiQs.map(q=>`• ${q}`).join('<br>') : 'Tidak ada'}</div>
            <strong class="block text-slate-900 mt-3 mb-1">Jawaban Karyawan:</strong>
            <p>${kpiTxt.closingNotes || '-'}</p>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => { if(window.feather) window.feather.replace(); }, 0);
  }
  render();
  return container;
}

// --- views/History.js ---
function History() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in';
  let activeTab = 'ninebox';

  function render() {
    const assessments = store.getAssessments().slice().reverse(); 
    const employees = store.getEmployees();
    const periods = store.getPeriods();
    const posmatches = store.getPosmatches().slice().reverse();

    const tabClass = (t) => t === activeTab 
      ? 'bg-[#1a3a5c] text-white shadow-md' 
      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200';

    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div><h2 class="text-3xl font-bold tracking-tight text-slate-800">Riwayat Asesmen</h2></div>
      </div>

      <!-- TAB SWITCHER -->
      <div class="flex gap-2 mt-4">
        <button id="tab-ninebox" class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tabClass('ninebox')} flex items-center gap-2">
          <i data-feather="grid" class="w-4 h-4"></i> 9-Box Karyawan
        </button>
        <button id="tab-posmatch" class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tabClass('posmatch')} flex items-center gap-2">
          <i data-feather="user-check" class="w-4 h-4"></i> Pra Asesmen (Calon)
        </button>
      </div>

      <!-- 9-BOX TAB CONTENT -->
      <div id="content-ninebox" class="${activeTab === 'ninebox' ? '' : 'hidden'} mt-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 bg-slate-50 border-b border-slate-200 flex gap-4 flex-wrap">
            <select id="filter-period" class="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
              <option value="">Semua Periode</option>
              ${periods.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <input type="text" id="search-emp" placeholder="Cari nama karyawan..." class="px-4 py-2 border border-slate-300 rounded-lg text-sm w-64 outline-none">
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th class="px-6 py-4 font-semibold">Tanggal</th>
                  <th class="px-6 py-4 font-semibold">Periode</th>
                  <th class="px-6 py-4 font-semibold">Karyawan</th>
                  <th class="px-6 py-4 font-semibold">Posisi 9-Box</th>
                  <th class="px-6 py-4 font-semibold text-center">LDR (Y)</th>
                  <th class="px-6 py-4 font-semibold text-center">KPI (X)</th>
                  <th class="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody id="history-body" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- POSMATCH TAB CONTENT -->
      <div id="content-posmatch" class="${activeTab === 'posmatch' ? '' : 'hidden'} mt-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 bg-slate-50 border-b border-slate-200 flex gap-4 flex-wrap">
            <input type="text" id="search-kandidat" placeholder="Cari nama kandidat..." class="px-4 py-2 border border-slate-300 rounded-lg text-sm w-64 outline-none">
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th class="px-6 py-4 font-semibold">Tanggal</th>
                  <th class="px-6 py-4 font-semibold">Kandidat</th>
                  <th class="px-6 py-4 font-semibold">Posisi Dilamar</th>
                  <th class="px-6 py-4 font-semibold">Cluster</th>
                  <th class="px-6 py-4 font-semibold">Status</th>
                  <th class="px-6 py-4 font-semibold">Rekomendasi</th>
                  <th class="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody id="posmatch-body" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      if(window.feather) window.feather.replace();

      // --- Tab switching ---
      container.querySelector('#tab-ninebox').addEventListener('click', () => { activeTab = 'ninebox'; render(); });
      container.querySelector('#tab-posmatch').addEventListener('click', () => { activeTab = 'posmatch'; render(); });

      // --- 9-Box table ---
      const tbody = container.querySelector('#history-body');
      const update9Box = () => {
        const periodVal = container.querySelector('#filter-period').value;
        const searchVal = container.querySelector('#search-emp').value.toLowerCase();
        const filtered = assessments.filter(a => {
          const emp = employees.find(e => e.id === a.employeeId) || {name:''};
          return (periodVal ? a.period === periodVal : true) && emp.name.toLowerCase().includes(searchVal);
        });

        tbody.innerHTML = filtered.length > 0 ? filtered.map(a => {
          const emp = employees.find(e => e.id === a.employeeId) || { name: 'Unknown' };
          return `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-600 whitespace-nowrap">${new Date(a.date).toLocaleDateString('id-ID')}</td>
              <td class="px-6 py-4 font-medium text-slate-800">${a.period}</td>
              <td class="px-6 py-4 font-medium text-slate-800">${emp.name}</td>
              <td class="px-6 py-4 whitespace-nowrap"><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border-indigo-200">${a.category}</span></td>
              <td class="px-6 py-4 text-center font-bold text-blue-600">${a.totalLeadership}</td>
              <td class="px-6 py-4 text-center font-bold text-emerald-600">${a.totalKpi}</td>
              <td class="px-6 py-4 text-right">
                 <button onclick="window.appNavigate('/result?id=${a.id}')" class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm transition">Lihat</button>
              </td>
            </tr>`;
        }).join('') : `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">Tidak ada data riwayat 9-Box.</td></tr>`;
      };
      container.querySelector('#filter-period').addEventListener('change', update9Box);
      container.querySelector('#search-emp').addEventListener('input', update9Box);
      update9Box();

      // --- POSMATCH table ---
      const pmBody = container.querySelector('#posmatch-body');
      const updatePosmatch = () => {
        const searchVal = (container.querySelector('#search-kandidat') || {}).value || '';
        const sv = searchVal.toLowerCase();
        const filtered = posmatches.filter(a => a.kandidat.toLowerCase().includes(sv));

        const statusBadge = (s) => {
          if(s.includes('DITERIMA BERSYARAT')) return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Bersyarat</span>';
          if(s.includes('DITERIMA')) return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Diterima</span>';
          return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Tidak Diterima</span>';
        };

        pmBody.innerHTML = filtered.length > 0 ? filtered.map(a => `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-600 whitespace-nowrap">${new Date(a.date).toLocaleDateString('id-ID')}</td>
              <td class="px-6 py-4 font-bold text-slate-800">${a.kandidat}</td>
              <td class="px-6 py-4 text-slate-700">${a.posisi}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${a.cluster}</td>
              <td class="px-6 py-4 whitespace-nowrap">${statusBadge(a.status)}</td>
              <td class="px-6 py-4 text-sm text-slate-700">${a.rekomendasi}</td>
              <td class="px-6 py-4 text-right space-x-1">
                 <button onclick="window.appNavigate('/posmatch-result?id=${a.id}')" class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm transition">Lihat</button>
                 <button onclick="window.deletePosmatch('${a.id}')" class="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm transition">Hapus</button>
              </td>
            </tr>`
        ).join('') : `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">Belum ada data pra asesmen kandidat.</td></tr>`;
      };
      container.querySelector('#search-kandidat').addEventListener('input', updatePosmatch);
      updatePosmatch();

      // Delete handler
      window.deletePosmatch = (id) => {
        if(confirm('Hapus data pra asesmen ini?')) {
          const all = store.getPosmatches().filter(a => a.id !== id);
          localStorage.setItem(KEYS.POSMATCH, JSON.stringify(all));
          render();
        }
      };
    }, 0);
  }
  render();
  return container;
}

// --- views/Reference.js ---
function Reference() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';

  const refData = [
    {
      id: 'box-9', title: 'Box 9: Future Leader / Star', badge: 'High Potential, High Perform',
      color: 'bg-emerald-50 border-emerald-300', headerBg: 'bg-emerald-500 text-white', icon: 'star',
      char: 'Mandiri, performa sangat tinggi, dan menunjukkan DNA kepemimpinan yang kuat. Mereka adalah kandidat utama untuk promosi masuk ke manajemen.',
      risk: 'Flight risk (dibajak kompetitor) jika merasa bosan, kurang ditantang, atau kurang diapresiasi di posisinya saat ini.',
      action: 'Beri peran eksekutif atau strategis (fast-track promotion). Libatkan mereka pada pengambilan keputusan perusahaan.',
      toNext: '(Posisi Puncak) Berikan otonomi penuh dan program Mentoring Manajemen Eksekutif (C-Level).',
      maintain: 'Beri mereka project khusus dengan tingkat kesulitan tinggi. Tetap berikan tantangan yang menstimulasi ide mereka.',
      bonus: 'Bonus maksimal, program kepemilikan saham (ESOP), kenaikan gaji signifikan.',
      notes: 'Jangan biarkan mereka terjebak pada pekerjaan repetitif dan operasional remeh-temeh.'
    },
    {
      id: 'box-8', title: 'Box 8: High Impact', badge: 'Moderate Potential, High Perform',
      color: 'bg-indigo-50 border-indigo-300', headerBg: 'bg-indigo-500 text-white', icon: 'trending-up',
      char: 'Pekerja keras, performa selalu di atas rata-rata, punya jiwa kepemimpinan menengah, namun butuh asahan untuk masuk level strategis.',
      risk: 'Merasa stuck dan demotivasi karena promosi terlambat.',
      action: 'Siapkan untuk posisi manajerial (middle-management). Beri ruang untuk memimpin proyek berisiko sedang.',
      toNext: 'Tingkatkan leadership. Libatkan dalam strategic planning, bukan hanya eksekusi operasional.',
      maintain: 'Berikan apresiasi tinggi dan ruang untuk belajar kemampuan cross-functional.',
      bonus: 'Bonus sangat tinggi (Top Tier 2), fasilitas pengembangan diri khusus (kursus mahal).',
      notes: 'Calon suksesi andal. Mereka perlu lebih banyak paparan (exposure) visibilitas di depan pimpinan senior.'
    },
    {
      id: 'box-7', title: 'Box 7: High Potential', badge: 'High Potential, Moderate Perform',
      color: 'bg-teal-50 border-teal-300', headerBg: 'bg-teal-500 text-white', icon: 'zap',
      char: 'Punya potensi brilian dan nilai-nilai kepemimpinan tinggi, tapi performa teknis (KPI) masih di batas wajar. Biasanya ditemui pada karyawan baru/pindahan divisi.',
      risk: 'Potensinya layu dan gagal bersinar karena kurang pelatihan alat atau pemahaman ekspektasi teknis pekerjaan.',
      action: 'Berikan coaching kompetensi teknis agar kinerjanya cepat naik menyamai potensinya. Tugaskan didampingi mentor dari Box 8/9.',
      toNext: 'Fokus pada peningkatan produktivitas (KPI) dengan target yang lebih agresif setiap Q/bulan.',
      maintain: 'Beri pengertian bahwa meskipun potensinya bagus, mereka harus membuktikan dengan angka (Result-Oriented).',
      bonus: 'Bonus menengah ke atas, utamakan budget untuk training teknis (hard skills).',
      notes: 'Mereka seringkali punya ide bagus, pastikan atasan mereka tidak mengabaikan ide tersebut.'
    },
    {
      id: 'box-6', title: 'Box 6: Potential (Enigma/Rough Diamond)', badge: 'High Potential, Low Perform',
      color: 'bg-amber-50 border-emerald-300', headerBg: 'bg-emerald-400 text-white', icon: 'help-circle',
      char: 'Cerdas dan karismatik, tapi kinerjanya buruk. Terkadang ini adalah "salah tempat" atau bosan di peran yang tidak sesuai passion-nya.',
      risk: 'Mengakibatkan kerugian finansial karena digaji untuk potensinya namun output kerjanya nihil.',
      action: 'Beri tugas di proyek spesifik. Jika masih buruk, pertimbangkan rotasi posisi, periksa apakah ada masalah personal/budaya.',
      toNext: 'Beri peringatan keras tentang kinerja. Beri Project perbaikan kinerja dalam 3-6 bulan (PIP).',
      maintain: 'Pantau kinerjanya minggu per minggu, hargai ide hebatnya tapi tuntut penyelesaian tugas dasarnya.',
      bonus: 'Bonus rendah atau nol. Semua dana dialokasikan untuk masa percobaan / PIP.',
      notes: 'HRD harus memastikan apakah masalah utamanya kompetensi/role mismatch atau attitude.'
    },
    {
      id: 'box-5', title: 'Box 5: Core Player', badge: 'Moderate Potential, Moderate Perform',
      color: 'bg-blue-50 border-blue-300', headerBg: 'bg-blue-500 text-white', icon: 'shield',
      char: 'Tulang punggung perusahaan. Pekerja handal yang stabil, menyelesaikan tanggung jawabnya rutin dengan baik.',
      risk: 'Terlupakan oleh HRD karena mereka tidak terlalu outstanding tapi juga tidak bermasalah, hingga akhirnya pergi mencari bos yang peduli.',
      action: 'Beri peluang untuk memimpin task force kecil, dorong keluar dari zona nyaman agar potensinya naik.',
      toNext: 'Latih skill baru (upskilling) agar tidak stagnan dan berani memecahkan masalah (problem solving) secara efisien.',
      maintain: 'Beri motivasi konsisten, apresiasi kontribusinya sesering mungkin ("Unsung heroes").',
      bonus: 'Bonus menengah (Standard), tunjangan yang memberikan kenyamanan hidup mereka.',
      notes: 'Sebagian besar populasi kantor ada di sini. Kesejahteraan Box 5 mencerminkan kultur perusahaan yang sehat.'
    },
    {
      id: 'box-4', title: 'Box 4: High Performer / Expert Specialist', badge: 'Low Potential, High Perform',
      color: 'bg-sky-50 border-sky-300', headerBg: 'bg-sky-500 text-white', icon: 'tool',
      char: 'Spesialis teknis sejati / eksekutor luar biasa tapi minim minat/skill untuk memimpin tim. Kurang sabar menghadapi masalah human-error.',
      risk: 'Kecewa jika promosi hanya diukur dari menjadi Manajer. Menjadi toxic jika dipaksa mengurus anak buah.',
      action: 'Pertahankan di jalur spesialis (Technical Path). Jangan paksakan peran Manajerial (Leadership Path).',
      toNext: 'Perbanyak eksposur sebagai Konsultan Internal / Narasumber teknis dalam perusahaan.',
      maintain: 'Akui keahlian teknisnya agar merasa dihargai tanpa harus diberi jabatan mengurus "people".',
      bonus: 'Bonus kinerjanya tinggi seperti Top Tier, tapi tanpa harus dipromosikan struktural.',
      notes: 'Mereka ingin dihargai untuk apa yang mereka Hasilkan, bukan seberapa banyak anak buah/power yang mereka miliki.'
    },
    {
      id: 'box-3', title: 'Box 3: Inconsistent Player', badge: 'Moderate Potential, Low Perform',
      color: 'bg-amber-50 border-amber-300', headerBg: 'bg-amber-500 text-white', icon: 'alert-triangle',
      char: 'Karyawan yang kadang rajin kadang malas (naik-turun). Memiliki basic kemampuan namun tidak memiliki fokus atau komitmen stabil.',
      risk: 'Menular pada anggota tim yang lain dan merusak standar kerja grup.',
      action: 'Analisis penyebab utamanya. Beri Performance Improvement Plan (PIP) maksimal 6 bulan. Jika tidak lulus, pisahkan.',
      toNext: 'Pecah goals menjadi satuan waktu kecil (Weekly Goals). Beri monitoring yang super ketat (micromanagement) sementara waktu.',
      maintain: 'Pastikan lingkungan tidak menormalisasi penundaan (procrastination) di meja spesifik ini.',
      bonus: 'Tidak ada bonus, tahan insentif sampai terbukti perbaikan selama 1 kuartal penuh.',
      notes: 'Kadang masalah Box 3 timbul dari faktor eksternal (keluarga, masalah personal yang berdampak pada penurunan kerja sementara).'
    },
    {
      id: 'box-2', title: 'Box 2: Effective', badge: 'Low Potential, Moderate Perform',
      color: 'bg-yellow-50 border-yellow-300', headerBg: 'bg-yellow-500 text-slate-800', icon: 'anchor',
      char: 'Orang yang masuk, kerja sesuai jobdesc, pulang tepat waktu. Memenuhi ekspektasi standar tapi sulit melampauinya dan sulit berinisiatif baru.',
      risk: 'Terlindas oleh otomatisasi (AI) atau modernisasi SOP karena sulit menerima cara kerja revolusioner baru.',
      action: 'Beri deskripsi kerja yang sangat jelas dan prosedur tetap (SOP). Tetapkan di pos-pos pengulangan (administrasi rutin).',
      toNext: 'Beri mereka pelatihan efisiensi kerja. Jangan tuntut ide out-of-the-box dulu, fokus agar kerja rutin tanpa salah.',
      maintain: 'Ciptakan rutinitas yang tenang. Pastikan beban hariannya masuk akal.',
      bonus: 'Insentif yang proporsional sesuai ketentuan minimum perusahaan.',
      notes: 'Setiap perusahaan butuh Box 2 untuk meredam kekacauan dan menjalankan roda administrasi persisten.'
    },
    {
      id: 'box-1', title: 'Box 1: Underperformer', badge: 'Low Potential, Low Perform',
      color: 'bg-red-50 border-red-300', headerBg: 'bg-red-500 text-white', icon: 'x-circle',
      char: 'Sikap tidak kooperatif / skill sangat kurang dan kinerja jauh di bawah target meskipun telah ditolong.',
      risk: 'Dead weight (beban mati) membebani keuangan (gaji tinggi, nol output) dan memicu keirian anggota tim lain yang kerja keras.',
      action: 'Proses PHK (Pemutusan Hubungan Kerja) atau mutasi (Rotasi jauh). Jika baru bergabung (Probation), segera lepaskan.',
      toNext: '-',
      maintain: '-',
      bonus: 'Tidak Ada.',
      notes: 'Jangan perpanjang nafas lebih dari periode PIP (max 1 bulan) karena merusak moral perusahaan.'
    }
  ];

  container.innerHTML = `
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight text-slate-800">Referensi HRD: Panduan 9-Box Matrix</h2>
        <p class="text-slate-500 mt-2">Pahami pedoman dan tata kelola setiap talenta berdasar matriks.</p>
      </div>
    </div>
    
    <div class="space-y-8">
      ${refData.map(box => `
        <div class="bg-white rounded-2xl shadow-sm border ${box.color} overflow-hidden">
          <div class="${box.headerBg} px-6 py-4 flex items-center gap-3">
            <i data-feather="${box.icon}" class="w-6 h-6"></i>
            <div>
              <h3 class="text-xl font-bold uppercase tracking-wide">${box.title}</h3>
              <p class="text-xs font-semibold opacity-90 mt-0.5 tracking-wider">${box.badge}</p>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
              <div>
                <div class="mb-5">
                  <h4 class="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide border-b pb-1">Karakteristik Utama</h4>
                  <p class="text-slate-600 text-sm leading-relaxed">${box.char}</p>
                </div>
                <div class="mb-5 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h4 class="text-sm font-bold text-red-900 mb-2 uppercase tracking-wide flex items-center gap-2"><i data-feather="alert-octagon" class="w-4 h-4"></i> Risiko Jika Salah Kelola</h4>
                  <p class="text-red-800 text-sm leading-relaxed">${box.risk}</p>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-indigo-900 mb-2 uppercase tracking-wide flex items-center gap-2 border-b pb-1">Rekomendasi Tindakan HR / Atasan</h4>
                  <p class="text-slate-700 text-sm leading-relaxed font-semibold">${box.action}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cara Meningkatkan ke Level Berikutnya</h4>
                  <p class="text-slate-800 text-sm">${box.toNext}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cara Mempertahankan Performa</h4>
                  <p class="text-slate-800 text-sm">${box.maintain}</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 class="text-xs font-bold text-green-700 uppercase tracking-widest mb-1 flex items-center gap-1"><i data-feather="dollar-sign" class="w-3 h-3"></i> Rekomendasi Bonus / Insentif</h4>
                  <p class="text-green-900 font-semibold text-sm">${box.bonus}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-amber-50 px-6 py-3 border-t border-amber-100 flex items-start gap-3">
            <i data-feather="info" class="w-5 h-5 text-amber-600 mt-0.5"></i>
            <div>
              <h4 class="text-xs font-bold text-amber-800 uppercase tracking-widest">Pengingat Penting HR:</h4>
              <p class="text-amber-900 text-sm">${box.notes}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  setTimeout(() => { if(window.feather) window.feather.replace(); }, 0);
  return container;
}

// --- app.js (Router) ---
const routes = {
  '/': Dashboard,
  '/employees': EmployeeManager,
  '/assessment': AssessmentForm,
  '/result': AssessmentResult, 
  '/posmatch': PreAssessment,
  '/posmatch-result': PosmatchResult,
  '/history': History,
  '/reference': Reference
};

function PosmatchResult(params) {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';
  const id = params.id;
  const data = store.getPosmatchById(id);

  if(!data) {
    container.innerHTML = `
      <div class="bg-white p-12 rounded-2xl text-center border border-slate-200">
        <i data-feather="alert-circle" class="w-16 h-16 mx-auto text-slate-300 mb-4"></i>
        <h3 class="text-xl font-bold text-slate-600">Data Tidak Ditemukan</h3>
        <p class="text-slate-500 mt-2">Hasil pra asesmen tidak ditemukan.</p>
        <button onclick="window.appNavigate('/history')" class="mt-6 bg-[#1a3a5c] text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-900 transition">Kembali ke Riwayat</button>
      </div>
    `;
    setTimeout(() => { if(window.feather) window.feather.replace(); }, 0);
    return container;
  }

  container.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
      <button onclick="window.appNavigate('/history')" class="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold transition">
        <i data-feather="arrow-left" class="w-5 h-5"></i> Kembali ke Riwayat
      </button>
      <button onclick="window.print()" class="bg-[#28a745] hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
        <i data-feather="printer" class="w-4 h-4"></i> Cetak PDF
      </button>
    </div>
    <div id="pm-result-content"></div>
  `;

  setTimeout(() => {
    container.querySelector('#pm-result-content').innerHTML = data.resultHtml || '<p class="text-slate-500">Konten hasil tidak tersedia.</p>';
    if(window.feather) window.feather.replace();
  }, 0);

  return container;
}

function PreAssessment() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';

  const posmatchData = [
    { section: 'A. MINDSET (Pola Pikir)', color: 'blue', variables: [
      { id: 'm1', code: 'M1', title: 'Growth Mindset', icon: 'trending-up', q: ['Ceritakan pengalaman Anda menghadapi kegagalan. Apa yang Anda lakukan setelahnya?', 'Menurut Anda, apakah kemampuan seseorang bisa berubah seiring waktu atau sudah bakat bawaan?', 'Apa yang Anda lakukan ketika diberikan tugas yang belum pernah Anda kerjakan sebelumnya?'], label1: '1=Fixed mindset', label5: '5=Growth mindset' },
      { id: 'm2', code: 'M2', title: 'Ownership', icon: 'shield', q: ['Ceritakan situasi di mana Anda mengambil tanggung jawab di luar deskripsi pekerjaan Anda.', 'Ketika terjadi masalah di tim, apa yang biasanya Anda lakukan?', 'Pernahkah Anda melakukan kesalahan? Bagaimana Anda menyelesaikannya?'], label1: '1=Pasif/Menyalahkan', label5: '5=Tanggung jawab penuh' },
      { id: 'm3', code: 'M3', title: 'Ketahanan (Resilience)', icon: 'anchor', q: ['Ceritakan pengalaman terberat Anda dalam bekerja.', 'Bagaimana cara Anda bangkit dari kegagalan?', 'Pernahkah Anda merasa putus asa? Apa yang Anda lakukan untuk mengatasinya?'], label1: '1=Mudah menyerah', label5: '5=Sangat tangguh' },
      { id: 'm4', code: 'M4', title: 'Orientasi Belajar', icon: 'book-open', q: ['Apa yang Anda lakukan untuk mengembangkan diri dalam 6 bulan terakhir?', 'Kapan terakhir kali Anda mencari umpan balik tentang kinerja Anda?', 'Apa buku/pelatihan terakhir yang Anda ikuti?'], label1: '1=Enggan belajar', label5: '5=Proaktif belajar' }
    ]},
    { section: 'B. ATTITUDE (Sikap Kerja)', color: 'indigo', variables: [
      { id: 'a1', code: 'A1', title: 'Inisiatif', icon: 'zap', q: ['Ceritakan saat Anda mengambil tindakan tanpa menunggu perintah.', 'Apa ide atau perbaikan yang pernah Anda usulkan di tempat kerja?', 'Jika pekerjaan Anda selesai lebih cepat, apa yang biasanya Anda lakukan?'], label1: '1=Menunggu perintah', label5: '5=Sangat inisiatif' },
      { id: 'a2', code: 'A2', title: 'Kolaborasi', icon: 'users', q: ['Ceritakan pengalaman Anda bekerja dalam tim yang memiliki konflik.', 'Bagaimana cara Anda menghadapi rekan kerja yang memiliki gaya kerja berbeda?', 'Apakah Anda lebih suka kerja sendiri atau tim? Mengapa?'], label1: '1=Individualis', label5: '5=Sangat kooperatif' },
      { id: 'a3', code: 'A3', title: 'Adaptabilitas', icon: 'refresh-cw', q: ['Ceritakan saat Anda menghadapi perubahan besar di tempat kerja.', 'Bagaimana reaksi Anda ketika prosedur kerja tiba-tiba berubah?', 'Seberapa cepat Anda bisa menyesuaikan dengan lingkungan atau tim baru?'], label1: '1=Kaku', label5: '5=Sangat adaptif' },
      { id: 'a4', code: 'A4', title: 'Integritas', icon: 'check-circle', q: ['Pernahkah Anda dalam situasi harus memilih antara kejujuran dan kepentingan pribadi?', 'Apa yang Anda lakukan jika melihat rekan kerja melakukan pelanggaran ringan?', 'Bagaimana jika atasan meminta Anda melakukan sesuatu yang menurut Anda tidak etis?'], label1: '1=Berkompromi etika', label5: '5=Sangat berprinsip' },
      { id: 'a5', code: 'A5', title: 'Ketelitian', icon: 'target', q: ['Ceritakan pekerjaan yang membutuhkan ketelitian tinggi yang pernah Anda lakukan.', 'Seberapa sering Anda melakukan kesalahan karena kurang teliti?', 'Apa yang Anda lakukan untuk memastikan pekerjaan Anda bebas dari kesalahan?'], label1: '1=Sering ceroboh', label5: '5=Sangat akurat' },
      { id: 'a6', code: 'A6', title: 'Ekspektasi Gaji', icon: 'dollar-sign', q: ['Berapa ekspektasi gaji Anda untuk posisi ini?', 'Apakah Anda bersedia jika gaji yang kami tawarkan lebih rendah dari ekspektasi Anda? Mengapa?', 'Menurut Anda, faktor apa saja yang menentukan nilai gaji seseorang selain pengalaman?'], label1: '1=Sangat tidak realistis', label5: '5=Sangat realistis' },
      { id: 'a7', code: 'A7', title: 'Ekspektasi Karir', icon: 'award', q: ['Apa target karir Anda dalam 1 tahun ke depan? Dan dalam 3 tahun?', 'Berapa lama Anda merasa cukup untuk berada di satu posisi sebelum naik jabatan?', 'Apa yang akan Anda lakukan jika promosi yang Anda harapkan belum juga datang?'], label1: '1=Sangat tidak realistis', label5: '5=Sangat realistis' }
    ]},
    { section: 'C. KECOCOKAN POSISI (Culture Fit)', color: 'emerald', variables: [
      { id: 'p1', code: 'P1', title: 'Kenyamanan Interaksi (Frontliner)', icon: 'message-circle', q: ['Apakah Anda nyaman berbicara dengan banyak orang atau pelanggan setiap hari?', 'Bagaimana perasaan Anda jika harus menjadi pusat perhatian?', 'Pernahkah Anda menangani keluhan pelanggan? Bagaimana rasanya?'], label1: '1=Sangat tertutup', label5: '5=Ekselen interaksi' },
      { id: 'p2', code: 'P2', title: 'Kenyamanan Kerja Mandiri (Back Office)', icon: 'headphones', q: ['Apakah Anda produktif saat bekerja tanpa diawasi?', 'Apakah Anda menikmati pekerjaan yang dikerjakan sendiri tanpa banyak interupsi?', 'Seberapa lama Anda bisa fokus bekerja sendirian?'], label1: '1=Butuh arahan konstan', label5: '5=Sangat mandiri' },
      { id: 'p3', code: 'P3', title: 'Tahan Tekanan Pelanggan', icon: 'thermometer', q: ['Bagaimana reaksi Anda jika berhadapan dengan orang yang sedang marah?', 'Pernahkah Anda melayani pelanggan yang sulit? Bagaimana pengalamannya?', 'Apakah Anda bisa tetap tenang saat ditekan atau dimarahi?'], label1: '1=Mudah emosi', label5: '5=Tetap tenang & solutif' },
      { id: 'p4', code: 'P4', title: 'Preferensi Rutinitas', icon: 'layers', q: ['Apakah Anda suka pekerjaan yang terstruktur dan berulang?', 'Atau Anda lebih suka pekerjaan yang bervariasi setiap hari?', 'Bagaimana perasaan Anda jika harus melakukan tugas yang sama setiap hari?'], label1: '1=Bosan dengan rutinitas', label5: '5=Sangat nyaman rutinitas' }
    ]}
  ];

  container.innerHTML = `
    <!-- Header Area -->
    <div class="bg-[#1a3a5c] text-white p-6 md:p-8 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight">POSMATCH - Asesmen Karyawan</h2>
          <p class="text-blue-200 mt-1 font-medium text-lg flex items-center gap-2">Mindset <span class="text-white/50">|</span> Attitude <span class="text-white/50">|</span> Kecocokan Posisi</p>
        </div>
        <div class="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold border border-white/20 flex items-center gap-2">
          <i data-feather="calendar" class="w-4 h-4"></i> <span id="posmatch-date-display"></span>
        </div>
      </div>
      <div class="absolute -right-12 -top-12 opacity-10">
        <i data-feather="user-check" class="w-48 h-48"></i>
      </div>
    </div>
    
    <form id="posmatch-form" class="space-y-8">
      
      <!-- DATA DASAR -->
      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="text-lg font-bold text-[#1a3a5c] border-b pb-3 mb-5 flex items-center gap-2">
          <i data-feather="file-text" class="text-blue-500"></i> Informasi Data Dasar
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nama Kandidat</label>
            <input type="text" id="pm-kandidat" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Posisi yang Dilamar</label>
            <input type="text" id="pm-posisi" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nama Asesor</label>
            <input type="text" id="pm-asesor" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] outline-none">
          </div>
        </div>
      </div>
      
      <div id="posmatch-variables-container" class="space-y-10">
        ${posmatchData.map(section => `
          <div>
            <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 bg-${section.color}-50 p-4 rounded-xl border border-${section.color}-100 uppercase tracking-wide">
              ${section.section}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${section.variables.map(v => `
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-${section.color}-500 focus-within:border-transparent transition-all">
                  <div class="flex items-center gap-3 mb-3 border-b border-slate-100 pb-2">
                    <div class="bg-${section.color}-100 p-2 rounded-lg text-${section.color}-600">
                       <i data-feather="${v.icon}" class="w-5 h-5"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 text-md truncate">${v.code}: ${v.title}</h4>
                  </div>
                  <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p class="text-xs font-bold text-slate-500 uppercase mb-1">Pertanyaan Acuan:</p>
                    <ul class="text-[13px] text-slate-700 space-y-1 pl-4 list-disc marker:text-${section.color}-400">
                      ${v.q.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                  </div>
                  <textarea id="val_${v.id}" required rows="2" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-${section.color}-500 mb-3 bg-white resize-none outline-none" placeholder="Tulis jawaban kandidat..."></textarea>
                  <div class="bg-slate-50 rounded-lg p-2 border border-slate-200">
                    <p class="text-xs font-bold text-center text-slate-500 mb-2">Penilaian Skor</p>
                    <div class="flex justify-between items-center gap-1">
                      ${[1,2,3,4,5].map(num => `
                        <label class="flex-1 text-center cursor-pointer group">
                          <input type="radio" name="score_${v.id}" value="${num}" class="peer sr-only" required>
                          <div class="w-full py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 font-semibold peer-checked:bg-${section.color}-600 peer-checked:text-white peer-checked:border-${section.color}-600 group-hover:bg-${section.color}-50 transition-colors text-sm">
                            ${num}
                          </div>
                        </label>
                      `).join('')}
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-500 mt-1 px-1">
                      <span>${v.label1}</span>
                      <span>${v.label5}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- KESIMPULAN -->
      <div class="bg-slate-800 p-6 md:p-8 rounded-2xl text-white shadow-md">
        <h4 class="font-bold text-lg mb-2 flex items-center gap-2"><i data-feather="edit-3"></i> Kesimpulan Asesor</h4>
        <textarea id="pm-kesimpulan" required rows="4" class="w-full px-4 py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all placeholder:text-slate-400" placeholder="Tulis catatan keseluruhan tentang kandidat ini..."></textarea>
      </div>

      <!-- ERROR ALERT -->
      <div id="pm-error-alert" class="hidden bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-3 font-semibold">
        <i data-feather="alert-circle" class="w-5 h-5 flex-shrink-0"></i>
        <div id="pm-error-msg" class="text-sm"></div>
      </div>

      <div class="flex flex-wrap justify-end gap-3 pt-6 pb-12 border-t print:hidden">
        <button type="button" id="btn-pm-reset" class="bg-slate-500 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          <i data-feather="refresh-ccw" class="w-4 h-4"></i> Reset
        </button>
        <button type="button" id="btn-pm-print" class="hidden bg-[#28a745] hover:bg-green-600 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          <i data-feather="printer" class="w-4 h-4"></i> Cetak PDF
        </button>
        <button type="submit" id="btn-pm-calc" class="bg-[#1a3a5c] hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold shadow-md transition text-lg flex items-center gap-2">
          <i data-feather="check-square"></i> Hitung Hasil
        </button>
      </div>
    </form>
    
    <!-- HASIL ASSESSMENT (Hidden by default) -->
    <div id="posmatch-result-view" class="hidden mt-8 break-before-page w-full min-h-[500px]"></div>
  `;

  setTimeout(() => {
    if(window.feather) window.feather.replace();
    
    const today = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
    container.querySelector('#posmatch-date-display').textContent = today;
    
    const form = container.querySelector('#posmatch-form');
    const resultView = container.querySelector('#posmatch-result-view');
    const btnPrint = container.querySelector('#btn-pm-print');
    const btnReset = container.querySelector('#btn-pm-reset');
    const errorAlert = container.querySelector('#pm-error-alert');
    const errorMsg = container.querySelector('#pm-error-msg');

    btnReset.addEventListener('click', () => {
      if(confirm('Reset semua isian form? Hasil perhitungan juga akan dihapus.')) {
        form.reset();
        resultView.innerHTML = '';
        resultView.classList.add('hidden');
        btnPrint.classList.add('hidden');
        errorAlert.classList.add('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });

    btnPrint.addEventListener('click', () => {
      window.print();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const variables = posmatchData.flatMap(s => s.variables);
      const scores = {};
      const texts = {};
      
      let allFilled = true;
      let missingFields = [];

      for(let v of variables) {
        const radio = container.querySelector(`input[name="score_${v.id}"]:checked`);
        texts[v.code] = container.querySelector(`#val_${v.id}`).value.trim();
        
        if(!radio) {
          allFilled = false;
          missingFields.push(v.code);
        } else {
          scores[v.code] = parseInt(radio.value);
        }
      }

      if(!allFilled) {
        errorMsg.textContent = "Mohon pilih penilaian (1-5) untuk: " + missingFields.join(', ');
        errorAlert.classList.remove('hidden');
        errorAlert.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
      }
      
      errorAlert.classList.add('hidden');
      
      const ms = (scores.M1 + scores.M2 + scores.M3 + scores.M4) / 4;
      const as = (scores.A1 + scores.A2 + scores.A3 + scores.A4 + scores.A5 + scores.A6 + scores.A7) / 7;
      const ps = (scores.P1 + scores.P2 + scores.P3 + scores.P4) / 4;

      let cluster = "🟡 General Staff";
      let clusterIcon = "user";
      if (scores.P1 >= 4 && scores.P3 >= 4) { cluster = "🟢 Frontliner"; clusterIcon = "smile"; }
      else if (scores.P2 >= 4 && scores.P1 <= 3) { cluster = "🔵 Back Office"; clusterIcon = "monitor"; }
      else if (scores.P1 >= 3 && scores.P2 >= 3) { cluster = "🟡 Hybrid"; clusterIcon = "shuffle"; }
      else if (scores.P4 <= 2) { cluster = "🟣 Kreatif / Spesialis"; clusterIcon = "pen-tool"; }

      let status = "";
      let statusIcon = "";
      let statusColor = "";
      if (ms >= 3.5 && as >= 3.5) { 
        status = "✅ DITERIMA"; statusIcon = "check-circle"; statusColor = "text-green-600";
      } else if (ms >= 3.5 && as >= 3.0 && as < 3.5) { 
        status = "⚠️ DITERIMA BERSYARAT (Coaching Attitude)"; statusIcon = "alert-triangle"; statusColor = "text-amber-600"; 
      } else if (ms >= 3.0 && ms < 3.5 && as >= 3.5) { 
        status = "⚠️ DITERIMA BERSYARAT (Coaching Mindset)"; statusIcon = "alert-triangle"; statusColor = "text-amber-600"; 
      } else { 
        status = "❌ TIDAK DITERIMA"; statusIcon = "x-circle"; statusColor = "text-red-600"; 
      }

      let rekomendasi = "";
      if (cluster.includes("Frontliner")) {
        if(scores.A1 >= 4) rekomendasi = "Sales / Marketing";
        else if(scores.A3 >= 4) rekomendasi = "Customer Service";
        else rekomendasi = "Resepsionis / Host";
      } else if(cluster.includes("Back Office")) {
        if(scores.A5 >= 4) rekomendasi = "Data Entry / Administrasi";
        else if(scores.M2 >= 4) rekomendasi = "Inventory / Logistik";
        else rekomendasi = "Administrasi Umum";
      } else if(cluster.includes("Hybrid")) {
        rekomendasi = "GA / Project Coordinator";
      } else if(cluster.includes("Kreatif")) {
        if(scores.M4 >= 4) rekomendasi = "Desain / Konten Kreator";
        else rekomendasi = "R&D / Research";
      } else {
        rekomendasi = "Staff General (observasi 3 bulan)";
      }

      let peringatan = [];
      if(scores.A6 <= 2) peringatan.push("⚠️ Ekspektasi gaji tidak realistis, berisiko keluar cepat");
      if(scores.A7 <= 2) peringatan.push("⚠️ Ekspektasi karir tidak realistis, rawan frustrasi");
      if(scores.P1 <= 2 && scores.P2 >= 4) peringatan.push("ℹ️ Kandidat ini TIDAK COCOK untuk posisi Frontliner (Customer Service, Sales)");

      const warnHtml = peringatan.length ? 
        peringatan.map(w => `<div class="bg-red-50 text-red-800 px-4 py-2 rounded-lg border border-red-100 text-sm font-semibold mb-2">${w}</div>`).join('') :
        `<div class="text-slate-500 text-sm italic">Tidak ada peringatan.</div>`;

      const kandidat = container.querySelector('#pm-kandidat').value || '-';
      const posisi = container.querySelector('#pm-posisi').value || '-';
      const asesor = container.querySelector('#pm-asesor').value || '-';
      const kesimpulanTxt = container.querySelector('#pm-kesimpulan').value || '-';

      const detailsHtml = variables.map(v => `
        <div class="flex items-baseline justify-between border-b pb-1 border-slate-100 break-inside-avoid">
          <div><span class="font-bold text-slate-800 text-sm">${v.code} ${v.title}</span></div>
          <div class="font-bold ${scores[v.code] >= 4 ? 'text-green-600' : (scores[v.code] <= 2 ? 'text-red-500' : 'text-slate-700')} min-w-[36px] text-right">${scores[v.code]}/5</div>
        </div>
      `).join('');

      resultView.innerHTML = `
        <div class="bg-[#f3f4f6] p-6 lg:p-8 rounded-2xl border border-slate-200">
          <div class="text-center mb-6 pb-4 border-b border-slate-300">
            <h3 class="text-xl font-bold text-slate-800 tracking-wider">--- HASIL ASESMEN ---</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-5 rounded-xl border border-slate-200">
              <table class="w-full text-sm">
                <tr><td class="py-1 text-slate-500 w-1/3">Nama Kandidat</td><td class="font-bold text-slate-800">: ${kandidat}</td></tr>
                <tr><td class="py-1 text-slate-500">Posisi Dilamar</td><td class="font-bold text-slate-800">: ${posisi}</td></tr>
                <tr><td class="py-1 text-slate-500">Asesor</td><td class="font-bold text-slate-800">: ${asesor}</td></tr>
                <tr><td class="py-1 text-slate-500">Tanggal</td><td class="font-bold text-slate-800">: ${today}</td></tr>
              </table>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200">
              <h4 class="text-sm font-bold text-slate-500 mb-2">--- SKOR AKHIR ---</h4>
              <div class="space-y-1">
                <div class="flex justify-between items-center"><span class="text-slate-600 text-sm">Mindset Score:</span> <span class="font-bold text-sm">${ms.toFixed(2)} / 5.0</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-600 text-sm">Attitude Score:</span> <span class="font-bold text-sm">${as.toFixed(2)} / 5.0</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-600 text-sm">Kecocokan Score:</span> <span class="font-bold text-sm">${ps.toFixed(2)} / 5.0</span></div>
              </div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 mb-6 text-center">
            <h4 class="text-sm font-bold text-slate-500 uppercase mb-2">--- CLUSTER POSISI ---</h4>
            <div class="font-bold text-xl flex justify-center items-center gap-2"><i data-feather="${clusterIcon}" class="w-6 h-6"></i> ${cluster}</div>
          </div>
          
          <div class="bg-white p-5 rounded-xl border border-slate-200 mb-6 text-center">
            <h4 class="text-sm font-bold text-slate-500 uppercase mb-2">--- STATUS ---</h4>
            <div class="${statusColor} font-bold text-xl flex items-center justify-center gap-2"><i data-feather="${statusIcon}" class="w-6 h-6"></i> ${status}</div>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 mb-6">
            <h4 class="text-sm font-bold text-slate-500 uppercase mb-2">--- REKOMENDASI POSISI ---</h4>
            <div class="text-lg font-bold text-[#1a3a5c] mb-1">${rekomendasi}</div>
            <p class="text-sm text-slate-600">Alasan: Terdapat kecocokan dominan interaksi <strong>${cluster}</strong> dengan nilai teknis memadai.</p>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 mb-6">
            <h4 class="text-sm font-bold text-slate-500 uppercase mb-3">--- PERINGATAN ---</h4>
            ${warnHtml}
          </div>
          
          <div class="bg-white p-5 rounded-xl border border-slate-200 mb-6 break-inside-avoid">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-4">--- RINCIAN SKOR PER VARIABEL ---</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                ${detailsHtml}
             </div>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-3">--- CATATAN ASESOR ---</h4>
             <p class="text-slate-800 text-sm whitespace-pre-line leading-relaxed">${kesimpulanTxt}</p>
          </div>
        </div>
      `;
      
      // --- Simpan ke localStorage ---
      const savedData = {
        date: new Date().toISOString(),
        kandidat: kandidat,
        posisi: posisi,
        asesor: asesor,
        kesimpulan: kesimpulanTxt,
        scores: scores,
        texts: texts,
        avgMindset: ms,
        avgAttitude: as,
        avgFit: ps,
        cluster: cluster,
        status: status,
        rekomendasi: rekomendasi,
        peringatan: peringatan,
        resultHtml: resultView.innerHTML
      };
      store.savePosmatch(savedData);

      resultView.classList.remove('hidden');
      btnPrint.classList.remove('hidden');
      if(window.feather) window.feather.replace();
      
      resultView.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }, 0);

  return container;
}

const appContainer = document.getElementById('app-container');

function navigate(path, params = {}) {
  const [basePath] = path.split('?');
  const view = routes[basePath] || Dashboard;
  
  window.currentBasePath = basePath;
  if (window.applyNavActiveState) {
    window.applyNavActiveState();
  }

  appContainer.innerHTML = ''; 
  const el = view(params);
  if (typeof el === 'string') {
    appContainer.innerHTML = el;
  } else if (el instanceof Element) {
    appContainer.appendChild(el);
  }
  
  if (window.feather) window.feather.replace();
}

function handleHashChange() {
  const hash = window.location.hash.slice(1) || '/';
  const urlParams = new URLSearchParams(hash.split('?')[1]);
  const params = Object.fromEntries(urlParams.entries());
  navigate(hash, params);
}

window.appNavigate = (path) => { window.location.hash = path; }
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', handleHashChange);

window.applyNavActiveState = function() {
  const basePath = window.currentBasePath || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    // Add blue text/bg for active state, remove for inactive
    if (link.getAttribute('href') === `#${basePath}`) {
      link.classList.add('bg-slate-800', 'text-blue-400');
      link.classList.remove('text-slate-300');
      // Set icon color to blue
      const icon = link.querySelector('svg');
      if (icon) icon.classList.add('text-blue-400');
    } else {
      link.classList.remove('bg-slate-800', 'text-blue-400');
      // Reset icon color
      const icon = link.querySelector('svg');
      if (icon) icon.classList.remove('text-blue-400');
    }
    // Also toggle the active class just in case the CSS relies on it
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${basePath}`) link.classList.add('active');
  });
};
