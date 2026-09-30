"""Generate the film's ambient score (audio.wav) from the scene timeline.

Usage: python3 soundtrack.py '<timeline json from render.mjs>' <total_seconds>
Warm additive pad that moves chord per scene, a soft pulse once the map opens,
and a glass "chime" on every scene boundary. Deterministic; no samples.
"""
import json, sys, wave
import numpy as np

SR = 48000
timeline = json.loads(sys.argv[1])
total = float(sys.argv[2])
n = int(total * SR)
t = np.arange(n) / SR
out = np.zeros((n, 2))

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

# chord per scene (MIDI notes), D-major colour with suspended voicings
CHORDS = [
    [50, 57, 62, 64, 69],      # Dsus2      open
    [50, 57, 62, 66, 69, 76],  # Dadd9      map
    [47, 54, 59, 62, 66, 73],  # Bm9        ios
    [43, 50, 57, 59, 66, 71],  # Gmaj9      chrome
    [45, 52, 57, 61, 64, 71],  # A6/9       web
    [50, 57, 62, 66, 69, 76],  # Dadd9      creator
    [47, 54, 59, 62, 66, 73],  # Bm9        agent
    [43, 50, 55, 59, 62, 69],  # Gmaj7      economy
    [50, 57, 62, 64, 69, 74],  # Dsus2      finale
]
rng = np.random.default_rng(7)

def envelope(start, end, a=2.5, r=3.0):
    e = np.zeros(n)
    i0, i1 = int(max(start, 0) * SR), int(min(end + r, total) * SR)
    seg = t[i0:i1] - start
    e[i0:i1] = np.clip(seg / a, 0, 1) * np.clip((end + r - t[i0:i1]) / r, 0, 1)
    return e ** 1.5

for k, sc in enumerate(timeline):
    chord = CHORDS[k % len(CHORDS)]
    s, e = sc['start'], sc['start'] + sc['dur']
    env = envelope(s - 0.6, e)
    i0, i1 = int(max(s - 0.6, 0) * SR), int(min(e + 3, total) * SR)
    tt = t[i0:i1]
    for j, m in enumerate(chord):
        f = midi(m)
        for det, pan in ((-0.07, 0.25), (0.07, 0.75)):   # slight chorus, stereo spread
            ff = f * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            wave_ = sum((0.55 ** h) * np.sin(2 * np.pi * ff * (h + 1) * tt + ph * (h + 1)) for h in range(4))
            trem = 1 + 0.12 * np.sin(2 * np.pi * (0.11 + 0.03 * j) * tt)
            amp = (0.05 if m < 52 else 0.032) * trem
            sig = wave_ * amp * env[i0:i1]
            out[i0:i1, 0] += sig * (1 - pan)
            out[i0:i1, 1] += sig * pan

# soft pulse (low thump) at 84 bpm between map start and finale end-card
bpm = 84; beat = 60 / bpm
p_start = timeline[1]['start'] if len(timeline) > 1 else 8
p_end = timeline[-1]['start'] + 4
x = p_start
while x < p_end:
    i0 = int(x * SR); L = int(0.5 * SR)
    if i0 + L < n:
        tt = np.arange(L) / SR
        f = 55 * (1 + 1.2 * np.exp(-tt * 30))
        thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.10
        fade = min(1, (x - p_start) / 6) * min(1, (p_end - x) / 3)
        out[i0:i0 + L] += (thump * fade)[:, None]
    x += beat * 2

# glass chime at each scene boundary
for k, sc in enumerate(timeline):
    s = sc['start'] + (0.2 if k else 0.8)
    i0 = int(s * SR); L = int(3.5 * SR)
    if i0 + L >= n: continue
    tt = np.arange(L) / SR
    root = midi([81, 86, 83, 79, 81, 86, 83, 79, 86][k % 9])
    bell = (np.sin(2 * np.pi * root * tt) + .35 * np.sin(2 * np.pi * root * 2.76 * tt) * np.exp(-tt * 3)
            + .2 * np.sin(2 * np.pi * root * 5.4 * tt) * np.exp(-tt * 6)) * np.exp(-tt * 1.4) * 0.045
    pan = 0.35 + 0.3 * (k % 2)
    out[i0:i0 + L, 0] += bell * (1 - pan)
    out[i0:i0 + L, 1] += bell * pan

# simple stereo echo for air
d = int(0.34 * SR)
wet = np.zeros_like(out); wet[d:] += out[:-d] * 0.28; wet[2 * d:] += out[:-2 * d] * 0.12
out = out + wet[:, ::-1]

# master fades + normalize to -3 dBFS peak with gentle soft clip
fade_in = np.clip(t / 1.5, 0, 1); fade_out = np.clip((total - t) / 2.5, 0, 1)
out *= (fade_in * fade_out)[:, None]
out = np.tanh(out * 1.2)
out *= 0.707 / max(1e-9, np.abs(out).max())
pcm = (out * 32767).astype('<i2')
with wave.open('audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote audio.wav', round(total, 1), 's')
