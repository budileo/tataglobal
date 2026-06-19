import { store } from '../store.js';

export default function AssessmentResult(params) {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in pb-12';

  function render() {
    const assessment = store.getAssessmentById(params.id);
    if (!assessment) {
      container.innerHTML = '<div class="text-center py-12 text-slate-500">Asesmen tidak ditemukan.</div>';
      return;
    }
    const emp = store.getEmployees().find(e => e.id === assessment.employeeId) || { name: 'Unknown', position: '-' };

    // Format for 9-Box Matrix
    // The grid is 3x3. X = Performance (KPI), Y = Potential (Leadership)
    // Indexes: 0=Low, 1=Med, 2=High
    // UI Grid (CSS Grid 3 cols, 3 rows) goes from top-left to bottom-right.
    // Row 1 (top): yLevel=2 (High)
    // Row 2 (mid): yLevel=1 (Med)
    // Row 3 (bot): yLevel=0 (Low)
    // Col 1 (left): xLevel=0 (Low)
    // Col 2 (mid): xLevel=1 (Med)
    // Col 3 (right): xLevel=2 (High)
    const activeBoxIndex = (2 - assessment.yLevel) * 3 + assessment.xLevel;

    // Define 9 boxes in visual order (top-left to bottom-right)
    const boxes = [
      { id: 0, title: 'Box 6', label: 'Potential', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { id: 1, title: 'Box 7', label: 'High Potential', color: 'bg-emerald-200 text-emerald-900 border-emerald-400' },
      { id: 2, title: 'Box 9', label: 'Future Leader', color: 'bg-emerald-500 text-white border-emerald-600' },
      
      { id: 3, title: 'Box 3', label: 'Inconsistent', color: 'bg-amber-100 text-amber-800 border-amber-300' },
      { id: 4, title: 'Box 5', label: 'Core Player', color: 'bg-blue-200 text-blue-900 border-blue-400' },
      { id: 5, title: 'Box 8', label: 'High Impact', color: 'bg-indigo-300 text-indigo-900 border-indigo-500' },
      
      { id: 6, title: 'Box 1', label: 'Underperformer', color: 'bg-red-200 text-red-900 border-red-400' },
      { id: 7, title: 'Box 2', label: 'Effective', color: 'bg-amber-200 text-amber-900 border-amber-400' },
      { id: 8, title: 'Box 4', label: 'High Performer', color: 'bg-blue-300 text-blue-900 border-blue-500' }
    ];

    container.innerHTML = `
      <div class="flex items-center justify-between no-print">
        <button onclick="window.appNavigate('/history')" class="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition">
          <i data-feather="arrow-left" class="w-4 h-4"></i> Kembali
        </button>
        <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition hover:shadow flex items-center gap-2">
          <i data-feather="printer" class="w-4 h-4"></i> Cetak PDF / Laporan
        </button>
      </div>

      <!-- Header Cetak -->
      <div class="text-center mt-4">
        <h2 class="text-3xl font-bold tracking-tight text-slate-800">Hasil Asesmen 9-Box Matrix</h2>
        <p class="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">${assessment.period}</p>
        <div class="mt-6 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            ${emp.name.charAt(0)}
          </div>
          <div class="text-left">
            <h3 class="font-bold text-slate-800 leading-tight">${emp.name}</h3>
            <p class="text-xs text-slate-500">${emp.position}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        
        <!-- 9-Box Visual -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 avoid-break flex flex-col items-center">
          <h4 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i data-feather="grid" class="text-indigo-500 w-5 h-5 no-print"></i> Posisi Karyawan: <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm">${assessment.category}</span>
          </h4>
          
          <div class="relative w-full max-w-md">
            <!-- Y Axis Label -->
            <div class="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-slate-500 tracking-widest uppercase">
              Potensi (Y) &rarr;
            </div>
            <!-- Grid -->
            <div class="grid grid-cols-3 gap-2 w-full h-[400px] border-l-4 border-b-4 border-slate-800 p-2 relative bg-slate-50/50 rounded-bl-lg">
              ${boxes.map((box, i) => `
                <div class="border flex flex-col items-center justify-center rounded p-2 text-center relative transition-all duration-500 ${
                  i === activeBoxIndex 
                    ? `shadow-lg scale-105 z-10 ring-4 ring-offset-2 ring-indigo-500 ${box.color}` 
                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                }">
                  <span class="text-xs font-bold ${i === activeBoxIndex ? 'opacity-90' : ''}">${box.title}</span>
                  <span class="text-sm font-semibold mt-1 leading-tight">${box.label}</span>
                  ${i === activeBoxIndex ? '<i data-feather="star" class="absolute -top-3 -right-3 text-yellow-400 fill-yellow-400 w-8 h-8 drop-shadow-md"></i>' : ''}
                </div>
              `).join('')}
            </div>
            <!-- X Axis Label -->
            <div class="text-center mt-4 text-sm font-bold text-slate-500 tracking-widest uppercase">
              Performa (X) &rarr;
            </div>
          </div>
        </div>

        <!-- Detail Skor -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 avoid-break">
            <h4 class="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Rincian Skor</h4>
            <div class="flex justify-between items-center bg-blue-50 p-4 rounded-xl mb-4">
              <div>
                <p class="text-sm font-semibold text-blue-900">Total Potensi Leadership</p>
                <p class="text-xs text-blue-700">Maks. 30 Poin</p>
              </div>
              <div class="text-2xl font-bold text-blue-700">${assessment.totalLeadership}</div>
            </div>
            <div class="flex justify-between items-center bg-emerald-50 p-4 rounded-xl">
              <div>
                <p class="text-sm font-semibold text-emerald-900">Total Performa KPI</p>
                <p class="text-xs text-emerald-700">Maks. 30 Poin</p>
              </div>
              <div class="text-2xl font-bold text-emerald-700">${assessment.totalKpi}</div>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 text-sm">
              <div class="text-slate-500">Dinilai Oleh:</div>
              <div class="text-right font-medium text-slate-800">${assessment.assessor}</div>
              <div class="text-slate-500">Tanggal:</div>
              <div class="text-right font-medium text-slate-800">${new Date(assessment.date).toLocaleDateString('id-ID')}</div>
            </div>
          </div>
          
          <div class="bg-amber-50 p-6 rounded-2xl border border-amber-200 avoid-break">
            <h4 class="text-amber-900 font-bold mb-2 flex items-center gap-2">
              <i data-feather="message-circle" class="w-5 h-5"></i> Kesimpulan & Catatan
            </h4>
            <p class="text-amber-800 text-sm whitespace-pre-wrap leading-relaxed">
              ${assessment.notes || 'Tidak ada catatan tambahan yang diberikan oleh asesor.'}
            </p>
          </div>
        </div>

      </div>
    `;

    setTimeout(() => { if(window.feather) window.feather.replace(); }, 0);
  }

  render();
  return container;
}
