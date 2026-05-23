
$filePath = "apps/frontend/laporan.html"
$content = Get-Content $filePath -Raw

$oldBlock = @"
          } else if (mode === 'ukuran') {
              wsData.push(['--- Rekapitulasi Matrik Ukuran Ayam ---']);
              wsData.push(['No', 'Mapping Ukuran', 'Jumlah Ekor', 'Jumlah Berat (Netto)']);
              
              const bons = getAllBons().filter(b=>!b.isVoid&&b.tanggal===dateStr).sort((a,b) => {
                  const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
                  const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
                  if (numA !== numB) return numA - numB;
                  return a.id.localeCompare(b.id);
              });
              
              const rekapMap = { 'KTN': { ekor: 0, kg: 0 }, 'K': { ekor: 0, kg: 0 }, 'TB': { ekor: 0, kg: 0 }, 'B': { ekor: 0, kg: 0 }, 'JK': { ekor: 0, kg: 0 }, 'JB': { ekor: 0, kg: 0 } };
              const detailRows = [];
              
              bons.forEach(b => {
                  (b.items || []).forEach(it => {
                      const ekor = Number(it.jmlAyam || 0);
                      const kg = Number(it.netto || 0);
                      if (ekor > 0) {
                          const rata = kg / ekor;
                          let mapping = '';
                          if (rata < 0.8) mapping = 'KTN';
                          else if (rata < 1.3) mapping = 'K';
                          else if (rata < 1.7) mapping = 'TB';
                          else if (rata < 2.0) mapping = 'B';
                          else if (rata < 2.3) mapping = 'JK';
                          else mapping = 'JB';
                          
                          const originalUkuran = (it.ukuran || '').toUpperCase();
                          const geser = mapping !== originalUkuran ? 'Geser' : '';
                          
                          rekapMap[mapping].ekor += ekor;
                          rekapMap[mapping].kg += kg;
                          
                          detailRows.push([detailRows.length + 1, b.id, b.konsumen, ekor, kg, rata, mapping, originalUkuran, geser]);
                      }
                  });
              });
              
              const order = ['KTN', 'K', 'TB', 'B', 'JK', 'JB'];
              let no = 1;
              order.forEach(key => {
                  if (rekapMap[key].ekor > 0 || rekapMap[key].kg > 0) {
                      wsData.push([no++, key, rekapMap[key].ekor, rekapMap[key].kg]);
                  }
              });

              // Add Task A info to Excel
              const tPesanan = detailRows.length;
              const tGeser = detailRows.filter(r => r[8] === 'Geser').length;
              const pGeser = tPesanan > 0 ? (tGeser / tPesanan * 100).toFixed(0) : 0;
              wsData.push(['']);
              wsData.push(['Total Jumlah Pesanan', tPesanan]);
              wsData.push(['Total Jumlah Geser', `${tGeser}, ${pGeser}%`]);
              
              wsData.push(['']);
              wsData.push(['--- Laporan Matrik Ukuran Ayam ---']);
              wsData.push(['No', 'No Bon', 'Nama Konsumen', 'Jumlah Ayam (ekor)', 'Berat Netto (kg)', 'Rata Rata Ayam (kg)', 'Mapping Ukuran', 'Ukuran', 'Geser']);
              detailRows.forEach(row => wsData.push(row));
"@

$newBlock = @"
          } else if (mode === 'ukuran') {
              wsData.push(['--- Rekapitulasi Matrik Ukuran Ayam ---']);
              wsData.push(['No', 'Mapping Ukuran', 'Jumlah Ekor', 'Jumlah Berat (Netto)']);
              
              const bons = getAllBons().filter(b=>!b.isVoid&&b.tanggal===dateStr).sort((a,b) => {
                  const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
                  const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
                  if (numA !== numB) return numA - numB;
                  return a.id.localeCompare(b.id);
              });
              
              const rekapMap = { 'KTN': { ekor: 0, kg: 0 }, 'K': { ekor: 0, kg: 0 }, 'TB': { ekor: 0, kg: 0 }, 'B': { ekor: 0, kg: 0 }, 'JK': { ekor: 0, kg: 0 }, 'JB': { ekor: 0, kg: 0 } };
              const auditMap = { 'KTN': { ekor: 0, kg: 0 }, 'K': { ekor: 0, kg: 0 }, 'TB': { ekor: 0, kg: 0 }, 'B': { ekor: 0, kg: 0 }, 'JK': { ekor: 0, kg: 0 }, 'JB': { ekor: 0, kg: 0 } };
              const detailRows = [];
              
              bons.forEach(b => {
                  (b.items || []).forEach(it => {
                      const ekor = Number(it.jmlAyam || 0);
                      const kg = Number(it.netto || 0);
                      if (ekor > 0) {
                          const rata = kg / ekor;
                          let mapping = '';
                          if (rata < 0.8) mapping = 'KTN';
                          else if (rata < 1.3) mapping = 'K';
                          else if (rata < 1.7) mapping = 'TB';
                          else if (rata < 2.0) mapping = 'B';
                          else if (rata < 2.3) mapping = 'JK';
                          else mapping = 'JB';
                          
                          const originalUkuran = (it.ukuran || '').toUpperCase();
                          const geser = mapping !== originalUkuran ? 'Geser' : '';
                          
                          rekapMap[mapping].ekor += ekor;
                          rekapMap[mapping].kg += kg;
                          
                          if (auditMap[originalUkuran]) {
                              auditMap[originalUkuran].ekor += ekor;
                              auditMap[originalUkuran].kg += kg;
                          }
                          
                          detailRows.push([detailRows.length + 1, b.id, b.konsumen, ekor, kg, rata, mapping, originalUkuran, geser]);
                      }
                  });
              });
              
              const order = ['KTN', 'K', 'TB', 'B', 'JK', 'JB'];
              let no = 1;
              order.forEach(key => {
                  if (rekapMap[key].ekor > 0 || rekapMap[key].kg > 0) {
                      wsData.push([no++, key, rekapMap[key].ekor, rekapMap[key].kg]);
                  }
              });

              // Add Task A info to Excel
              const tPesanan = detailRows.length;
              const tGeser = detailRows.filter(r => r[8] === 'Geser').length;
              const pGeser = tPesanan > 0 ? (tGeser / tPesanan * 100).toFixed(0) : 0;
              wsData.push(['']);
              wsData.push(['Total Jumlah Pesanan', tPesanan]);
              wsData.push(['Total Jumlah Geser', `${tGeser}, ${pGeser}%`]);

              // Audit Excel
              wsData.push(['']);
              wsData.push(['--- Data Audit Matrik dengan Realisasi penjualan ---']);
              wsData.push(['No', 'Jenis Ukuran', 'Audit', 'Audit Jumlah Ekor', 'Jumlah Ekor', 'Jumlah Kg']);
              let aNo = 1;
              order.forEach(key => {
                  const ad = auditMap[key];
                  const rd = rekapMap[key];
                  if (ad.ekor > 0 || rd.ekor > 0) {
                      wsData.push([aNo, key, 'Audit Ukuran', ad.ekor, ad.ekor, ad.kg]);
                      wsData.push(['', '', 'Mapping Realisasi', rd.ekor, rd.ekor, rd.kg]);
                      wsData.push(['', '', 'Selisih', ad.ekor - rd.ekor, ad.ekor - rd.ekor, ad.kg - rd.kg]);
                      aNo++;
                  }
              });
              
              wsData.push(['']);
              wsData.push(['--- Laporan Matrik Ukuran Ayam ---']);
              wsData.push(['No', 'No Bon', 'Nama Konsumen', 'Jumlah Ayam (ekor)', 'Berat Netto (kg)', 'Rata Rata Ayam (kg)', 'Mapping Ukuran', 'Ukuran', 'Geser']);
              detailRows.forEach(row => wsData.push(row));
"@

if ($content.Contains($oldBlock)) {
    $newContent = $content.Replace($oldBlock, $newBlock)
    Set-Content $filePath $newContent -NoNewline
    Write-Output "Successfully replaced block"
} else {
    Write-Error "Could not find old block"
}
