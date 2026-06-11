$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $root
$portablePhp = Join-Path $projectRoot 'tools\php\php.exe'

if (Test-Path $portablePhp) {
    $php = $portablePhp
} else {
    $php = 'php'
}

Start-Process -FilePath $php -ArgumentList @(
    '-S',
    '127.0.0.1:8010',
    '-t',
    $root
) -WorkingDirectory $root -WindowStyle Hidden

Write-Host 'Formatter tool is running: http://127.0.0.1:8010/index.php'
