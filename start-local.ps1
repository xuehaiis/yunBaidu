$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mysql = Join-Path $root 'tools\mysql-9.7.0-winx64\bin\mysqld.exe'
$mysqladmin = Join-Path $root 'tools\mysql-9.7.0-winx64\bin\mysqladmin.exe'
$php = Join-Path $root 'tools\php\php.exe'
$dataDir = Join-Path $root 'tools\mysql-data'

if (-not (Test-Path $mysql)) {
    throw 'MySQL executable not found. Please check tools\mysql-9.7.0-winx64.'
}

if (-not (Test-Path $php)) {
    throw 'PHP executable not found. Please check tools\php.'
}

$mysqlRunning = $false
try {
    & $mysqladmin -uroot ping *> $null
    $mysqlRunning = $LASTEXITCODE -eq 0
} catch {
    $mysqlRunning = $false
}

if (-not $mysqlRunning) {
    Start-Process -FilePath $mysql -ArgumentList @(
        "--basedir=$root\tools\mysql-9.7.0-winx64",
        "--datadir=$dataDir",
        '--port=3306'
    ) -WindowStyle Hidden
    Start-Sleep -Seconds 5
}

$phpRunning = Get-Process php -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -eq $php }

if (-not $phpRunning) {
    Start-Process -FilePath $php -ArgumentList @(
        '-S',
        '127.0.0.1:8000',
        '-t',
        $root
    ) -WorkingDirectory $root -WindowStyle Hidden
}

Write-Host 'Local site is running: http://127.0.0.1:8000/index.php'
