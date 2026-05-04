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
       const tableName = opts.isCritical ? 'audit_logs' : 'activity_logs';
       const { error } = await supabase.from(tableName).insert([entry]);
       if (error) console.error("Gagal simpan log ke " + tableName + ":", error);
    } catch(e) {
       console.error("Exception simpan log:", e);
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
      let qAudit = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(250);
      let qActivity = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(250);

      if (filters.dateFrom) {
          qAudit = qAudit.gte('created_at', filters.dateFrom + 'T00:00:00Z');
          qActivity = qActivity.gte('created_at', filters.dateFrom + 'T00:00:00Z');
      }
      if (filters.dateTo) {
          qAudit = qAudit.lte('created_at', filters.dateTo + 'T23:59:59Z');
          qActivity = qActivity.lte('created_at', filters.dateTo + 'T23:59:59Z');
      }
      if (filters.action) {
          qAudit = qAudit.eq('action', filters.action);
          qActivity = qActivity.eq('action', filters.action);
      }
      if (filters.entityType) {
          qAudit = qAudit.eq('entity_type', filters.entityType);
          qActivity = qActivity.eq('entity_type', filters.entityType);
      }

      const [resAudit, resActivity] = await Promise.all([
          qAudit,
          filters.criticalOnly ? { data: [] } : qActivity
      ]);

      if (resAudit.error) throw resAudit.error;
      if (resActivity.error) throw resActivity.error;
      
      let combinedData = [...(resAudit.data || []), ...(resActivity.data || [])];
      // Sort descending by created_at
      combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      let logs = combinedData.map(d => ({
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
       console.error("Gagal query activity/audit log:", e);
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
