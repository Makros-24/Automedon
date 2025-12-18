@echo off
REM =============================================================================
REM Build and Push Script for Docker Hub (Windows)
REM =============================================================================
REM This script automates the complete workflow for building and pushing the
REM Automedon portfolio Docker image to Docker Hub.
REM
REM Usage:
REM   build-and-push.bat
REM
REM Prerequisites:
REM   - Docker Desktop installed and running
REM   - Docker Hub account (makros24)
REM   - Next.js project built locally (or script will rebuild)
REM =============================================================================

setlocal enabledelayedexpansion

REM Configuration
set "DOCKER_REPO=makros24/automedon"
set "DOCKERFILE=Dockerfile.prebuilt"
set "BUILD_MARKER=.docker-build-ready"

echo ================================================================
echo   Automedon Portfolio - Build and Push to Docker Hub
echo ================================================================
echo.

REM =============================================================================
REM Step 1: Check Prerequisites
REM =============================================================================
echo [*] Checking prerequisites...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/get-started
    exit /b 1
)

REM Check if Docker daemon is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running
    echo Please start Docker Desktop and try again
    exit /b 1
)

REM Check if Dockerfile.prebuilt exists
if not exist "%DOCKERFILE%" (
    echo [ERROR] %DOCKERFILE% not found
    exit /b 1
)

echo [OK] Docker is installed and running
echo [OK] %DOCKERFILE% found
echo.

REM =============================================================================
REM Step 2: Build Next.js Application Locally
REM =============================================================================
echo [*] Checking Next.js build...

set "REBUILD_NEEDED=false"

REM Check if build marker exists
if exist "%BUILD_MARKER%" (
    REM Check if file is older than 1 hour (3600 seconds)
    REM Windows doesn't have an easy way to check file age, so we'll just ask
    echo [OK] Build marker found
    choice /C YN /M "Do you want to rebuild the Next.js application"
    if errorlevel 2 (
        echo [OK] Skipping rebuild - using existing .next folder
        echo [WARNING] Make sure your .next folder is up to date!
    ) else (
        set "REBUILD_NEEDED=true"
    )
) else (
    echo [WARNING] No build marker found
    set "REBUILD_NEEDED=true"
)

REM Rebuild if needed
if "%REBUILD_NEEDED%"=="true" (
    echo [*] Building Next.js application...

    if exist "build-for-docker.bat" (
        call build-for-docker.bat
        if errorlevel 1 (
            echo [ERROR] Next.js build failed
            exit /b 1
        )
    ) else (
        echo [ERROR] build-for-docker.bat not found
        exit /b 1
    )
)

echo.

REM =============================================================================
REM Step 3: Get Version Number
REM =============================================================================
echo [*] Version Information
echo Please enter a version number for this release
echo Format: MAJOR.MINOR.PATCH (e.g., 1.0.0, 2.1.3)
echo.

:version_input
set /p "VERSION=Version number: "

REM Basic validation: ensure version is not empty
if "%VERSION%"=="" (
    echo [ERROR] Version cannot be empty
    echo.
    goto version_input
)

echo [OK] Using version: %VERSION%

REM Construct image tags
set "VERSION_TAG=%DOCKER_REPO%:v%VERSION%"
set "LATEST_TAG=%DOCKER_REPO%:latest"

echo.
echo Docker image will be tagged as:
echo   - %VERSION_TAG%
echo   - %LATEST_TAG%
echo.

REM =============================================================================
REM Step 4: Docker Hub Login
REM =============================================================================
echo [*] Docker Hub Authentication

REM Check if already logged in (basic check)
docker info 2>&1 | findstr /C:"Username" >nul
if not errorlevel 1 (
    echo [OK] Already logged in to Docker Hub

    choice /C YN /M "Do you want to log in with a different account"
    if not errorlevel 2 (
        echo Please log in to Docker Hub:
        docker login
        if errorlevel 1 (
            echo [ERROR] Docker login failed
            exit /b 1
        )
    )
) else (
    echo Please log in to Docker Hub:
    docker login
    if errorlevel 1 (
        echo [ERROR] Docker login failed
        exit /b 1
    )
)

echo.

REM =============================================================================
REM Step 5: Build Docker Image
REM =============================================================================
echo [*] Building Docker image...
echo This may take a few minutes...
echo.

REM Build the Docker image with both tags
docker build -f "%DOCKERFILE%" -t "%VERSION_TAG%" -t "%LATEST_TAG%" .
if errorlevel 1 (
    echo.
    echo [ERROR] Docker build failed
    exit /b 1
)

echo.
echo [OK] Docker image built successfully
echo.

REM =============================================================================
REM Step 6: Push to Docker Hub
REM =============================================================================
echo [*] Pushing images to Docker Hub...

REM Push version tag
echo Pushing %VERSION_TAG%...
docker push "%VERSION_TAG%"
if errorlevel 1 (
    echo [ERROR] Failed to push %VERSION_TAG%
    exit /b 1
)
echo [OK] Pushed %VERSION_TAG%

REM Push latest tag
echo Pushing %LATEST_TAG%...
docker push "%LATEST_TAG%"
if errorlevel 1 (
    echo [ERROR] Failed to push %LATEST_TAG%
    exit /b 1
)
echo [OK] Pushed %LATEST_TAG%

echo.

REM =============================================================================
REM Step 7: Success Summary
REM =============================================================================
echo ================================================================
echo   BUILD AND PUSH COMPLETE!
echo ================================================================
echo.
echo Images available on Docker Hub:
echo   - %VERSION_TAG%
echo   - %LATEST_TAG%
echo.
echo Deployment Commands:
echo.
echo To pull and run on any server:
echo   docker pull %DOCKER_REPO%:latest
echo   docker run -p 3000:3000 %DOCKER_REPO%:latest
echo.
echo Or use docker-compose:
echo   docker compose -f docker-compose.production.yml pull
echo   docker compose -f docker-compose.production.yml up -d
echo.
echo Docker Hub Repository:
echo   https://hub.docker.com/r/%DOCKER_REPO%
echo.
echo Version Information:
echo   Version: v%VERSION%
echo   Build date: %date% %time%
echo.

endlocal
