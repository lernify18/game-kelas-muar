// Projek JS biasa tanpa TypeScript: semak sintaks setiap fail src/ dan tools/ dengan node --check.
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const files = ['src', 'tools'].flatMap((d) => readdirSync(d).filter((f) => /\.(m?js)$/.test(f)).map((f) => `${d}/${f}`));
let bad = 0;
for (const f of files) { try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); } catch (e) { bad++; console.error(f, e.stderr.toString()); } }
console.log(`semak sintaks: ${files.length - bad}/${files.length} lulus`);
process.exit(bad ? 1 : 0);
