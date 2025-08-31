@echo off
echo ========================================
echo  YouTube Thumbnail Downloader - Deploy
echo ========================================
echo.
echo This script will:
echo 1. Set up Git configuration
echo 2. Handle any sync issues with GitHub
echo 3. Upload your complete project
echo 4. Enable auto-deployment to Vercel
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git is installed! ✅
echo.

REM Get user information
echo Please provide your information:
echo.
set /p github_username="Enter your GitHub username: "
set /p github_email="Enter your GitHub email: "
set /p repo_name="Enter your repository name (e.g., youtube-thumbnail-downloader): "

echo.
echo Configuration:
echo - GitHub Username: %github_username%
echo - GitHub Email: %github_email%
echo - Repository: https://github.com/%github_username%/%repo_name%
echo.
set /p confirm_info="Is this information correct? (y/n): "
if /i not "%confirm_info%"=="y" (
    echo Please restart the script with correct information.
    pause
    exit /b 0
)

echo.
echo ========================================
echo  STEP 1: Configuring Git
echo ========================================
echo.

REM Configure Git
echo Setting up Git configuration...
git config --global user.name "%github_username%"
git config --global user.email "%github_email%"
echo Git configuration complete! ✅

echo.
echo ========================================
echo  STEP 2: Preparing Repository
echo ========================================
echo.

REM Initialize repository if needed
if not exist ".git" (
    echo Initializing new Git repository...
    git init
    echo Repository initialized! ✅
) else (
    echo Git repository already exists! ✅
)

echo.
echo ========================================
echo  STEP 3: Handling Remote Repository
echo ========================================
echo.

REM Remove existing remote if it exists
git remote remove origin >nul 2>&1

REM Add the correct remote
echo Adding GitHub repository...
git remote add origin https://github.com/%github_username%/%repo_name%.git
echo Remote repository added! ✅

echo.
echo ========================================
echo  STEP 4: Syncing with GitHub
echo ========================================
echo.

REM Try to pull any existing content
echo Checking for existing content on GitHub...
git fetch origin main >nul 2>&1

if %errorlevel% equ 0 (
    echo Found existing content. Syncing...
    git pull origin main --allow-unrelated-histories --strategy=recursive -X ours
    if %errorlevel% neq 0 (
        echo Trying alternative sync method...
        git reset --soft HEAD~1 >nul 2>&1
    )
) else (
    echo No existing content found. Creating new repository! ✅
)

echo.
echo ========================================
echo  STEP 5: Preparing Files for Upload
echo ========================================
echo.

echo Adding all project files...
git add .

echo.
echo Files to be uploaded:
git status --short
echo.

REM Count files
for /f %%i in ('git status --porcelain ^| find /c /v ""') do set file_count=%%i
echo Total files to upload: %file_count%
echo.

if %file_count% equ 0 (
    echo No changes to upload. Repository is up to date!
    pause
    exit /b 0
)

set /p confirm_upload="Upload these %file_count% files to GitHub? (y/n): "
if /i not "%confirm_upload%"=="y" (
    echo Upload cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo  STEP 6: Uploading to GitHub
echo ========================================
echo.

REM Create commit
echo Creating commit...
git commit -m "Complete YouTube Thumbnail Downloader - SEO optimized with Google Ads integration, version tracking, and auto-deployment ready"

echo.
echo Uploading to GitHub...
echo This may open a browser for authentication - please sign in to GitHub.
echo.

REM Set main branch
git branch -M main

REM Push to GitHub
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  🎉 SUCCESS! Upload Complete! 🎉
    echo ========================================
    echo.
    echo ✅ Your project is now on GitHub:
    echo    https://github.com/%github_username%/%repo_name%
    echo.
    echo ✅ All files uploaded: %file_count% files
    echo.
    echo 🚀 NEXT STEPS:
    echo.
    echo 1. VERCEL DEPLOYMENT:
    echo    - Go to: https://vercel.com
    echo    - Click "New Project"
    echo    - Import your GitHub repository
    echo    - Deploy automatically!
    echo.
    echo 2. GOOGLE ADS SETUP:
    echo    - Get your ad slot IDs from Google AdSense
    echo    - Update components/google-ads.tsx
    echo    - Push changes for automatic deployment
    echo.
    echo 3. SEO INDEXING:
    echo    - Set up Google Search Console
    echo    - Submit your sitemap
    echo    - Share on social media
    echo.
    echo 💰 Your YouTube thumbnail downloader is now:
    echo    ✅ SEO optimized for top Google rankings
    echo    ✅ Google Ads integrated for revenue
    echo    ✅ Auto-deployment enabled
    echo    ✅ Mobile responsive and fast
    echo    ✅ Version tracking for A/B testing
    echo.
) else (
    echo.
    echo ========================================
    echo  Upload Issues - Trying Force Push
    echo ========================================
    echo.
    echo The normal push failed. This usually means there are conflicts.
    echo.
    set /p force_push="Force push (overwrites GitHub with your local files)? (y/n): "
    if /i "%force_push%"=="y" (
        echo.
        echo Force pushing to GitHub...
        git push origin main --force
        
        if %errorlevel% equ 0 (
            echo.
            echo ✅ Force push successful! Your project is now on GitHub.
            echo    https://github.com/%github_username%/%repo_name%
        ) else (
            echo.
            echo ❌ Force push also failed. Please check:
            echo    1. Repository exists on GitHub
            echo    2. You have write access
            echo    3. Repository name is correct
            echo    4. Internet connection is working
        )
    ) else (
        echo Upload cancelled. Please resolve conflicts manually.
    )
)

echo.
echo ========================================
echo  🔄 AUTO-DEPLOYMENT SETUP
echo ========================================
echo.
echo To enable automatic deployment:
echo.
echo 1. Go to https://vercel.com and sign in
echo 2. Click "New Project"
echo 3. Select your repository: %repo_name%
echo 4. Click "Deploy"
echo.
echo After setup, every time you run this script:
echo GitHub → Vercel → Live Site (automatically!)
echo.

echo ========================================
echo  📋 IMPORTANT FILES CREATED
echo ========================================
echo.
echo ✅ GOOGLE-ADS-SETUP.md     - How to set up Google AdSense
echo ✅ SEO-INDEXING-GUIDE.md   - How to get indexed in Google
echo ✅ README.md               - Project documentation
echo ✅ vercel.json             - Deployment configuration
echo.

echo Thank you for using the YouTube Thumbnail Downloader deploy script!
echo Your project is now ready to generate revenue! 💰
echo.
pause
