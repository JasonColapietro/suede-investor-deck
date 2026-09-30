// Deterministic frame renderer: loads film.html, seeks each frame via window.__seek(t), pipes PNGs to ffmpeg.
// Usage: node render.mjs [out.mp4] [--fps 30] [--from s] [--to s] [--stills t1,t2,...]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = args[0] && !args[0].startsWith('--') ? args[0] : 'suede-ecosystem.mp4';
const fps = +opt('--fps', 30);
const stills = opt('--stills', null);
const ffmpeg = process.env.FFMPEG || execSync(`python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"`).toString().trim();
const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => m.type() === 'error' && console.error('console:', m.text()));
await page.goto('file://' + path.resolve('film.html'));
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
const duration = await page.evaluate(() => window.__duration);
const sceneId = opt('--scene', null);
const scenes = await page.evaluate(() => window.__scenes);
console.log('timeline', JSON.stringify(scenes), 'total', duration.toFixed(1));
if (stills) {
  const dir = opt('--outdir', 'frames');
  fs.mkdirSync(dir, { recursive: true });
  const off = sceneId ? scenes.find(s => s.id === sceneId).start : 0;
  for (const t of stills.split(',').map(Number)) {
    // --scene: local film time within that scene; otherwise output time
    await page.evaluate(([t, f]) => f ? window.__seekFilm(t) : window.__seek(t), [off + t, !!sceneId]);
    const f = `${dir}/${sceneId ? sceneId + '_' : ''}t${t.toFixed(1).padStart(5, '0')}.png`;
    await page.screenshot({ path: f });
    console.log('still', f);
  }
  await browser.close(); process.exit(0);
}
const from = +opt('--from', 0), to = Math.min(+opt('--to', duration), duration);
const n = Math.round((to - from) * fps);
const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  ...(fs.existsSync('audio.wav') && !args.includes('--noaudio') ? ['-i', 'audio.wav', '-shortest', '-c:a', 'aac', '-b:a', '192k'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.__seek(t), from + i / fps);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % (fps * 5) === 0) console.log(`frame ${i}/${n}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out, 'duration', (to - from).toFixed(1), 's');
