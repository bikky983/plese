@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  🚀 Universal GitHub Deploy Script 🚀
echo ========================================
echo.
echo This script works with ANY project type!
echo It will auto-detect and deploy:
echo - Next.js / React / Vue / Angular apps
echo - Static HTML websites
echo - Python / Java / Node.js projects  
echo - Any other project type
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Git is not installed!
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

echo ✅ Git is installed!
echo.

REM Auto-detect project type and suggest names
echo ========================================
echo  🔍 Auto-detecting project type...
echo ========================================
echo.

set "project_type=Unknown"
set "suggested_name=my-project"
set "project_description=A new project"
set "deployment_platform=GitHub Pages"

REM Check for Next.js
if exist "next.config.ts" (
    set "project_type=Next.js (TypeScript)"
    set "deployment_platform=Vercel"
    if exist "components\shop-banner.tsx" (
        set "project_type=Shop Builder Platform"
        set "suggested_name=shop-builder-platform"
        set "project_description=Beautiful online shop creator with PDF export and Google auth"
    ) else (
        set "suggested_name=nextjs-app"
        set "project_description=Next.js application with TypeScript"
    )
) else if exist "next.config.js" (
    set "project_type=Next.js (JavaScript)"
    set "deployment_platform=Vercel"
    set "suggested_name=nextjs-app"
    set "project_description=Next.js application"
) else if exist "package.json" (
    REM Check package.json for specific frameworks
    findstr /i "\"next\"" package.json >nul && (
        set "project_type=Next.js App"
        set "deployment_platform=Vercel"
        set "suggested_name=nextjs-app"
        set "project_description=Next.js application"
    )
    findstr /i "\"react\"" package.json >nul && (
        if "!project_type!"=="Unknown" (
            set "project_type=React App"
            set "deployment_platform=Vercel/Netlify"
            set "suggested_name=react-app"
            set "project_description=React application"
        )
    )
    findstr /i "\"vue\"" package.json >nul && (
        set "project_type=Vue.js App"
        set "deployment_platform=Vercel/Netlify"
        set "suggested_name=vue-app"
        set "project_description=Vue.js application"
    )
    findstr /i "\"@angular\"" package.json >nul && (
        set "project_type=Angular App"
        set "deployment_platform=Vercel/Netlify"
        set "suggested_name=angular-app"
        set "project_description=Angular application"
    )
    findstr /i "\"express\"" package.json >nul && (
        set "project_type=Node.js API"
        set "deployment_platform=Railway/Heroku"
        set "suggested_name=nodejs-api"
        set "project_description=Node.js API server"
    )
    findstr /i "\"discord\"" package.json >nul && (
        set "project_type=Discord Bot"
        set "deployment_platform=Railway/Heroku"
        set "suggested_name=discord-bot"
        set "project_description=Discord bot application"
    )
) else if exist "index.html" (
    set "project_type=Static Website"
    set "deployment_platform=GitHub Pages"
    set "suggested_name=static-website"
    set "project_description=Static HTML website"
) else if exist "requirements.txt" (
    set "project_type=Python Project"
    set "deployment_platform=Railway/Heroku"
    set "suggested_name=python-project"
    set "project_description=Python application"
) else if exist "*.py" (
    set "project_type=Python Scripts"
    set "deployment_platform=GitHub"
    set "suggested_name=python-scripts"
    set "project_description=Python scripts and utilities"
) else if exist "pom.xml" (
    set "project_type=Java Maven Project"
    set "deployment_platform=Heroku"
    set "suggested_name=java-maven-app"
    set "project_description=Java application with Maven"
) else if exist "build.gradle" (
    set "project_type=Java Gradle Project"
    set "deployment_platform=Heroku"
    set "suggested_name=java-gradle-app"
    set "project_description=Java application with Gradle"
) else if exist "*.cs" (
    set "project_type=C# Project"
    set "deployment_platform=Azure"
    set "suggested_name=csharp-project"
    set "project_description=C# application"
) else if exist "*.php" (
    set "project_type=PHP Project"
    set "deployment_platform=Heroku"
    set "suggested_name=php-project"
    set "project_description=PHP web application"
) else if exist "Cargo.toml" (
    set "project_type=Rust Project"
    set "deployment_platform=Railway"
    set "suggested_name=rust-project"
    set "project_description=Rust application"
) else if exist "go.mod" (
    set "project_type=Go Project"
    set "deployment_platform=Railway/Heroku"
    set "suggested_name=go-project"
    set "project_description=Go application"
)

