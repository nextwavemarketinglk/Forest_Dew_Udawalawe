$script = @'
<script>
  window.addEventListener('load', () => {
    window.scrollTo(0, 800);
  });
</script>
'@

$index = [System.IO.File]::ReadAllText("$PSScriptRoot\index.html")
$index = $index.Replace('<head>', "<head>`n$script")
$index = $index.Replace('<html lang="en">', '<html lang="en" data-theme="light">')
[System.IO.File]::WriteAllText("$PSScriptRoot\test_scroll_light.html", $index)

Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1920,1080", "--screenshot=$PSScriptRoot\now_scroll_light.png", "file:///$PSScriptRoot/test_scroll_light.html" -Wait

Write-Output "Scroll screenshot done"
