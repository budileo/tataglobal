import { store } from '../store.js';

export default function History() {
  const container = document.createElement('div');
  container.className = 'space-y-6 slide-in';

  function render() {
    const assessments = store.getAssessments().slice().reverse(); // newest first
    const employees = store.getEmployees();
    const periods = store.getPeriods();

    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-slate-800">Riwayat Asesmen</h2>
          <p class="text-slate-500 mt-1">Daftar semua penilaian kinerja 9-Box Matrix</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
          <select id="filter-period" class="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Periode</option>
            ${periods.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
          <input type="text" id="search-emp" placeholder="Cari nama karyawan..." class="px-4 py-2 border border-slate-300 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500">
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
            <tbody id="history-body" class="divide-y divide-slate-100">
              <!-- Rendered via JS filtering -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    setTimeout(() => {
      if(window.feather) window.feather.replace();
      
      const filterPeriod = container.querySelector('#filter-period');
      const searchEmp = container.querySelector('#search-emp');
      const tbody = container.querySelector('#history-body');

      function updateTable() {
        const periodVal = filterPeriod.value;
        const searchVal = searchEmp.value.toLowerCase();

        const filtered = assessments.filter(a => {
          const emp = employees.find(e => e.id === a.employeeId);
          const name = emp ? emp.name.toLowerCase() : '';
          const matchPeriod = periodVal ? a.period === periodVal : true;
          const matchName = name.includes(searchVal);
          return matchPeriod && matchName;
        });

        tbody.innerHTML = filtered.length > 0 ? filtered.map(a => {
          const emp = employees.find(e => e.id === a.employeeId) || { name: 'Unknown' };
          return `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-600 whitespace-nowrap">${new Date(a.date).toLocaleDateString('id-ID')}</td>
              <td class="px-6 py-4 font-medium text-slate-800">${a.period}</td>
              <td class="px-6 py-4 font-medium text-slate-800">${emp.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm">
                  ${a.category}
                </span>
              </td>
              <td class="px-6 py-4 text-center font-bold text-blue-600">${a.totalLeadership}</td>
              <td class="px-6 py-4 text-center font-bold text-emerald-600">${a.totalKpi}</td>
              <td class="px-6 py-4 text-right">
                 <button onclick="window.appNavigate('/result?id=${a.id}')" class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm transition">Lihat</button>
              </td>
            </tr>
          `;
        }).join('') : `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">Tidak ada data yang sesuai filter.</td></tr>`;
      }

      filterPeriod.addEventListener('change', updateTable);
      searchEmp.addEventListener('input', updateTable);
      updateTable();
    }, 0);
  }

  render();
  return container;
}
