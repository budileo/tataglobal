/**
 * TATA GLOBAL - Activity Logger (Cloud-First)
 * Sistem pencatatan aktivitas terpusat untuk audit trail, tersimpan di Supabase.
 */
const ActivityLogger = (function() {
  const SESSION_KEY = 'tata_session_id';

  // Generate session ID (persists per browser tab session)
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, 'S-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6));
  }

  // Helper to get supabase client securely
  function getSupabase() {
    if (window.supabaseClient) return window.supabaseClient;
    if (window.supabase) return window.supabase;
    console.warn("Supabase client belum siap!");
    return null;
  }

  /**
   * Catat aktivitas ke audit log di Supabase.
   */
  async function log(opts) {
    const supabase = getSupabase();
    if (!supabase) return null;

    let user_id = null;
    let userName = 'System';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         user_id = user.id;
         userName = user.email || 'User';
      }
    } catch(e) {}

    const entry = {
      user_id: user_id,
      user_name: userName,
      action: opts.action || 'UNKNOWN',
      entity_type: opts.entityType || 'SYSTEM',
      entity_id: String(opts.entityId || '-'),
      old_data: opts.oldData || null,
      new_data: opts.newData || null,
      status: opts.status || 'success',
      message: opts.message || null,
      is_critical: opts.isCritical || false,
      session_id: sessionStorage.getItem(SESSION_KEY)
    };

    try {
       // Insert into audit_logs table
       const { error } = await supabase.from('audit_logs').insert([entry]);
       if (error) console.error("Gagal simpan audit log:", error);
    } catch(e) {
       console.error("Exception simpan audit log:", e);
    }
    
    return entry;
  }

  function isCriticalChange(oldData, newData) {
    if (!oldData || !newData) return false;
    if (oldData.total !== undefined && newData.total !== undefined && oldData.total !== newData.total) return true;
    if (oldData.status !== undefined && newData.status !== undefined && oldData.status !== newData.status) return true;
    if (oldData.nominal !== undefined && newData.nominal !== undefined && oldData.nominal !== newData.nominal) return true;
    return false;
  }

  async function query(filters = {}) {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      let q = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(500);

      if (filters.dateFrom) q = q.gte('created_at', filters.dateFrom + 'T00:00:00Z');
      if (filters.dateTo) q = q.lte('created_at', filters.dateTo + 'T23:59:59Z');
      if (filters.action) q = q.eq('action', filters.action);
      if (filters.entityType) q = q.eq('entity_type', filters.entityType);
      if (filters.criticalOnly) q = q.eq('is_critical', true);
      // for search, you might need a custom RPC or ilike on multiple fields in a real app, 
      // but for now we fetch and filter locally if search is present, to keep it simple
      
      const { data, error } = await q;
      if (error) throw error;
      
      let logs = data.map(d => ({
         id: d.id,
         userId: d.user_id,
         userName: d.user_name,
         action: d.action,
         entityType: d.entity_type,
         entityId: d.entity_id,
         oldData: d.old_data,
         newData: d.new_data,
         status: d.status,
         message: d.message,
         isCritical: d.is_critical,
         sessionId: d.session_id,
         createdAt: d.created_at
      }));

      if (filters.search) {
        const srch = filters.search.toLowerCase();
        logs = logs.filter(l => 
          (l.entityId||'').toLowerCase().includes(srch) ||
          (l.message||'').toLowerCase().includes(srch) ||
          (l.userName||'').toLowerCase().includes(srch) ||
          (l.entityType||'').toLowerCase().includes(srch)
        );
      }
      return logs;
    } catch(e) {
       console.error("Gagal query audit log:", e);
       return [];
    }
  }

  function migrateOldLogs() {
    // Disabled now that we use cloud DB entirely
  }

  // Also expose fetchCloudLogs just for compatibility with existing histori.html code if needed
  async function fetchCloudLogs() { return []; }

  return { log, query, isCriticalChange, migrateOldLogs, fetchCloudLogs };
})();
