import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

// dotenv only loads .env if imported/configured properly. Since we run from the project root:
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key");
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name).join('\n'));
  } catch (e) {
    console.error(e);
  }
}

run();
