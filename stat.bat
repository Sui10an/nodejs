@echo off
REM すべてのChromeウィンドウを閉じる
taskkill /F /IM chrome.exe

REM すべてのNode.jsサーバーを停止する
taskkill /F /IM node.exe

start chrome.exe --start-fullscreen https://localhost:5173

REM サーバーを起動
cmd /k "npm run start" &