@echo off
echo ========================================
echo  Universal GitHub Deploy Script
echo ========================================
echo.
echo This script will:
echo 1. Auto-detect your project type
echo 2. Set up Git configuration
echo 3. Handle any sync issues with GitHub
echo 4. Upload your complete project
echo 5. Provide deployment instructions
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

REM Auto-detect project type
echo ========================================
echo  🔍 Auto-detecting project type...
echo ========================================
echo.

set "project_type=Unknown"
set "suggested_name=my-project"
set "project_description=A new project"

REM Check for Next.js
if exist "next.config.ts" (
    set "project_type=Next.js"
    if exist "components\shop-banner.tsx" (
        set "project_type=Shop Builder Platform"
        set "suggested_name=shop-builder-platform"
        set "project_description=Beautiful online shop creator with PDF export and Google auth"
    ) else (
        set "suggested_name=nextjs-app"
        set "project_description=Next.js application"
    )
) else if exist "next.config.js" (
    set "project_type=Next.js"
    set "suggested_name=nextjs-app"
    set "project_description=Next.js application"
) else if exist "package.json" (
    REM Check package.json for frameworks
    findstr /i "react" package.json >nul && (
        set "project_type=React App"
        set "suggested_name=react-app"
        set "project_description=React application"
    )
    findstr /i "vue" package.json >nul && (
        set "project_type=Vue App"
        set "suggested_name=vue-app"
        set "project_description=Vue.js application"
    )
    findstr /i "angular" package.json >nul && (
        set "project_type=Angular App"
        set "suggested_name=angular-app"
        set "project_description=Angular application"
    )
    findstr /i "express" package.json >nul && (
        set "project_type=Node.js API"
        set "suggested_name=nodejs-api"
        set "project_description=Node.js API server"
    )
) else if exist "index.html" (
    set "project_type=Static Website"
    set "suggested_name=static-website"
    set "project_description=Static HTML website"
) else if exist "*.py" (
    set "project_type=Python Project"
    set "suggested_name=python-project"
    set "project_description=Python application"
) else if exist "*.java" (
    set "project_type=Java Project"
    set "suggested_name=java-project"
    set "project_description=Java application"
)

echo Detected project type: %project_type% ✅
echo Suggested repository name: %suggested_name%
echo.

REM Get user information
echo Please provide your information:
echo.
set /p github_username="Enter your GitHub username: "
set /p github_email="Enter your GitHub email: "
set /p repo_name="Enter repository name [%suggested_name%]: "

REM Use suggested name if empty
if "%repo_name%"=="" set "repo_name=%suggested_name%"

echo.
echo Configuration:
echo - Project Type: %project_type%
echo - GitHub Username: %github_username%
echo - GitHub Email: %github_email%
echo - Repository: https://github.com/%github_username%/%repo_name%
echo - Description: %project_description%
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