echo ✅ Detected: %project_type%
echo 💡 Suggested name: %suggested_name%
echo 🚀 Recommended platform: %deployment_platform%
echo.

REM Get user information
echo Please provide your GitHub information:
echo.
set /p github_username="Enter your GitHub username: "
set /p github_email="Enter your GitHub email: "
echo.
set /p repo_name="Repository name [%suggested_name%]: "

REM Use suggested name if empty
if "%repo_name%"=="" set "repo_name=%suggested_name%"

echo.
echo ========================================
echo  📋 Configuration Summary
echo ========================================
echo.
echo 🔍 Project Type: %project_type%
echo 👤 GitHub Username: %github_username%
echo 📧 GitHub Email: %github_email%
echo 📁 Repository: https://github.com/%github_username%/%repo_name%
echo 📝 Description: %project_description%
echo 🚀 Best Platform: %deployment_platform%
echo.
set /p confirm_info="Deploy with this configuration? (y/n): "
if /i not "%confirm_info%"=="y" (
    echo Deployment cancelled. Please restart the script.
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
echo ✅ Git configuration complete!

echo.
echo ========================================
echo  STEP 2: Preparing Repository
echo ========================================
echo.

REM Initialize repository if needed
if not exist ".git" (
    echo Initializing new Git repository...
    git init
    echo ✅ Repository initialized!
) else (
    echo ✅ Git repository already exists!
)

REM Create .gitignore if it doesn't exist
if not exist ".gitignore" (
    echo Creating .gitignore file...
    (
        echo # Dependencies
        echo node_modules/
        echo __pycache__/
        echo *.pyc
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.*.local
        echo.
        echo # Build outputs
        echo .next/
        echo /build
        echo /dist
        echo /out
        echo.
        echo # IDE files
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo *~
        echo.
        echo # OS files
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Logs
        echo *.log
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
    ) > .gitignore
    echo ✅ .gitignore created!
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
echo ✅ Remote repository configured!

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
    git pull origin main --allow-unrelated-histories --strategy=recursive -X ours >nul 2>&1
    if %errorlevel% neq 0 (
        echo Trying alternative sync method...
        git reset --soft HEAD~1 >nul 2>&1
    )
    echo ✅ Synced with existing repository!
) else (
    echo ✅ No existing content found. Ready for new repository!
)

echo.
echo ========================================
echo  STEP 5: Preparing Files
echo ========================================
echo.

echo Adding all project files...
git add .

echo.
echo 📊 Files to be uploaded:
git status --short | head -20
echo.

REM Count files
for /f %%i in ('git status --porcelain ^| find /c /v ""') do set file_count=%%i
echo 📁 Total files to upload: %file_count%

REM Show file types
echo.
echo 📋 File breakdown:
if "%project_type%"=="Shop Builder Platform" (
    echo    🛍️ Shop components and database schema
    echo    ⚛️ React/Next.js components
    echo    🎨 Styling and configuration files
) else if "%project_type%"=="Next.js" (
    echo    ⚡ Next.js pages and components
    echo    🎨 Styling and configuration files
    echo    📦 Dependencies and build files
) else if "%project_type%"=="React App" (
    echo    ⚛️ React components and pages
    echo    🎨 CSS and styling files
    echo    📦 Build configuration
) else if "%project_type%"=="Static Website" (
    echo    🌐 HTML, CSS, and JavaScript files
    echo    🖼️ Images and assets
    echo    📄 Documentation files
) else if "%project_type%"=="Python Project" (
    echo    🐍 Python source files
    echo    📦 Dependencies and requirements
    echo    📄 Documentation and config
) else (
    echo    📁 All project source files
    echo    ⚙️ Configuration files
    echo    📄 Documentation
)

echo.
if %file_count% equ 0 (
    echo ⚠️ No changes to upload. Repository is up to date!
    pause
    exit /b 0
)

set /p confirm_upload="🚀 Upload these %file_count% files to GitHub? (y/n): "
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

REM Create dynamic commit message
echo Creating commit...
if "%project_type%"=="Shop Builder Platform" (
    git commit -m "🛍️ Shop Builder Platform - Complete online shop creator with PDF export and Google auth"
) else if "%project_type%"=="Next.js" (
    git commit -m "⚡ Next.js Application - Modern web app with TypeScript and optimizations"
) else if "%project_type%"=="React App" (
    git commit -m "⚛️ React Application - Modern frontend with components and styling"
) else if "%project_type%"=="Vue.js App" (
    git commit -m "💚 Vue.js Application - Modern frontend with Vue components"
) else if "%project_type%"=="Angular App" (
    git commit -m "🅰️ Angular Application - Modern frontend with Angular components"
) else if "%project_type%"=="Node.js API" (
    git commit -m "🟢 Node.js API - Backend server with Express and modern features"
) else if "%project_type%"=="Discord Bot" (
    git commit -m "🤖 Discord Bot - Complete bot with commands and features"
) else if "%project_type%"=="Static Website" (
    git commit -m "🌐 Static Website - HTML, CSS, and JavaScript project"
) else if "%project_type%"=="Python Project" (
    git commit -m "🐍 Python Project - Python application with dependencies"
) else if "%project_type%"=="Java Maven Project" (
    git commit -m "☕ Java Maven Project - Java application with Maven build"
) else if "%project_type%"=="Java Gradle Project" (
    git commit -m "☕ Java Gradle Project - Java application with Gradle build"
) else if "%project_type%"=="C# Project" (
    git commit -m "💎 C# Project - .NET application"
) else if "%project_type%"=="PHP Project" (
    git commit -m "🐘 PHP Project - PHP web application"
) else if "%project_type%"=="Rust Project" (
    git commit -m "🦀 Rust Project - Rust application with Cargo"
) else if "%project_type%"=="Go Project" (
    git commit -m "🐹 Go Project - Go application with modules"
) else (
    git commit -m "📁 Project Upload - %project_description%"
)

echo ✅ Commit created!
echo.
echo 📤 Uploading to GitHub...
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
    echo ✅ Your %project_type% project is now on GitHub:
    echo    🔗 https://github.com/%github_username%/%repo_name%
    echo.
    echo ✅ Files uploaded: %file_count% files
    echo ✅ Commit message: Auto-generated for %project_type%
    echo.
    
    REM Project-specific deployment instructions
    echo 🚀 RECOMMENDED NEXT STEPS:
    echo.
    
    if "%project_type%"=="Shop Builder Platform" (
        echo 1. 🗄️ SUPABASE SETUP ^(Free Database^):
        echo    - Go to: https://supabase.com
        echo    - Create new project
        echo    - Follow SHOP_SETUP.md instructions
        echo    - Set up Google OAuth
        echo.
        echo 2. 🚀 VERCEL DEPLOYMENT ^(Free Hosting^):
        echo    - Go to: https://vercel.com
        echo    - Click "New Project"
        echo    - Import: %github_username%/%repo_name%
        echo    - Add environment variables
        echo    - Deploy automatically!
        echo.
        echo 🛍️ Your Shop Builder will have:
        echo    ✅ Beautiful shop creation
        echo    ✅ PDF catalog export
        echo    ✅ Google authentication
        echo    ✅ Auto-save functionality
        echo    ✅ Mobile responsive design
    ) else if "%deployment_platform%"=="Vercel" (
        echo 1. 🚀 VERCEL DEPLOYMENT ^(Recommended^):
        echo    - Go to: https://vercel.com
        echo    - Click "New Project"
        echo    - Import: %github_username%/%repo_name%
        echo    - Deploy automatically!
        echo.
        echo 2. 🔧 ALTERNATIVE PLATFORMS:
        echo    - Netlify: https://netlify.com
        echo    - Railway: https://railway.app
        echo.
        echo ⚡ Your %project_type% will be:
        echo    ✅ Live on the internet
        echo    ✅ Auto-deployed on every push
        echo    ✅ Fast and optimized
    ) else if "%deployment_platform%"=="GitHub Pages" (
        echo 1. 🌐 GITHUB PAGES ^(Free Hosting^):
        echo    - Go to your repository on GitHub
        echo    - Click Settings tab
        echo    - Scroll to Pages section
        echo    - Source: Deploy from branch
        echo    - Branch: main
        echo    - Your site will be live at:
        echo      https://%github_username%.github.io/%repo_name%
        echo.
        echo 🌐 Your %project_type% will be:
        echo    ✅ Live on the internet
        echo    ✅ Free hosting forever
        echo    ✅ Custom domain support
    ) else if "%deployment_platform%"=="Railway/Heroku" (
        echo 1. 🚂 RAILWAY DEPLOYMENT ^(Recommended^):
        echo    - Go to: https://railway.app
        echo    - Connect GitHub account
        echo    - Import: %github_username%/%repo_name%
        echo    - Deploy automatically!
        echo.
        echo 2. 🔧 ALTERNATIVE: HEROKU
        echo    - Go to: https://heroku.com
        echo    - Create new app
        echo    - Connect to GitHub repository
        echo.
        echo 🟢 Your %project_type% will be:
        echo    ✅ Live on the internet
        echo    ✅ Auto-deployed on every push
        echo    ✅ Scalable hosting
    ) else (
        echo 1. 🚀 DEPLOYMENT OPTIONS:
        echo    - Vercel: https://vercel.com ^(Frontend apps^)
        echo    - Netlify: https://netlify.com ^(Static sites^)
        echo    - Railway: https://railway.app ^(Backend apps^)
        echo    - GitHub Pages: Free for static sites
        echo.
        echo 📁 Your %project_type% is now:
        echo    ✅ Live on GitHub
        echo    ✅ Ready for deployment
        echo    ✅ Version controlled
    )
    
    echo.
    echo ========================================
    echo  📱 SHARING YOUR PROJECT
    echo ========================================
    echo.
    echo Share your repository:
    echo 🔗 GitHub: https://github.com/%github_username%/%repo_name%
    echo 📋 Clone command: git clone https://github.com/%github_username%/%repo_name%.git
    echo.
    
) else (
    echo.
    echo ========================================
    echo  ⚠️ Upload Issues - Trying Force Push
    echo ========================================
    echo.
    echo The normal push failed. This usually means:
    echo - Repository already exists with different content
    echo - There are conflicts with existing files
    echo.
    set /p force_push="🔄 Force push ^(overwrites GitHub with your local files^)? (y/n): "
    if /i "%force_push%"=="y" (
        echo.
        echo 💪 Force pushing to GitHub...
        git push origin main --force
        
        if %errorlevel% equ 0 (
            echo.
            echo ✅ Force push successful! Your project is now on GitHub.
            echo    🔗 https://github.com/%github_username%/%repo_name%
            echo.
            echo ⚠️ Note: Force push overwrote any existing content.
        ) else (
            echo.
            echo ❌ Force push also failed. Please check:
            echo    1. Repository exists on GitHub
            echo    2. You have write access to the repository
            echo    3. Repository name is spelled correctly
            echo    4. Internet connection is working
            echo    5. GitHub authentication is set up
            echo.
            echo 💡 Try creating the repository manually on GitHub first:
            echo    - Go to https://github.com/new
            echo    - Create repository: %repo_name%
            echo    - Don't initialize with README
            echo    - Run this script again
        )
    ) else (
        echo Upload cancelled. You can resolve conflicts manually or try again.
    )
)

