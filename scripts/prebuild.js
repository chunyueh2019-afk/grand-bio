const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');
const envFile = path.join(envDir, 'environment.ts');

// 確保目錄存在
if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
}

// 優先從環境變數讀取；沒有設定時使用目前專案的公開連線資訊。
const supabaseUrl = process.env.SUPABASE_URL || 'https://ijrfdbzmmzvnkgtzdwdm.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_kl17XsOGcZnq2Y7E6DBisQ_JIA33aEL';

const content = `export const environment = {
    production: true,
    supabaseUrl: ${JSON.stringify(supabaseUrl)},
    supabaseKey: ${JSON.stringify(supabaseKey)}
};
`;

fs.writeFileSync(envFile, content);
console.log('Successfully generated environment.ts');
