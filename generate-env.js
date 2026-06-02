const fs = require('fs');

const env = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY
};

fs.writeFileSync(
  './src/assets/env.json',
  JSON.stringify(env, null, 2)
);

console.log('env.json generado');