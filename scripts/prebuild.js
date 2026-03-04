const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');
const envFile = path.join(envDir, 'environment.ts');

// 確保目錄存在
if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
}

// 優先從環境變數讀取，若無則使用範本
const supabaseUrl = process.env.SUPABASE_URL || 'https://您的項目ID.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '您的匿名公開金鑰 (Anon Key)';

const content = `export const environment = {
    production: true,
    supabaseUrl: '${supabaseUrl}',
    supabaseKey: '${supabaseKey}'
};
`;

fs.writeFileSync(envFile, content);
console.log('Successfully generated environment.ts');
