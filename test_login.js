const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mbzrtavjswxewzneuzut.supabase.co', 'sb_publishable_ahy6SBHAsL9yTkLfiRf3Ug_zhzrxEFv');

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'yazid180123@gmail.com', password: '082384307920' });
  console.log('Norman data:', JSON.stringify(data.user?.user_metadata));
  const res2 = await supabase.auth.signInWithPassword({ email: 'budileo@gmail.com', password: 'password123' }); // Might fail password, but let's see
  console.log('Budileo data:', JSON.stringify(res2.data.user?.user_metadata));
}
test();
