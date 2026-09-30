// Render vertical.html (1080x1920, transparent window) to a PNG-in-MOV overlay with alpha.
import { createRequire } from 'node:module';
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const out = process.argv[2] || 'frames/overlay.mov', fps = 30;
const ffmpeg = execSync(`python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"`).toString().trim();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.resolve('vertical.html'));
await p.waitForFunction(() => window.__ready === true);
const T = await p.evaluate(() => window.__duration);
const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'png', '-pix_fmt', 'rgba', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < T * fps; i++) {
  await p.evaluate(t => window.__seek(t), i / fps);
  const buf = await p.screenshot({ type: 'png', omitBackground: true });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
