$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mysqladmin = Join-Path $root 'tools\mysql-9.7.0-winx64\bin\mysqladmin.exe'
$php = Join-Path $root 'tools\php\php.exe'

if (Test-Path $mysqladmin) {
    try {
        & $mysqladmin -uroot shutdown *> $null
    } catch {
    }
}

Get-Process php -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -eq $php } |
    Stop-Process

Write-Host 'Local PHP/MySQL processes stopped.'
