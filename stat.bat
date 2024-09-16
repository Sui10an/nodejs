@echo off
REM すべてのChromeウィンドウを閉じる
taskkill /F /IM chrome.exe

REM すべてのNode.jsサーバーを停止する
taskkill /F /IM node.exe

REM サーバーを起動
cmd /k "npm run start" &

REM 少し待機してからブラウザを開く
timeout /t 4 /nobreak >nul

REM Chromeを新しいウィンドウで開く
start chrome --new-window http://localhost:5173