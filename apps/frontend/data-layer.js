// Data Layer - Cloud First Data Management
import { supabase } from './supabaseClient.js';

window.DataLayer = {
  data: {
    bons: [],
    pembayaran: [],
    master_konsumen: [],
    master_marketing: [],
    master_operasional: []
  },

  async init() {
    try {
      console.log('DataLayer: Initializing data from Supabase...');
      const [
        { data: bons },
        { data: pembayaran },
        { data: konsumen },
        { data: marketing },
        { data: operasional }
      ] = await Promise.all([
        supabase.from('bons').select('*').order('created_at', { ascending: false }),
        supabase.from('pembayaran').select('*').order('created_at', { ascending: true }),
        supabase.from('master_konsumen').select('*').order('created_at', { ascending: false }),
        supabase.from('master_marketing').select('*').order('created_at', { ascending: false }),
        supabase.from('master_operasional').select('*').order('created_at', { ascending: false })
      ]);

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
        id: d.id, nama: d.nama, telp: d.telp || '', wa: d.wa || '', alamat: d.alamat || '', updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_marketing = (marketing || []).map(d => ({
        id: d.id, nama: d.nama, telp: d.telp || '', wa: d.wa || '', alamat: d.alamat || '', updatedAt: new Date(d.created_at).getTime()
      }));
      this.data.master_operasional = (operasional || []).map(d => ({
        id: d.id, nama: d.nama, telp: d.telp || '', wa: d.wa || '', alamat: d.alamat || '', updatedAt: new Date(d.created_at).getTime()
      }));

      console.log('DataLayer: Initialization complete');
    } catch (e) {
      console.error('DataLayer Init Error:', e);
    }
  },

  getBons() {
    return this.data.bons;
  },

  getMaster(type) {
    const tableMap = { 'konsumen': 'master_konsumen', 'marketing': 'master_marketing', 'operasional': 'master_operasional' };
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
          potongan: payEvent.potongan,
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
    const tableMap = { 'konsumen': 'master_konsumen', 'marketing': 'master_marketing', 'operasional': 'master_operasional' };
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
           user_id: user.id,
           telp: payload.telp || '',
           wa: payload.wa || ''
        };
        if (type === 'konsumen') dbPayload.alamat = payload.alamat || '';
        
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
  }
};
