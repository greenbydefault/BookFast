import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const embedPath = resolve(root, 'public/embed.js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required env vars for embed.js injection: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

const content = await readFile(embedPath, 'utf8');

const next = content
  .replace(/const API = '.*?';/, `const API = '${supabaseUrl}';`)
  .replace(/const KEY = '.*?';/, `const KEY = '${supabaseAnonKey}';`);

await writeFile(embedPath, next, 'utf8');
console.log('Injected Supabase env vars into public/embed.js');