echo.
echo ========================================
echo  📋 WHAT WAS UPLOADED
echo ========================================
echo.

REM Show project-specific files that were uploaded
if "%project_type%"=="Shop Builder Platform" (
    echo ✅ Complete Shop Builder Platform:
    echo    🛍️ Shop creation wizard
    echo    🖼️ Banner and product components  
    echo    📄 PDF export functionality
    echo    🔐 Google authentication setup
    echo    🗄️ Database schema and helpers
    echo    📱 Mobile-responsive design
    echo    📚 Setup guides and documentation
) else if "%project_type%"=="Next.js" (
    echo ✅ Complete Next.js Application:
    echo    ⚡ App router and pages
    echo    🎨 Components and styling
    echo    ⚙️ Configuration files
    echo    📦 Dependencies and scripts
    echo    📚 Documentation
) else if "%project_type%"=="React App" (
    echo ✅ Complete React Application:
    echo    ⚛️ React components
    echo    🎨 Styling and assets
    echo    📦 Build configuration
    echo    📚 Documentation
) else if "%project_type%"=="Static Website" (
    echo ✅ Complete Static Website:
    echo    🌐 HTML pages
    echo    🎨 CSS styling
    echo    💻 JavaScript functionality
    echo    🖼️ Images and assets
) else if "%project_type%"=="Python Project" (
    echo ✅ Complete Python Project:
    echo    🐍 Python source files
    echo    📦 Requirements and dependencies
    echo    ⚙️ Configuration files
    echo    📚 Documentation
) else (
    echo ✅ Complete %project_type%:
    echo    📁 All source files
    echo    ⚙️ Configuration files
    echo    📚 Documentation ^(if available^)
)

echo.
echo ========================================
echo  🎊 DEPLOYMENT COMPLETE! 🎊
echo ========================================
echo.
echo Your %project_type% is now:
echo ✅ Safely stored on GitHub
echo ✅ Version controlled
echo ✅ Ready to share with the world
echo ✅ Ready for deployment on %deployment_platform%
echo.
echo 💡 This script works with ANY project type!
echo    Copy it to any folder and run it to deploy to GitHub.
echo.
echo Thank you for using the Universal GitHub Deploy Script! 🚀
echo.
pause
