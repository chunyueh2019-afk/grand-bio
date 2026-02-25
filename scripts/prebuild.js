const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const dirPath = path.dirname(targetPath);

// Ensure directory exists
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// Default content (using process.env for CI/CD)
const envConfig = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL || ''}',
  supabaseKey: '${process.env.SUPABASE_KEY || ''}'
};
`;

console.log('Generating environment.ts...');
fs.writeFileSync(targetPath, envConfig);
console.log('environment.ts generated successfully.');
