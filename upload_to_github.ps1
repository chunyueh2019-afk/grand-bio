# GitHub 自動上傳腳本 (修復與診斷版)
Set-Location $PSScriptRoot

$RepoUrl = "https://github.com/chunyueh2019-afk/grand-bio.git"

Write-Host "--- 正在啟動 GitHub 上傳診斷 ---" -ForegroundColor Cyan

# 1. 檢查 Git 是否安裝
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 錯誤：找不到 Git 指令。" -ForegroundColor Red
    Write-Host "原因：您的電腦可能尚未安裝 Git，或未將其加入環境變數路徑。"
    Write-Host "解決：請前往 https://git-scm.com/ 下載並安裝，安裝後請重新啟動電腦或 IDE。"
    pause
    exit
}

# 2. 測試 SSH 連線 (針對 git@github.com URL)
if ($RepoUrl.StartsWith("git@")) {
    Write-Host "`n🔍 正在測試 GitHub SSH 連線權限..."
    $sshTest = ssh -T git@github.com 2>&1
    if ($sshTest -match "successfully authenticated") {
        Write-Host "✅ SSH 權限驗證通過！" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ SSH 權限可能有問題。" -ForegroundColor Yellow
        Write-Host "如果稍後推送失敗，請改用 HTTPS 網址或確認您的 SSH Key 是否已加入 GitHub。"
    }
}

Write-Host "`n🚀 準備開始上傳流程..."

# 3. 初始化並提交
if (!(Test-Path .git)) {
    Write-Host "-> 初始化本地儲存庫..."
    git init
}

Write-Host "-> 加入檔案..."
git add .

Write-Host "-> 建立提交點..."
git commit -m "Initial commit from reconstructed project"

# 4. 設定遠端並推送
Write-Host "-> 設定遠端 URL: $RepoUrl"
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "`n⬆️ 正在將程式碼推送到 GitHub (main 分支)..."
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 [成功] 程式碼已成功送到 GitHub！" -ForegroundColor Green
    Write-Host "現在您可以回到部署平台（如 Vercel）點擊 'Retry' 或重新部署了。"
}
else {
    Write-Host "`n❌ [失敗] 推送過程發生錯誤。" -ForegroundColor Red
    Write-Host "請將上方的提示文字複製並傳送給我，我將幫您分析原因。"
}

pause
