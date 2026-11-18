$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Get-Command java -ErrorAction SilentlyContinue)) { throw 'JDK 17을 설치하고 JAVA_HOME / PATH를 설정하세요.' }
if (-not (Get-Command gradle -ErrorAction SilentlyContinue)) { throw 'Gradle 8.9를 설치하고 PATH를 설정하세요.' }
if (-not $env:ANDROID_HOME -and -not $env:ANDROID_SDK_ROOT) { throw 'Android SDK 35와 Build Tools를 설치하고 ANDROID_HOME을 설정하세요.' }
Copy-Item -Path (Join-Path $projectRoot 'dist\*') -Destination (Join-Path $PSScriptRoot 'app\src\main\assets') -Recurse -Force
Push-Location $PSScriptRoot
try { gradle --no-daemon assembleDebug; if ($LASTEXITCODE -ne 0) { throw 'Android 빌드 실패. 위의 Gradle 로그를 확인하세요.' }; Write-Host 'APK: app\build\outputs\apk\debug\app-debug.apk' } finally { Pop-Location }
