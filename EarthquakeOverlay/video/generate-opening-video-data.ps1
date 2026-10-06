$videoPath = Join-Path $PSScriptRoot "Opening.mp4"
$outputPath = Join-Path $PSScriptRoot "opening-video-data.js"
$encodedVideo = [Convert]::ToBase64String([IO.File]::ReadAllBytes($videoPath))
$parts = [regex]::Matches($encodedVideo, ".{1,120}") | ForEach-Object { '"' + $_.Value + '"' }
$content = "window.openingVideoData = " + ($parts -join " +`n") + ";"
[IO.File]::WriteAllText($outputPath, $content, [Text.UTF8Encoding]::new($false))
