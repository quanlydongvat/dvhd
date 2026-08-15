@echo off
title UNG DUNG QUAN LY DONG VAT HOANG DA - HOAT DONG LOCALHOST
color 0A
cls
echo ======================================================================
echo          UNG DUNG QUAN LY DONG VAT HOANG DA (TT85) - KRONG BONG
echo ======================================================================
echo.
echo [1] Dang khoi chay May chu Localhost (Vite Dev Server)...
echo [2] Trinh duyet web se tu dong mo tai dia chi:
echo     http://localhost:5173/dvhd/
echo.
echo ----------------------------------------------------------------------
echo  LUU Y: Vui long GIU CUA SO NAY MO trong suốt qua trinh su dung Localhost!
echo ----------------------------------------------------------------------
echo.

start http://localhost:5173/dvhd/
npx vite --host
pause
