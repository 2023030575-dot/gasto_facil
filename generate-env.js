const fs = require('fs');
const path = require('path');

const env = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY
};

// ❌ NO dentro de src
const outputPath = path.join(__dirname, 'dist/env.json');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, JSON.stringify(env, null, 2));

console.log('env.json generado en dist');