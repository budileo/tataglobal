import { store } from '../store.js';

export default function Dashboard() {
  const employees = store.getEmployees();
  const assessments = store.getAssessments();

  // Simple stats
  const totalEmployees = employees.length;
  const totalAssessments = assessments.length;
  
  // Latest assessments
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
