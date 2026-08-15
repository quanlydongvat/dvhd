@echo off
title CHUONG TRINH SAO LUU DU LIEU DONG VAT HOANG DA THOIGIAN THUC
color 0E
cls
echo ======================================================================
echo          CHUONG TRINH SAO LUU DU LIEU TU DONG - FIREBASE TO LOCAL
echo ======================================================================
echo.
echo Dang ket noi Firebase Cloud de tai du lieu moi nhat ve may tinh...
echo.

node scratch/fetch_and_backup.js
node scratch/fetch_and_backup_excel.js

echo.
echo ----------------------------------------------------------------------
echo  HOAN TAT! Tat ca file Sao luu (.JSON & .XLSX Excel) da duoc luu tai:
echo  D:\DA_DVHD\quanlydongvat\backups\
echo ----------------------------------------------------------------------
echo.
pause
