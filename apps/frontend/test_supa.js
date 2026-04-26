const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://mbzrtavjswxewzneuzut.supabase.co', 'sb_publishable_ahy6SBHAsL9yTkLfiRf3Ug_zhzrxEFv');

async function test() {
  const { data, error } = await supabase.from('master_konsumen').insert([{ 
      id: 'd9b93e62-520d-4ea3-8f64-42b7a9de1924', 
      nama: 'Test', 
      telepon: '123', 
      alamat: 'Test',
      user_id: 'd9b93e62-520d-4ea3-8f64-42b7a9de1924' // fake user id
  }]);
  console.log('Insert Result:', data, error);
}

test();
