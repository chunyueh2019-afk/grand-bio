# Grand.Bio 廣聯生技 - 產品電子型錄

這是一個基於 Angular 18 建立的產品電子型錄 Web App，專為醫藥代理商設計。

## 功能特點
- **產品分類瀏覽**：包含醫藥服務、保健食品、醫療器材與一般產品。
- **即時通知系統**：內建通知面板，提示最新目錄更新。
- **管理後台**：支援產品資訊編輯、產地設定與 PDF DM 路徑配置。
- **分享清單**：使用者可將感興趣的產品加入清單以便後續分享。
- **Supabase 整合**：雲端資料庫同步，確保數據即時性。

## 開始使用
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 設定環境變數：
   將 `src/environments/environment.sample.ts` 複製並命名為 `environment.ts`，填入您的 Supabase URL 與 Key。
3. 執行開發分伺服器：
   ```bash
   npm run dev
   ```

## 技術棧
- Frontend: Angular 18 (Signals, Standalone Components)
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Styling: Tailwind CSS
- Icons: Material Symbols Rounded
