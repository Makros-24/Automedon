@echo off
REM =============================================================================
REM Build Script for Docker Deployment (Workaround for Tailwind CSS v4)
REM =============================================================================
REM This script builds the Next.js application locally and prepares it for
REM Docker deployment. This bypasses the Tailwind CSS v4 + Docker compatibility
REM issue by building in your local environment where native binaries work.
REM
REM Usage:
REM   build-for-docker.bat
REM =============================================================================

setlocal enabledelayedexpansion

REM Project paths
set "PROJECT_ROOT=%~dp0"
set "WEB_APP_DIR=%PROJECT_ROOT%src\app\web"
set "BUILD_MARKER=%PROJECT_ROOT%.docker-build-ready"

echo ================================================================
echo   Automedon Portfolio - Docker Build Script
echo ================================================================
echo.

REM Step 1: Check if we're in the right directory
echo [*] Checking project structure...
if not exist "%WEB_APP_DIR%" (
    echo [ERROR] Web application directory not found at %WEB_APP_DIR%
    exit /b 1
)
echo [OK] Project structure verified
echo.

REM Step 2: Navigate to web app directory
echo [*] Navigating to web application directory...
cd /d "%WEB_APP_DIR%"
echo [OK] Current directory: %CD%
echo.

REM Step 3: Check Node.js version
echo [*] Checking Node.js version...
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%
echo.

REM Step 4: Install dependencies
echo [*] Installing dependencies...
if exist "package-lock.json" (
    call npm ci
) else (
    call npm install
)
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 5: Clean previous build
echo [*] Cleaning previous build artifacts...
if exist ".next" (
    rmdir /s /q ".next"
    echo [OK] Removed .next directory
) else (
    echo [OK] No previous build to clean
)
echo.

REM Step 6: Build the Next.js application
echo [*] Building Next.js application...
echo This may take a few minutes...
echo.

REM Set production environment
set NODE_ENV=production
set NEXT_TELEMETRY_DISABLED=1

REM Run the build
call npm run build
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed. Please check the errors above.
    exit /b 1
)
echo.
echo [OK] Build completed successfully!
echo.

REM Step 7: Verify build output
echo [*] Verifying build output...
if not exist ".next" (
    echo [ERROR] .next directory not found after build
    exit /b 1
)

if not exist ".next\BUILD_ID" (
    echo [ERROR] BUILD_ID file not found
    exit /b 1
)

set /p BUILD_ID=<.next\BUILD_ID
echo [OK] Build ID: %BUILD_ID%
echo [OK] Build artifacts verified
echo.

REM Step 8: Setup .dockerignore for pre-built approach
echo [*] Configuring .dockerignore for pre-built approach...
cd /d "%PROJECT_ROOT%"

if exist ".dockerignore" if not exist ".dockerignore.backup" (
    copy /Y .dockerignore .dockerignore.backup > nul
    echo [OK] Backed up original .dockerignore
)

if exist ".dockerignore.prebuilt" (
    copy /Y .dockerignore.prebuilt .dockerignore > nul
    echo [OK] Switched to .dockerignore.prebuilt
    echo      ^(Original backed up as .dockerignore.backup^)
) else (
    echo [WARNING] .dockerignore.prebuilt not found, using existing .dockerignore
)
echo.

REM Step 9: Create build marker for Docker
echo [*] Creating build marker...
(
    echo Build completed at: %date% %time%
    echo Build ID: %BUILD_ID%
    echo Node.js version: %NODE_VERSION%
    echo Working directory: %WEB_APP_DIR%
    echo .dockerignore: Configured for pre-built approach
) > "%BUILD_MARKER%"
echo [OK] Build marker created
echo.

REM Step 10: Display next steps
echo ================================================================
echo   BUILD COMPLETE - Ready for Docker!
echo ================================================================
echo.
echo Next steps:
echo   1. Build the Docker image:
echo      docker compose -f docker-compose.prebuilt.yml build
echo.
echo   2. Run the container:
echo      docker compose -f docker-compose.prebuilt.yml up
echo.
echo   3. Access your portfolio at:
echo      http://localhost:3000
echo.
echo Build Information:
echo   - Build ID: %BUILD_ID%
echo   - Build artifacts: .next\
echo   - Ready for Docker: Yes
echo.

endlocal
