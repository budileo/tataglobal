$response = Invoke-WebRequest -Uri "https://tataglobal.vercel.app/dasbort_hrd" -UseBasicParsing
$response.Content | Out-File -FilePath "vercel_html.txt" -Encoding utf8
