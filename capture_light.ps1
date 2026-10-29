$script = @'
<script>
  localStorage.setItem('fd_theme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
</script>
'@

$rooms = [System.IO.File]::ReadAllText("$PSScriptRoot\rooms.html")
$rooms = $rooms.Replace('<head>', "<head>`n$script")
$rooms = $rooms.Replace('<html lang="en">', '<html lang="en" data-theme="light">')
[System.IO.File]::WriteAllText("$PSScriptRoot\test_rooms_light.html", $rooms)

$index = [System.IO.File]::ReadAllText("$PSScriptRoot\index.html")
$index = $index.Replace('<head>', "<head>`n$script")
$index = $index.Replace('<html lang="en">', '<html lang="en" data-theme="light">')
[System.IO.File]::WriteAllText("$PSScriptRoot\test_index_light.html", $index)

Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1920,1080", "--screenshot=$PSScriptRoot\now_rooms_light.png", "file:///$PSScriptRoot/test_rooms_light.html" -Wait
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1920,1080", "--screenshot=$PSScriptRoot\now_index_light.png", "file:///$PSScriptRoot/test_index_light.html" -Wait

Write-Output "Done"
