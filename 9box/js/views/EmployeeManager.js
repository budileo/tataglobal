import { store } from '../store.js';

export default function EmployeeManager() {
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

      <!-- Form (Hidden by default) -->
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

      <!-- Table -->
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
