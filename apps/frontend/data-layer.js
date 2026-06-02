// Data Layer - Cloud First Data Management
import { supabase } from './supabaseClient.js';

window.DataLayer = {
  data: {
    bons: [],
    pembayaran: [],
    master_konsumen: [],
    master_marketing: [],
    master_operasional: [],
    master_jalur: [],
    master_kandang: [],
    stok_ayam: [],
    app_users: [],
    hrd_kehadiran: [],
    hrd_produktivitas: [],
    hrd_pelanggaran: [],
    hrd_pengembangan: []
  },

  async init() {
    try {
      console.log('DataLayer: Initializing data from Supabase...');
      // Fetch existing tables (these must always work)
      const [
        { data: bons },
        { data: pembayaran },
        { data: konsumen },
        { data: marketing },
        { data: operasional },
        { data: jalur }
      ] = await Promise.all([
        supabase.from('bons').select('*').order('created_at', { ascending: false }),
        supabase.from('pembayaran').select('*').order('created_at', { ascending: true }),
        supabase.from('master_konsumen').select('*').order('created_at', { ascending: false }),
        supabase.from('master_marketing').select('*').order('created_at', { ascending: false }),
        supabase.from('master_operasional').select('*').order('created_at', { ascending: false }),
        supabase.from('jalur_distribusi').select('*').order('created_at', { ascending: false })
      ]);

      // Fetch new tables gracefully (may not exist yet if SQL migration hasn't run)
      let kandang = null;
      let stok_ayam = null;
      try {
        const res1 = await supabase.from('master_kandang').select('*').order('created_at', { ascending: false });
        if (!res1.error) kandang = res1.data;
      } catch(e) { console.warn('DataLayer: master_kandang table not found, skipping.'); }
      try {
        const res2 = await supabase.from('data_stok_ayam').select('*').order('tanggal', { ascending: false });
        if (!res2.error) stok_ayam = res2.data;
      } catch(e) { console.warn('DataLayer: data_stok_ayam table not found, skipping.'); }

      let app_users = null;
      let hrd_kehadiran = null;
      let hrd_produktivitas = null;
      let hrd_pelanggaran = null;
      let hrd_pengembangan = null;

      try {
        const resUsers = await supabase.from('app_users').select('*').neq('role', 'OWNER');
        if (!resUsers.error) app_users = resUsers.data;
      } catch(e) { console.warn('DataLayer: app_users fetch failed.'); }

      try {
        const resH1 = await supabase.from('hrd_kehadiran').select('*').order('tanggal', { ascending: false });
        if (!resH1.error) hrd_kehadiran = resH1.data;
      } catch(e) { console.warn('DataLayer: hrd_kehadiran table not found, skipping.'); }

      try {
        const resH2 = await supabase.from('hrd_produktivitas').select('*').order('tanggal', { ascending: false });
        if (!resH2.error) hrd_produktivitas = resH2.data;
      } catch(e) { console.warn('DataLayer: hrd_produktivitas table not found, skipping.'); }

      try {
        const resH3 = await supabase.from('hrd_pelanggaran').select('*').order('tanggal', { ascending: false });
        if (!resH3.error) hrd_pelanggaran = resH3.data;
      } catch(e) { console.warn('DataLayer: hrd_pelanggaran table not found, skipping.'); }

      try {
        const resH4 = await supabase.from('hrd_pengembangan').select('*').order('tanggal', { ascending: false });
        if (!resH4.error) hrd_pengembangan = resH4.data;
      } catch(e) { console.warn('DataLayer: hrd_pengembangan table not found, skipping.'); }

      // Process Bons
      this.data.bons = (bons || []).map(dbBon => ({
        _dbId: dbBon.id,
        id: dbBon.no_faktur,
        tanggal: dbBon.tanggal,
        konsumen: dbBon.konsumen,
        marketing: dbBon.marketing || '',
        staf: dbBon.staf || '',
        total: Number(dbBon.total),
        status: dbBon.status,
        isVoid: dbBon.is_void,
        keterangan: dbBon.keterangan || '',
        items: dbBon.items || [],
        historiBayar: []
      }));

      // Process Pembayaran
      (pembayaran || []).forEach(dbPay => {
        let bonIdx = this.data.bons.findIndex(b => b._dbId === dbPay.bon_id);
        if (bonIdx >= 0) {
          const mappedPay = {
            _dbId: dbPay.id,
            id: 'PY-CLOUD',
            tanggal: dbPay.tanggal,
            kolektor: dbPay.kolektor || '',
            kasir: 'Budi Ariadi', // auto for now
            caraBayar: dbPay.cara_bayar || '',
            waktu: dbPay.waktu || '',
            memo: dbPay.memo || (dbPay.potongan && dbPay.potongan._memo) || '',
            nominal: Number(dbPay.nominal),
            potongan: dbPay.potongan || { harga:0, matiKg:0, matiRp:0, susutKg:0, susutRp:0, pulangKg:0, pulangRp:0 },
            totalPotongan: Number(dbPay.total_potongan),
            isVoid: dbPay.is_void
          };
          this.data.bons[bonIdx].historiBayar.push(mappedPay);
        }
      });

      // Process Master
      this.data.master_konsumen = (konsumen || []).map(d => ({
        id: d.id, nama: d.nama, alamat: d.alamat || '', jalur: d.jalur || '', updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_marketing = (marketing || []).map(d => ({
        id: d.id, nama: d.nama, updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_operasional = (operasional || []).map(d => ({
        id: d.id, nama: d.nama, updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_jalur = (jalur || []).map(d => ({
        id: d.id, nama: d.nama, updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_kandang = (kandang || []).map(d => ({
        id: d.id, nama: d.nama, alamat: d.alamat || '', kontak_person: d.kontak_person || '', updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.stok_ayam = stok_ayam || [];
      this.data.app_users = app_users || [];
      this.data.hrd_kehadiran = hrd_kehadiran || [];
      this.data.hrd_produktivitas = hrd_produktivitas || [];
      this.data.hrd_pelanggaran = hrd_pelanggaran || [];
      this.data.hrd_pengembangan = hrd_pengembangan || [];

      console.log('DataLayer: Initialization complete');
    } catch (e) {
      console.error('DataLayer Init Error:', e);
    }
  },

  getBons() {
    return this.data.bons;
  },

  getMaster(type) {
    const tableMap = { 'konsumen': 'master_konsumen', 'marketing': 'master_marketing', 'operasional': 'master_operasional', 'jalur': 'master_jalur', 'kandang': 'master_kandang' };
    return this.data[tableMap[type]] || [];
  },

  async saveBon(bon, isDelete = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Sesi cloud tidak ditemukan! Harap login ulang."); return; }

    try {
      if (isDelete) {
        const res = await supabase.from('bons').delete().eq('id', bon._dbId);
        if (res && res.error) throw new Error(res.error.message);
      } else {
        const payload = {
          id: bon._dbId,
          user_id: user.id,
          no_faktur: bon.id,
          konsumen: bon.konsumen,
          marketing: bon.marketing || '',
          staf: bon.staf || '',
          total: bon.total,
          tanggal: bon.tanggal,
          status: bon.status,
          is_void: bon.isVoid || false,
          keterangan: bon.keterangan || '',
          items: bon.items || []
        };
        
        const { data: existing } = await supabase.from('bons').select('id').eq('id', bon._dbId);
        if (existing && existing.length > 0) {
          const res = await supabase.from('bons').update(payload).eq('id', bon._dbId);
          if (res && res.error) throw new Error(res.error.message);
        } else {
          const res = await supabase.from('bons').insert([payload]);
          if (res && res.error) throw new Error(res.error.message);
        }
      }
      await this.init(); // Refresh data
    } catch (e) { alert("Gagal Simpan Bon Cloud: " + e.message); console.error(e); }
  },

  async savePembayaran(bon, payEvent, isDelete = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Sesi cloud tidak ditemukan! Harap login ulang."); return; }

    let bonUuid = bon._dbId;
    if(!bonUuid) {
        const { data: bData } = await supabase.from('bons').select('id').eq('no_faktur', bon.id).single();
        if(bData) bonUuid = bData.id;
        else { alert("Parent Bon tidak ditemukan di Cloud!"); return; }
    }

    try {
      if (isDelete) {
        const res = await supabase.from('pembayaran').delete().eq('id', payEvent._dbId);
        if (res && res.error) throw new Error(res.error.message);
      } else {
        const payload = {
          id: payEvent._dbId,
          user_id: user.id,
          bon_id: bonUuid,
          nominal: payEvent.nominal,
          total_potongan: payEvent.totalPotongan,
          cara_bayar: payEvent.caraBayar,
          tanggal: payEvent.tanggal,
          kolektor: payEvent.kolektor,
          waktu: payEvent.waktu,
          potongan: Object.assign({}, payEvent.potongan, { _memo: payEvent.memo || '' }),
          is_void: payEvent.isVoid || false
        };
        
        const { data: existing } = await supabase.from('pembayaran').select('id').eq('id', payEvent._dbId);
        if (existing && existing.length > 0) {
          const res = await supabase.from('pembayaran').update(payload).eq('id', payEvent._dbId);
          if (res && res.error) throw new Error(res.error.message);
        } else {
          const res = await supabase.from('pembayaran').insert([payload]);
          if (res && res.error) throw new Error(res.error.message);
        }
        
        const resBon = await supabase.from('bons').update({ status: bon.status }).eq('id', bonUuid);
        if (resBon && resBon.error) throw new Error(resBon.error.message);
      }
      await this.init(); // Refresh data
    } catch (e) { alert("Gagal Simpan Pembayaran Cloud: " + e.message); console.error(e); }
  },

  async saveMaster(type, payload, isDelete = false) {
    const tableMap = { 'konsumen': 'master_konsumen', 'marketing': 'master_marketing', 'operasional': 'master_operasional', 'jalur': 'jalur_distribusi', 'kandang': 'master_kandang' };
    const tableName = tableMap[type];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Sesi cloud tidak ditemukan! Harap login ulang."); return; }
    
    try {
      if (isDelete) {
        const res = await supabase.from(tableName).delete().eq('id', payload.id);
        if (res && res.error) throw new Error(res.error.message);
      } else {
        const dbPayload = { 
           nama: payload.nama, 
           user_id: user.id
        };
        if (type === 'konsumen' || type === 'kandang') dbPayload.alamat = payload.alamat || '';
        if (type === 'kandang') dbPayload.kontak_person = payload.kontak_person || '';
        if (type === 'konsumen') dbPayload.jalur = payload.jalur || '';
        
        const { data: existing } = await supabase.from(tableName).select('id').eq('id', payload.id);
        if (existing && existing.length > 0) {
          const res = await supabase.from(tableName).update(dbPayload).eq('id', payload.id);
          if (res && res.error) throw new Error(res.error.message);
        } else {
          dbPayload.id = payload.id; 
          const res = await supabase.from(tableName).insert([dbPayload]);
          if (res && res.error) throw new Error(res.error.message);
        }
      }
      await this.init(); // Refresh data
    } catch (e) { alert("Gagal Simpan Master Cloud: " + e.message); console.error(e); }
  },

  async getStokAyam() {
    return this.data.stok_ayam;
  },

  async saveStokAyam(payload, isDelete = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Sesi cloud tidak ditemukan! Harap login ulang."); return; }
    try {
      if (isDelete) {
        const res = await supabase.from('data_stok_ayam').delete().eq('id', payload.id);
        if (res && res.error) throw new Error(res.error.message);
      } else {
        const dbPayload = { ...payload, user_id: user.id };
        const { data: existing } = await supabase.from('data_stok_ayam').select('id').eq('id', payload.id);
        if (existing && existing.length > 0) {
          const res = await supabase.from('data_stok_ayam').update(dbPayload).eq('id', payload.id);
          if (res && res.error) throw new Error(res.error.message);
        } else {
          const res = await supabase.from('data_stok_ayam').insert([dbPayload]);
          if (res && res.error) throw new Error(res.error.message);
        }
      }
      await this.init(); // Refresh data
    } catch (e) { alert("Gagal Simpan Stok Ayam Cloud: " + e.message); console.error(e); }
  },

  getHrdKaryawan() {
    const ops = this.data.master_operasional.map(o => ({ id: o.id, nama: o.nama, asal_tabel: 'operasional' }));
    const usr = this.data.app_users.map(u => ({ id: u.id, nama: u.name, asal_tabel: 'user' }));
    return [...ops, ...usr].sort((a, b) => a.nama.localeCompare(b.nama));
  },
  
  getHrdData(type) {
    return this.data[`hrd_${type}`] || [];
  },

  async saveHrdData(type, payload, isDelete = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Sesi cloud tidak ditemukan! Harap login ulang."); return; }
    
    const tableName = `hrd_${type}`;
    try {
      if (isDelete) {
        if (!payload.id) throw new Error("ID tidak boleh kosong untuk penghapusan.");
        const res = await supabase.from(tableName).delete().eq('id', payload.id);
        if (res && res.error) throw new Error(res.error.message);
      } else {
        const dbPayload = { ...payload, user_id: user.id };
        
        let existing = null;
        if (payload.id) {
          const { data, error } = await supabase.from(tableName).select('id').eq('id', payload.id);
          if (!error) existing = data;
        }

        if (existing && existing.length > 0) {
          const res = await supabase.from(tableName).update(dbPayload).eq('id', payload.id);
          if (res && res.error) throw new Error(res.error.message);
        } else {
          // If inserting a new record, ensure undefined id is not sent to Supabase
          if (dbPayload.id === undefined) delete dbPayload.id;
          const res = await supabase.from(tableName).insert([dbPayload]);
          if (res && res.error) throw new Error(res.error.message);
        }
      }
      await this.init(); // Refresh data
    } catch (e) { alert(`Gagal Simpan HRD ${type} Cloud: ` + e.message); console.error(e); }
  }
};
