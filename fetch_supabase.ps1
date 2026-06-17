$content = Get-Content apps/frontend/supabaseClient.js -Raw
$url = [regex]::Match($content, 'SUPABASE_URL\s*=\s*[''"]([^''"]+)').Groups[1].Value
$key = [regex]::Match($content, 'SUPABASE_ANON_KEY\s*=\s*[''"]([^''"]+)').Groups[1].Value

$headers = @{
    'apikey' = $key
    'Authorization' = "Bearer $key"
}

$response = Invoke-RestMethod -Uri "$url/rest/v1/hrd_kehadiran?select=*" -Method Get -Headers $headers
$response | ConvertTo-Json -Depth 5
