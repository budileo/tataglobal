$path = "c:\Users\user\Documents\AI HR 2026\js\app.js"
$text = [IO.File]::ReadAllText($path)
$start = $text.IndexOf("function PreAssessment()")
if ($start -ge 0) {
    $pre = $text.Substring(0, $start)
    $post = $text.Substring($start).Replace("\``", "``").Replace("\${", "${")
    [IO.File]::WriteAllText($path, $pre + $post)
    Write-Host "Fixed!"
} else {
    Write-Host "Not found"
}