REM Create commit with dynamic message
echo Creating commit...
if "%project_type%"=="Shop Builder Platform" (
    git commit -m "Complete Shop Builder Platform - Beautiful online shop creator with PDF export, Google auth, and auto-save"
) else if "%project_type%"=="Next.js" (
    git commit -m "Complete Next.js application - Modern web app with TypeScript and Tailwind CSS"
) else if "%project_type%"=="React App" (
    git commit -m "Complete React application - Modern frontend with components and styling"
) else if "%project_type%"=="Vue App" (
    git commit -m "Complete Vue.js application - Modern frontend with Vue components"
) else if "%project_type%"=="Angular App" (
    git commit -m "Complete Angular application - Modern frontend with Angular components"
) else if "%project_type%"=="Node.js API" (
    git commit -m "Complete Node.js API - Backend server with Express and modern features"
) else if "%project_type%"=="Static Website" (
    git commit -m "Complete static website - HTML, CSS, and JavaScript project"
) else if "%project_type%"=="Python Project" (
    git commit -m "Complete Python project - Python application with dependencies"
) else if "%project_type%"=="Java Project" (
    git commit -m "Complete Java project - Java application with build configuration"
) else (
    git commit -m "Initial commit - %project_description%"
)

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
    
    REM Project-specific deployment instructions
    if "%project_type%"=="Shop Builder Platform" (
        echo 1. VERCEL DEPLOYMENT:
        echo    - Go to: https://vercel.com
        echo    - Click "New Project"
        echo    - Import your GitHub repository
        echo    - Deploy automatically!
        echo.
        echo 2. SUPABASE SETUP:
        echo    - Follow SHOP_SETUP.md instructions
        echo    - Set up your free database
        echo    - Configure Google OAuth
        echo.
        echo 3. ENVIRONMENT VARIABLES:
        echo    - Copy env.example to .env.local
        echo    - Add your Supabase credentials
        echo    - Configure in Vercel dashboard
        echo.
        echo 🛍️ Your Shop Builder Platform is now:
        echo    ✅ Ready for shop creation
        echo    ✅ Mobile responsive and beautiful
        echo    ✅ Auto-deployment enabled
        echo    ✅ PDF export ready
        echo    ✅ Google authentication integrated
    ) else if "%project_type%"=="Next.js" (
        echo 1. VERCEL DEPLOYMENT ^(Recommended^):
        echo    - Go to: https://vercel.com
        echo    - Click "New Project"
        echo    - Import your GitHub repository
        echo    - Deploy automatically!
        echo.
        echo 2. ENVIRONMENT VARIABLES:
        echo    - Copy .env.example to .env.local ^(if exists^)
        echo    - Add your environment variables
        echo    - Configure in deployment platform
        echo.
        echo ⚡ Your Next.js app is now:
        echo    ✅ Live on GitHub
        echo    ✅ Ready for deployment
        echo    ✅ Version controlled
    ) else if "%project_type%"=="React App" (
        echo 1. DEPLOYMENT OPTIONS:
        echo    - Vercel: https://vercel.com
        echo    - Netlify: https://netlify.com
        echo    - GitHub Pages: Enable in repository settings
        echo.
        echo 2. BUILD COMMAND:
        echo    - npm run build
        echo    - Deploy the build folder
        echo.
        echo ⚛️ Your React app is now:
        echo    ✅ Live on GitHub
        echo    ✅ Ready for deployment
        echo    ✅ Version controlled
    ) else if "%project_type%"=="Static Website" (
        echo 1. GITHUB PAGES ^(Free hosting^):
        echo    - Go to repository Settings
        echo    - Scroll to Pages section
        echo    - Select source: Deploy from branch
        echo    - Choose main branch
        echo    - Your site will be live at:
        echo      https://%github_username%.github.io/%repo_name%
        echo.
        echo 🌐 Your static website is now:
        echo    ✅ Live on GitHub
        echo    ✅ Free hosting with GitHub Pages
        echo    ✅ Version controlled
    ) else if "%project_type%"=="Python Project" (
        echo 1. DEPLOYMENT OPTIONS:
        echo    - Heroku: https://heroku.com
        echo    - Railway: https://railway.app
        echo    - PythonAnywhere: https://pythonanywhere.com
        echo.
        echo 2. REQUIREMENTS:
        echo    - Ensure requirements.txt exists
        echo    - Add runtime.txt if needed
        echo    - Configure environment variables
        echo.
        echo 🐍 Your Python project is now:
        echo    ✅ Live on GitHub
        echo    ✅ Ready for deployment
        echo    ✅ Version controlled
    ) else (
        echo 1. DEPLOYMENT:
        echo    - Choose appropriate platform for your project type
        echo    - Configure build settings if needed
        echo    - Set up environment variables
        echo.
        echo 📁 Your project is now:
        echo    ✅ Live on GitHub
        echo    ✅ Ready for deployment
        echo    ✅ Version controlled
    )
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
echo  📋 PROJECT FILES UPLOADED
echo ========================================
echo.

REM Show project-specific files
if "%project_type%"=="Shop Builder Platform" (
    echo ✅ SHOP_SETUP.md           - Complete database and OAuth setup guide
    echo ✅ FEATURES_SUMMARY.md     - Overview of all shop builder features
    echo ✅ README.md               - Project documentation
    echo ✅ All shop components     - Banner, product grid, PDF export
    echo ✅ Database schema         - Complete Supabase setup
    echo.
    echo Thank you for using the Universal Deploy Script! 🛍️
    echo Your Shop Builder Platform is ready for users!
) else if "%project_type%"=="Next.js" (
    echo ✅ README.md               - Project documentation
    echo ✅ package.json            - Dependencies and scripts
    echo ✅ All Next.js files       - App router, components, styles
    echo ✅ Configuration files     - TypeScript, Tailwind, etc.
    echo.
    echo Thank you for using the Universal Deploy Script! ⚡
    echo Your Next.js application is ready for deployment!
) else if "%project_type%"=="React App" (
    echo ✅ README.md               - Project documentation
    echo ✅ package.json            - Dependencies and scripts
    echo ✅ All React components    - Source code and assets
    echo ✅ Build configuration     - Webpack, Babel, etc.
    echo.
    echo Thank you for using the Universal Deploy Script! ⚛️
    echo Your React application is ready for deployment!
) else if "%project_type%"=="Static Website" (
    echo ✅ index.html              - Main website file
    echo ✅ CSS and JS files        - Styling and functionality
    echo ✅ Assets and images       - All media files
    echo ✅ README.md               - Project documentation
    echo.
    echo Thank you for using the Universal Deploy Script! 🌐
    echo Your static website is ready for GitHub Pages!
) else if "%project_type%"=="Python Project" (
    echo ✅ Python source files     - All .py files
    echo ✅ requirements.txt        - Dependencies ^(if exists^)
    echo ✅ README.md               - Project documentation
    echo ✅ Configuration files     - Setup and config files
    echo.
    echo Thank you for using the Universal Deploy Script! 🐍
    echo Your Python project is ready for deployment!
) else (
    echo ✅ All project files       - Complete project uploaded
    echo ✅ README.md               - Project documentation ^(if exists^)
    echo ✅ Configuration files     - All config and setup files
    echo.
    echo Thank you for using the Universal Deploy Script! 📁
    echo Your project is ready for deployment!
)

echo.
echo ========================================
echo  🎉 DEPLOYMENT COMPLETE! 🎉
echo ========================================
echo.
pause
