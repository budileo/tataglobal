const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://mbzrtavjswxewzneuzut.supabase.co', 'sb_publishable_ahy6SBHAsL9yTkLfiRf3Ug_zhzrxEFv');

async function testTables() {
  const tables = [
    'users', 'profiles', 'departments', 'role_permissions', 'user_permissions', 
    'token_tarif', 'token_history', 'activity_logs', 'audit_logs'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table} error: ${error.message} (code: ${error.code})`);
    } else {
      console.log(`Table ${table} exists. Rows returned: ${data.length}`);
      if (data.length > 0) {
        console.log(`Sample:`, data[0]);
      }
    }
  }
}

testTables();
