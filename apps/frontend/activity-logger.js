/**
 * TATA GLOBAL - Activity Logger
 * Sistem pencatatan aktivitas terpusat untuk audit trail.
 * Disimpan ke localStorage key: tata_activity_logs
 */
const ActivityLogger = (function() {
  const LOG_KEY = 'tata_activity_logs';
  const SESSION_KEY = 'tata_session_id';

  // Generate session ID (persists per browser tab session)
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, 'S-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6));
  }

  function _generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
  }

  function _getAll() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function _save(logs) {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }

  /**
   * Catat aktivitas ke audit log.
   * @param {Object} opts
   * @param {string} opts.action - CREATE | UPDATE | DELETE | VOID | LOGIN | LOGOUT | SEARCH | PAYMENT
   * @param {string} opts.entityType - BON | PEMBAYARAN | MASTER_KONSUMEN | MASTER_MARKETING | MASTER_OPERASIONAL | USER | SYSTEM
   * @param {string} opts.entityId - ID entitas yang terdampak
   * @param {Object|null} opts.oldData - Data sebelum perubahan (untuk UPDATE/DELETE)
   * @param {Object|null} opts.newData - Data setelah perubahan (untuk CREATE/UPDATE)
   * @param {string} opts.status - success | failed
   * @param {string|null} opts.message - Pesan tambahan/error
   * @param {boolean} opts.isCritical - Apakah ini aktivitas kritis
   */
  function log(opts) {
    const logs = _getAll();
    const entry = {
      id: _generateId(),
      userId: 'budi-ariadi',
      userName: 'Budi Ariadi',
      action: opts.action || 'UNKNOWN',
      entityType: opts.entityType || 'SYSTEM',
      entityId: opts.entityId || '-',
      oldData: opts.oldData || null,
      newData: opts.newData || null,
      status: opts.status || 'success',
      message: opts.message || null,
      isCritical: opts.isCritical || false,
      sessionId: sessionStorage.getItem(SESSION_KEY),
      userAgent: navigator.userAgent.substring(0, 120),
      createdAt: new Date().toISOString()
    };
    logs.unshift(entry); // newest first
    // Keep max 2000 entries to prevent localStorage bloat
    if (logs.length > 2000) logs.length = 2000;
    _save(logs);
    return entry;
  }

  /**
   * Helper: Detect critical changes (nominal edits, status changes)
   */
  function isCriticalChange(oldData, newData) {
    if (!oldData || !newData) return false;
    // Nominal changed
    if (oldData.total !== undefined && newData.total !== undefined && oldData.total !== newData.total) return true;
    // Status changed
    if (oldData.status !== undefined && newData.status !== undefined && oldData.status !== newData.status) return true;
    // Nominal payment
    if (oldData.nominal !== undefined && newData.nominal !== undefined && oldData.nominal !== newData.nominal) return true;
    return false;
  }

  /**
   * Query logs with filters
   */
  function query(filters = {}) {
    let logs = _getAll();
    if (filters.dateFrom) logs = logs.filter(l => l.createdAt.split('T')[0] >= filters.dateFrom);
    if (filters.dateTo) logs = logs.filter(l => l.createdAt.split('T')[0] <= filters.dateTo);
    if (filters.action) logs = logs.filter(l => l.action === filters.action);
    if (filters.entityType) logs = logs.filter(l => l.entityType === filters.entityType);
    if (filters.criticalOnly) logs = logs.filter(l => l.isCritical);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      logs = logs.filter(l =>
        (l.entityId||'').toLowerCase().includes(q) ||
        (l.message||'').toLowerCase().includes(q) ||
        (l.userName||'').toLowerCase().includes(q) ||
        (l.entityType||'').toLowerCase().includes(q)
      );
    }
    return logs;
  }

  /**
   * Migrate existing tata_audit_logs (void logs) into the new format
   */
  function migrateOldLogs() {
    const oldLogs = JSON.parse(localStorage.getItem('tata_audit_logs') || '[]');
    if (oldLogs.length === 0) return;
    const newLogs = _getAll();
    const existingIds = new Set(newLogs.map(l => l.id));
    oldLogs.forEach(ol => {
      const migId = 'mig-' + (ol.waktu || '').replace(/[^a-z0-9]/gi, '').substring(0, 12);
      if (existingIds.has(migId)) return;
      newLogs.push({
        id: migId,
        userId: 'budi-ariadi',
        userName: ol.user || 'Budi Ariadi',
        action: 'VOID',
        entityType: ol.tipe === 'VOID BON' ? 'BON' : 'PEMBAYARAN',
        entityId: ol.targetId || '-',
        oldData: null,
        newData: { konsumen: ol.konsumen, nominal: ol.nominal },
        status: 'success',
        message: ol.alasan || null,
        isCritical: true,
        sessionId: null,
        userAgent: null,
        createdAt: ol.waktu || new Date().toISOString()
      });
    });
    _save(newLogs);
  }

  return { log, query, isCriticalChange, migrateOldLogs };
})();
