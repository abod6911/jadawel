@echo off
chcp 65001 > nul
echo ========================================================
echo   جداول | JADAWEL — رفع المشروع إلى GitHub
echo ========================================================
echo.
echo جاري رفع التغييرات إلى المستودع: https://github.com/abed6911/jadawel.git
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   تم الرفع بنجاح إلى حسابك على GitHub!
    echo   https://github.com/abed6911/jadawel
    echo ========================================================
) else (
    echo ========================================================
    echo   تأكد من إنشاء المستودع jadawel على حسابك:
    echo   https://github.com/new
    echo ========================================================
)
pause
