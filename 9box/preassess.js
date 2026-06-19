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
      { id: 'a6', code: 'A6', title: 'Ekspektasi Gaji \u2B50', icon: 'dollar-sign', q: ['Berapa ekspektasi gaji Anda untuk posisi ini?', 'Apakah Anda bersedia jika gaji yang kami tawarkan lebih rendah dari ekspektasi Anda? Mengapa?', 'Menurut Anda, faktor apa saja yang menentukan nilai gaji seseorang selain pengalaman?'], label1: '1=Sangat tidak realistis', label5: '5=Sangat realistis' },
      { id: 'a7', code: 'A7', title: 'Ekspektasi Karir \u2B50', icon: 'award', q: ['Apa target karir Anda dalam 1 tahun ke depan? Dan dalam 3 tahun?', 'Berapa lama Anda merasa cukup untuk berada di satu posisi sebelum naik jabatan?', 'Apa yang akan Anda lakukan jika promosi yang Anda harapkan belum juga datang?'], label1: '1=Sangat tidak realistis', label5: '5=Sangat realistis' }
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
        ${posmatchData.map(section => \`
          <div>
            <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 bg-\${section.color}-50 p-4 rounded-xl border border-\${section.color}-100 uppercase tracking-wide">
              \${section.section}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              \${section.variables.map(v => \`
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-\${section.color}-500 focus-within:border-transparent transition-all">
                  <div class="flex items-center gap-3 mb-3 border-b border-slate-100 pb-2">
                    <div class="bg-\${section.color}-100 p-2 rounded-lg text-\${section.color}-600">
                       <i data-feather="\${v.icon}" class="w-5 h-5"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 text-md truncate">\${v.code}: \${v.title}</h4>
                  </div>
                  <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p class="text-xs font-bold text-slate-500 uppercase mb-1">Pertanyaan Acuan:</p>
                    <ul class="text-[13px] text-slate-700 space-y-1 pl-4 list-disc marker:text-\${section.color}-400">
                      \${v.q.map(q => \`<li>\${q}</li>\`).join('')}
                    </ul>
                  </div>
                  <textarea id="val_\${v.id}" rows="2" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-\${section.color}-500 mb-3 bg-white resize-none outline-none" placeholder="Tulis jawaban kandidat..."></textarea>
                  <div class="bg-slate-50 rounded-lg p-2 border border-slate-200">
                    <p class="text-xs font-bold text-center text-slate-500 mb-2">Penilaian Skor</p>
                    <div class="flex justify-between items-center gap-1">
                      \${[1,2,3,4,5].map(num => \`
                        <label class="flex-1 text-center cursor-pointer group">
                          <input type="radio" name="score_\${v.id}" value="\${num}" class="peer sr-only" required>
                          <div class="w-full py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 font-semibold peer-checked:bg-\${section.color}-600 peer-checked:text-white peer-checked:border-\${section.color}-600 group-hover:bg-\${section.color}-50 transition-colors text-sm">
                            \${num}
                          </div>
                        </label>
                      \`).join('')}
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-500 mt-1 px-1">
                      <span>\${v.label1}</span>
                      <span>\${v.label5}</span>
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`).join('')}
      </div>

      <!-- KESIMPULAN -->
      <div class="bg-slate-800 p-6 md:p-8 rounded-2xl text-white shadow-md">
        <h4 class="font-bold text-lg mb-2 flex items-center gap-2"><i data-feather="edit-3"></i> Kesimpulan Asesor</h4>
        <textarea id="pm-kesimpulan" required rows="4" class="w-full px-4 py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all placeholder:text-slate-400" placeholder="Tulis catatan keseluruhan tentang kandidat ini..."></textarea>
      </div>

      <!-- ERROR ALERT -->
      <div id="pm-error-alert" class="hidden bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-start gap-3">
        <i data-feather="alert-circle" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div id="pm-error-msg" class="text-sm font-medium">Mohon lengkapi semua isian sebelum melanjutkan.</div>
      </div>

      <div class="flex flex-wrap justify-end gap-3 pt-6 pb-12 border-t print:hidden">
        <button type="button" id="btn-pm-reset" class="bg-slate-500 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          <i data-feather="refresh-ccw" class="w-4 h-4"></i> Reset Form
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
    <div id="posmatch-result-view" class="hidden mt-8 break-before-page w-full p-2"></div>
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
      if(confirm('Reset semua isian form? Hasil hitung juga akan dihapus.')) {
        form.reset();
        resultView.innerHTML = '';
        resultView.classList.add('hidden');
        btnPrint.classList.add('hidden');
        errorAlert.classList.add('hidden');
        container.querySelectorAll('textarea').forEach(t => t.value = '');
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
        const radio = container.querySelector(\`input[name="score_\${v.id}"]:checked\`);
        texts[v.code] = container.querySelector(\`#val_\${v.id}\`).value.trim();
        
        if(!radio) {
          allFilled = false;
          missingFields.push(v.code);
        } else {
          scores[v.code] = parseInt(radio.value);
        }
      }

      if(!allFilled) {
        errorMsg.textContent = "Ada skor variabel yang belum dipilih: " + missingFields.join(', ');
        errorAlert.classList.remove('hidden');
        errorAlert.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
      }
      
      errorAlert.classList.add('hidden');
      
      // Step 1: Hitung Rata-rata
      const ms = (scores.M1 + scores.M2 + scores.M3 + scores.M4) / 4;
      const as = (scores.A1 + scores.A2 + scores.A3 + scores.A4 + scores.A5 + scores.A6 + scores.A7) / 7;
      const ps = (scores.P1 + scores.P2 + scores.P3 + scores.P4) / 4;

      // Step 2: Tentukan Cluster Posisi
      let cluster = "🟡 General Staff";
      let clusterIcon = "user";
      if (scores.P1 >= 4 && scores.P3 >= 4) { cluster = "🟢 Frontliner"; clusterIcon = "smile"; }
      else if (scores.P2 >= 4 && scores.P1 <= 3) { cluster = "🔵 Back Office"; clusterIcon = "monitor"; }
      else if (scores.P1 >= 3 && scores.P2 >= 3) { cluster = "🟡 Hybrid"; clusterIcon = "shuffle"; }
      else if (scores.P4 <= 2) { cluster = "🟣 Kreatif / Spesialis"; clusterIcon = "pen-tool"; }

      // Step 3: Tentukan Status Diterima
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

      // Step 4: Rekomendasi Posisi Spesifik
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

      // Step 5: Peringatan Khusus
      let peringatan = [];
      if(scores.A6 <= 2) peringatan.push("⚠️ Ekspektasi gaji tidak realistis, berisiko keluar cepat.");
      if(scores.A7 <= 2) peringatan.push("⚠️ Ekspektasi karir tidak realistis, rawan frustrasi.");
      if(scores.P1 <= 2 && scores.P2 >= 4) peringatan.push("ℹ️ Kandidat ini TIDAK COCOK untuk posisi Frontliner (Customer Service, Sales).");

      const warnHtml = peringatan.length ? 
        peringatan.map(w => \`<div class="bg-red-50 text-red-800 p-2 rounded-lg border border-red-100 text-sm mb-1">\${w}</div>\`).join('') :
        \`<div class="text-slate-500 text-sm italic">Tidak ada peringatan khusus.</div>\`;

      // Data Dasar
      const kandidat = container.querySelector('#pm-kandidat').value || '-';
      const posisi = container.querySelector('#pm-posisi').value || '-';
      const asesor = container.querySelector('#pm-asesor').value || '-';
      const kesimpulanTxt = container.querySelector('#pm-kesimpulan').value || '-';

      // Format detail variabel 2 kolom
      const detailsHtml = variables.map(v => \`
        <div class="col-span-1 border-b border-slate-100 pb-2">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-slate-800 text-sm">\${v.code} \${v.title}</span><br>
              <span class="text-xs text-slate-500 break-words line-clamp-3">\${texts[v.code] || '-'}</span>
            </div>
            <span class="font-bold \${scores[v.code] >= 4 ? 'text-green-600' : (scores[v.code] <= 2 ? 'text-red-500' : 'text-slate-700')} bg-slate-50 px-2 py-0.5 rounded text-sm ml-2 flex-shrink-0">\${scores[v.code]} / 5</span>
          </div>
        </div>
      \`).join('');

      resultView.innerHTML = \`
        <div class="bg-[#f3f4f6] p-8 rounded-2xl border border-slate-200 shadow-inner break-inside-avoid">
          
          <div class="text-center mb-8 pb-6 border-b border-slate-300">
            <h2 class="text-2xl font-bold text-[#1a3a5c] uppercase tracking-widest hidden print:block mb-2">Laporan Hasil Asesmen POSMATCH</h2>
            <h3 class="text-xl font-bold text-slate-800 uppercase print:hidden">--- HASIL ASESMEN ---</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h4 class="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2">Data Kandidat</h4>
              <table class="w-full text-sm">
                <tr><td class="py-1 text-slate-500 w-1/3">Nama Kandidat</td><td class="font-bold text-slate-800 w-2/3">: \${kandidat}</td></tr>
                <tr><td class="py-1 text-slate-500">Posisi Dilamar</td><td class="font-bold text-slate-800">: \${posisi}</td></tr>
                <tr><td class="py-1 text-slate-500">Asesor</td><td class="font-bold text-slate-800">: \${asesor}</td></tr>
                <tr><td class="py-1 text-slate-500">Tanggal</td><td class="font-bold text-slate-800">: \${today}</td></tr>
              </table>
            </div>

            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h4 class="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2">--- SKOR AKHIR ---</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center"><span class="text-slate-600 font-medium">Mindset Score</span> <span class="font-bold text-lg text-blue-700 bg-blue-50 px-2 rounded">\${ms.toFixed(2)} / 5.0</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-600 font-medium">Attitude Score</span> <span class="font-bold text-lg text-indigo-700 bg-indigo-50 px-2 rounded">\${as.toFixed(2)} / 5.0</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-600 font-medium">Kecocokan Score</span> <span class="font-bold text-lg text-emerald-700 bg-emerald-50 px-2 rounded">\${ps.toFixed(2)} / 5.0</span></div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
               <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">--- KEPUTUSAN STATUS ---</h4>
               <div class="\${statusColor} font-bold text-lg flex items-center gap-2"><i data-feather="\${statusIcon}"></i> \${status}</div>
             </div>
             
             <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
               <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">--- CLUSTER POSISI ---</h4>
               <div class="text-slate-800 font-bold text-lg flex items-center gap-2"><i data-feather="\${clusterIcon}"></i> \${cluster}</div>
             </div>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 break-inside-avoid">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-3">--- REKOMENDASI POSISI ---</h4>
             <div class="text-xl font-bold text-[#1a3a5c] mb-1"><i data-feather="briefcase" class="inline w-5 h-5 mr-1"></i> \${rekomendasi}</div>
             <p class="text-sm text-slate-600">Alasan: Terdapat kecocokan pada pola interaksi <strong>\${cluster}</strong> dengan dominasi nilai teknis yang relevan.</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 break-inside-avoid">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2">--- PERINGATAN KANDIDAT ---</h4>
             \${warnHtml}
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 break-inside-avoid">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-4 border-b pb-2">--- CATATAN KESIMPULAN ASESOR ---</h4>
             <p class="text-slate-700 text-sm whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">\${kesimpulanTxt}</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-auto">
             <h4 class="text-sm font-bold text-slate-500 uppercase mb-4 border-b pb-2">--- RINCIAN SKOR PER VARIABEL ---</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                \${detailsHtml}
             </div>
          </div>
          
        </div>
      \`;
      
      resultView.classList.remove('hidden');
      btnPrint.classList.remove('hidden');
      if(window.feather) window.feather.replace();
      
      resultView.scrollIntoView({behavior: 'smooth'});
    });
  }, 0);

  return container;
}
