$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$portablePhp = Join-Path $projectRoot 'tools\php\php.exe'

Get-Process php -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -eq $portablePhp } |
    Stop-Process

Write-Host 'Formatter tool PHP process stopped.'
