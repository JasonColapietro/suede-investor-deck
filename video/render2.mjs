// Production renderer: parallel workers, motion blur, film grade, score.
//   node render2.mjs [out.mp4] [--fps 30] [--shutter 2] [--workers 4] [--from s] [--to s] [--nograde] [--noaudio]
// Each worker renders a contiguous frame range. For motion blur it samples `shutter`
// sub-frames spread over half a frame interval (a 180° shutter) and averages them.
import { createRequire } from 'node:module';
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const has = k => args.includes(k);
const fps = +opt('--fps', 30), S = +opt('--shutter', 2), W = +opt('--workers', 4);
const ffmpeg = process.env.FFMPEG || execSync(`python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"`).toString().trim();
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const tmp = path.resolve('frames/segs'); fs.mkdirSync(tmp, { recursive: true });

async function openFilm() {
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto('file://' + path.resolve('film.html'));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  return { browser, page };
}

if (has('--worker')) {
  // worker: render frames [a, b) to a segment
  const a = +opt('--a'), b = +opt('--b'), seg = opt('--seg');
  const { browser, page } = await openFilm();
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(fps * S), '-i', '-',
    '-vf', S > 1 ? `tmix=frames=${S},select='eq(mod(n\\,${S})\\,${S - 1})',setpts=N/${fps}/TB` : 'null',
    '-r', String(fps), '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-pix_fmt', 'yuv444p', seg],
    { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let i = a; i < b; i++) {
    for (let j = 0; j < S; j++) {
      await page.evaluate(t => window.__seek(t), (i + (S > 1 ? j / S * .5 : 0)) / fps);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    if ((i - a) % 150 === 0) console.log(`[${path.basename(seg)}] ${i - a}/${b - a}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  process.exit(0);
}

// master
const out = args[0] && !args[0].startsWith('--') ? args[0] : 'suede-ecosystem.mp4';
const { browser, page } = await openFilm();
const duration = await page.evaluate(() => window.__duration);
const scenes = await page.evaluate(() => window.__scenes);
await browser.close();
console.log('duration', duration, 'cuts', scenes.map(s => `${s.id}@${s.out}`).join(' '));
const f0 = Math.round(+opt('--from', 0) * fps), f1 = Math.round(Math.min(+opt('--to', duration), duration) * fps);
const per = Math.ceil((f1 - f0) / W);
const segs = [];
await Promise.all([...Array(W)].map((_, k) => {
  const a = f0 + k * per, b = Math.min(f1, a + per); if (a >= b) return;
  const seg = path.join(tmp, `seg${k}.mp4`); segs[k] = seg;
  return new Promise((res, rej) => {
    const p = spawn(process.execPath, [process.argv[1], '--worker', '--a', a, '--b', b, '--seg', seg, '--fps', fps, '--shutter', S].map(String), { stdio: 'inherit' });
    p.on('close', c => c === 0 ? res() : rej(new Error('worker ' + k + ' failed')));
  });
}));
const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
// film grade: soft bloom on highlights, gentle contrast, vignette, fine temporal grain
const grade = has('--nograde') ? 'format=yuv420p' :
  "format=gbrp,split[a][b];[b]colorlevels=rimin=0.5:gimin=0.5:bimin=0.5,gblur=sigma=26[g];" +
  "[a][g]blend=all_mode=screen:all_opacity=0.30,eq=contrast=1.04:saturation=1.08:gamma=1.0," +
  "vignette=a=0.30,noise=alls=2:allf=t,format=yuv420p";
const audio = fs.existsSync('score.wav') && !has('--noaudio');
const offset = +opt('--from', 0);
execSync([ffmpeg, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
  ...(audio ? ['-ss', String(offset), '-i', 'score.wav'] : []),
  '-filter_complex', `[0:v]${grade}[v]`, '-map', '[v]', ...(audio ? ['-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-shortest'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-maxrate', '8M', '-bufsize', '16M', '-tune', 'film', '-movflags', '+faststart', out].map(a => `"${a}"`).join(' '), { stdio: 'inherit' });
console.log('wrote', out);
