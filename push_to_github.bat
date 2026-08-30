@echo off
chcp 65001 > nul
echo ========================================================
echo   جداول | JADAWEL — تحديث ونشر الموقع على GitHub Pages
echo ========================================================
echo.
echo 1. جاري رفع التغييرات البرمجية إلى الفرع الرئيسي (main)...
git add -A
git commit -m "update: latest site updates" 2>nul
git push origin main
echo.
echo 2. جاري بناء النسخة التصديرية وتحديث الرابط المباشر (gh-pages)...
call npm run build
cd out
git init >nul 2>&1
git config user.name "abod6911"
git config user.email "abod6911@users.noreply.github.com"
git add -A
git commit -m "deploy: static export to gh-pages" >nul 2>&1
git branch -M gh-pages >nul 2>&1
git remote add origin https://github.com/abod6911/jadawel.git >nul 2>&1
git push -f origin gh-pages
cd ..
echo.
echo ========================================================
echo   تم التحديث والنشر المباشر بنجاح!
echo   رابط الموقع المباشر: https://abod6911.github.io/jadawel/
echo   رابط الكود المصدري: https://github.com/abod6911/jadawel
echo ========================================================
pause
