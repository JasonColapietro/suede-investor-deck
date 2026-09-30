"""Produced score for the Suede ecosystem film -> score.wav

120 BPM, D minor (Dm - Bb - F - C), arranged to the film's bar-locked cuts:
  0-6   intro: supersaw pad swell, filtered pluck arp, riser into the drop
  6     DROP (map): boom, sub drop, kick/bass/arp in
  14    iOS: claps + hats join
  26/36/46/56/68  scene cuts: whooshes timed to the light sweep
  56-68 agent flow: 16th hats, octave bass, brighter arp
  68-76 economy: build, snare roll 74-76, big riser
  76    FINALE: impact, full band
  82    end card: final boom, band stops, pad + bells ring out to 88
Deterministic: no samples, numpy/scipy synthesis, mastered to about -14 LUFS.
"""
import wave
import numpy as np
from scipy import signal
import pyloudnorm as pyln

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
TOTAL = 88.0
N = int(TOTAL * SR)
rng = np.random.default_rng(20260930)

CUTS = [26, 36, 46, 56, 68]           # zoom/sweep cuts (whooshes)
DROP, FINALE, ENDCARD = 6.0, 76.0, 82.0

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def zeros(): return np.zeros((N, 2))
def tt(d): return np.arange(int(d * SR)) / SR
def sos(kind, f, order=2): return signal.butter(order, f, btype=kind, fs=SR, output='sos')
def filt(x, kind, f, order=2): return signal.sosfilt(sos(kind, f, order), x, axis=0)

def add(buf, t0, sig, pan=0.0, gain=1.0):
    """mix mono or stereo sig into buf at time t0 with constant-power pan (-1..1)."""
    i0 = int(round(t0 * SR))
    if i0 >= N: return
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], 1) * np.sqrt(2)
    j0 = max(0, -i0); i0 = max(0, i0)
    L = min(len(sig) - j0, N - i0)
    if L > 0: buf[i0:i0 + L] += sig[j0:j0 + L] * gain

def auto(points):
    """piecewise-linear automation curve over the whole film."""
    x, y = zip(*points)
    return np.interp(np.arange(N) / SR, x, y)

def saw(f, t, ph=0.0): return 2 * ((f * t + ph) % 1.0) - 1

# ---------------------------------------------------------------- harmony
PROG = [  # (chord tones for pad/arp, bass root)
    ([50, 53, 57, 64], 38),   # Dm(add9)
    ([46, 50, 53, 60], 34),   # Bbmaj(add9)
    ([53, 57, 60, 67], 41),   # F(add9)
    ([48, 52, 55, 62], 36),   # C(add9)
]
NBARS = int(np.ceil(TOTAL / BAR))
def chord_at(bar): return PROG[bar % 4]

# ---------------------------------------------------------------- instruments
def kick(big=False):
    d = 1.4 if big else .42
    t = tt(d)
    f = 42 + (140 if big else 115) * np.exp(-t * (18 if big else 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (2.2 if big else 7.5))
    click = filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t * 380) * .35
    return np.tanh((filt(body, 'highpass', 38, 1) + click * 1.4) * 1.6) * .82

def clap():
    t = tt(.35); n = rng.standard_normal(len(t))
    env = np.zeros_like(t)
    for k, o in enumerate((0, .011, .022)):
        env += (t >= o) * np.exp(-np.clip(t - o, 0, None) * (140 if k < 2 else 16))
    return filt(n * env, 'bandpass', [900, 4200]) * .8

def hat(open_=False):
    t = tt(.4 if open_ else .07)
    return filt(rng.standard_normal(len(t)), 'highpass', 7500) * np.exp(-t * (9 if open_ else 70)) * (.32 if open_ else .38)

def snare(v=1.0):
    t = tt(.25)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 30) * .5
    nz = filt(rng.standard_normal(len(t)), 'bandpass', [300, 7000]) * np.exp(-t * 22)
    return (tone + nz) * .55 * v

def pluck(m, d=.42, bright=1.0):
    t = tt(d); f = midi(m); x = np.zeros_like(t)
    for h in range(1, 10):
        if f * h > 16000: break
        x += np.sin(2 * np.pi * f * h * t + h) / h ** 1.1 * np.exp(-t * (5 + h * 4.5 / bright))
    return x * np.minimum(1, t / .003) * .28

def bass_note(m, d, octave_up=0.0):
    t = tt(d); f = midi(m)
    x = .75 * saw(f, t) + .5 * np.sin(2 * np.pi * f / 2 * t) + octave_up * .35 * saw(2 * f, t, .3)
    env = np.minimum(1, t / .006) * np.exp(-t * 2.2) * np.minimum(1, (d - t) / .02)
    return filt(x * env, 'lowpass', 900, 4) * .45

def pad_chord(tones, d, cutoff):
    t = tt(d); L = np.zeros_like(t); R = np.zeros_like(t)
    for m in tones:
        for k, det in enumerate((-.13, -.06, 0, .06, .13)):
            f = midi(m) * 2 ** (det / 12); v = saw(f, t, rng.random())
            L += v * (1.1 - k * .2); R += v * (.3 + k * .2)
    env = np.minimum(1, t / .35) * np.minimum(1, (d - t) / .45)
    st = np.stack([L, R], 1) * env[:, None] * .045
    return filt(st, 'lowpass', cutoff, 2)

def riser(d, top=9000):
    t = tt(d); p = t / d
    nz = rng.standard_normal((len(t), 2))
    out = np.zeros_like(nz)
    bands = np.geomspace(300, top, 9)
    for k, fc in enumerate(bands):
        b = filt(nz, 'bandpass', [fc / 1.4, min(fc * 1.4, 23000)])
        center = k / (len(bands) - 1)
        out += b * np.exp(-((p - center) ** 2) / .05)[:, None] * (p ** 1.5)[:, None]
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2.5 * p)) / SR) * p ** 3 * .25
    return (out * .5 + tone[:, None]) * .8

def whoosh(d=1.3, peak=.45):
    t = tt(d); p = t / d
    nz = rng.standard_normal((len(t), 2)); out = np.zeros_like(nz)
    for k, fc in enumerate(np.geomspace(6000, 400, 7)):
        c = k / 6
        out += filt(nz, 'bandpass', [fc / 1.5, fc * 1.5]) * np.exp(-((p - peak - c * .35) ** 2) / .02)[:, None]
    env = np.minimum(1, p / peak) ** 2 * np.exp(-np.clip(p - peak, 0, None) * 3)
    return out * env[:, None] * .5

def impact(scale=1.0):
    t = tt(4.0)
    f = 30 + 55 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.1)
    rumble = filt(rng.standard_normal(len(t)), 'lowpass', 260) * np.exp(-t * 2.5) * .8
    crack = filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t * 18) * .35
    return np.tanh((boom + rumble + crack) * 1.4) * scale

def bell(m, d=5.0):
    t = tt(d); f = midi(m); x = np.zeros_like(t)
    for r, a, dec in ((1, 1, 1.1), (2.76, .45, 2.2), (5.4, .25, 3.8), (8.93, .12, 6)):
        x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dec)
    return x * np.minimum(1, t / .002) * .16

# ---------------------------------------------------------------- arrangement
drums, bass, music, fx, verb_send = zeros(), zeros(), zeros(), zeros(), zeros()
kicks = []

for b in range(NBARS):
    t0 = b * BAR
    tones, root = chord_at(b)
    # pad (whole film; brighter in the finale)
    cut = 5200 if t0 >= FINALE else 2600 if t0 >= DROP else 1400
    if t0 < ENDCARD + 4:
        p = pad_chord(tones, BAR + .5, cut)
        add(music, t0, p); add(verb_send, t0, p, gain=.6)

    for s16 in range(16):
        t = t0 + s16 * BEAT / 4
        beat_on = s16 % 4 == 0
        drums_on = DROP <= t < 74 or FINALE <= t < ENDCARD
        # kick 4 on the floor
        if drums_on and beat_on:
            add(drums, t, kick()); kicks.append(t)
        # claps on 2 & 4
        if drums_on and t >= 14 and s16 in (4, 12):
            c = clap(); add(drums, t, c, .08); add(verb_send, t, c, .08, .35)
        # hats: 8ths from 14, 16ths in agent + finale; open hat on the "and"
        if drums_on and t >= 14:
            dense = 56 <= t < 68 or t >= FINALE
            if s16 % 2 == 0 or dense:
                add(drums, t, hat(), .35 if s16 % 4 else -.25, 1.0 if s16 % 2 == 0 else .55)
            if t >= 26 and s16 % 4 == 2:
                add(drums, t, hat(True), -.3, .6)
        # bass: driving 8ths
        if (DROP <= t < 74 or FINALE <= t < ENDCARD) and s16 % 2 == 0:
            up = .8 if (56 <= t < 68 or t >= FINALE) and s16 % 4 == 2 else 0
            add(bass, t, bass_note(root, BEAT / 2 - .01, up))
        # pluck arp: 16ths from 2s (filtered in the intro), full from the drop
        if 2.0 <= t < ENDCARD:
            seq = [0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 4, 3, 1]
            pool = sorted(tones + [x + 12 for x in tones])
            m = pool[seq[s16] % len(pool)]
            bright = 1.8 if 56 <= t < 68 or t >= FINALE else 1.0
            pk = pluck(m, bright=bright)
            if t < DROP: pk = filt(pk, 'lowpass', 500 + 2500 * (t - 2) / 4) * ((t - 2) / 4) ** 1.5
            add(music, t, pk, .45 if s16 % 2 else -.45, .9)
            add(verb_send, t, pk, 0, .25)

# snare roll 74 -> 76, accelerating and crescendo
t = 74.0; step = BEAT / 2
while t < FINALE - 1e-6:
    v = .35 + .65 * (t - 74) / 2
    add(drums, t, snare(v), 0); add(verb_send, t, snare(v), 0, .2)
    if t >= 75.0: step = BEAT / 4
    if t >= 75.5: step = BEAT / 8
    t += step

# risers, whooshes, impacts, bells
r = riser(3.0); add(fx, DROP - 3.0, r, gain=.7)
r = riser(1.8, 7000); add(fx, 68 - 1.8, r, gain=.35)
r = riser(4.0, 12000); add(fx, FINALE - 4.0, r, gain=.85)
for c in CUTS:
    w = whoosh(); add(fx, c - .45 * 1.3 + .15, w, gain=.7)
for when, sc in ((DROP, .9), (FINALE, 1.0), (ENDCARD, 1.0)):
    im = impact(sc); add(fx, when, im); add(verb_send, when, im, 0, .35)
    add(drums, when, kick(big=True)); kicks.append(when)
for k, m in enumerate((74, 81, 86)):
    bl = bell(m); add(music, ENDCARD + k * .12, bl, (-.4, .4, 0)[k]); add(verb_send, ENDCARD + k * .12, bl, 0, .7)
# sustaining end chord (Dm add9, high) under the end card
tail = pad_chord([62, 65, 69, 76], TOTAL - ENDCARD, 4200) * 1.4
add(music, ENDCARD, tail); add(verb_send, ENDCARD, tail, gain=.8)

# ---------------------------------------------------------------- mix
# sidechain duck from kicks
duck = np.ones(N)
tk = np.arange(int(.35 * SR)) / SR
shape = 1 - .55 * np.exp(-tk / .09)
for k in kicks:
    i0 = int(k * SR); L = min(len(shape), N - i0)
    if L > 0: duck[i0:i0 + L] = np.minimum(duck[i0:i0 + L], shape[:L])
music *= duck[:, None]; bass *= (.4 + .6 * duck)[:, None]

# ping-pong dotted-8th delay on the music bus
d = int(BEAT * .75 * SR); dl = np.zeros_like(music)
src = filt(music, 'bandpass', [400, 6000]) * .3
for k in range(1, 5):
    sh = d * k
    tap = src[:-sh] * (.45 ** k)
    dl[sh:, k % 2] += tap[:, 0] + tap[:, 1]
music += dl

# convolution reverb (stereo, 3.2s, darkened)
irt = tt(3.2)
ir = rng.standard_normal((len(irt), 2)) * np.exp(-irt / .75)[:, None]
ir = filt(ir, 'lowpass', 6500); ir[:int(.02 * SR)] = 0; ir /= np.abs(ir).sum(0) ** .5 * 6
wet = np.stack([signal.fftconvolve(verb_send[:, c], ir[:, c])[:N] for c in range(2)], 1)
wet = filt(wet, 'highpass', 220)

# bus levels + gentle section automation
music_lvl = auto([(0, .6), (5.9, .8), (6, .95), (56, 1.0), (68, 1.05), (76, 1.2), (82, 1.1), (88, 1.1)])
drum_lvl = auto([(0, .8), (14, .82), (26, .88), (56, .95), (68, 1.0), (76, 1.08), (82, 1.0), (88, 1.0)])
mix = drums * drum_lvl[:, None] + filt(bass, 'highpass', 38) * .72 + music * (1.45 * music_lvl)[:, None] + fx * .8 + wet * .6
# master EQ: clean the sub rumble, a little presence and air
mix = filt(mix, 'highpass', 30, 2)
air = filt(mix, 'highpass', 5500, 1); pres = filt(mix, 'bandpass', [1800, 4500], 1)
mix = mix + air * .35 + pres * .45

# glue compression (RMS, 3:1 above -18 dBFS)
rms = np.sqrt(signal.sosfilt(sos('lowpass', 8), (mix ** 2).mean(1)) + 1e-12)
db = 20 * np.log10(rms); over = np.clip(db + 18, 0, None)
mix *= (10 ** (-(over * (1 - 1 / 3)) / 20))[:, None]

# master fades
t_all = np.arange(N) / SR
mix *= (np.clip(t_all / .4, 0, 1) * np.clip((TOTAL - t_all) / 1.6, 0, 1))[:, None]

# loudness to -14 LUFS, then soft limiter to -1 dBFS
meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
ceil = 10 ** (-1 / 20)
mix = ceil * np.tanh(mix / ceil)
print('LUFS', round(meter.integrated_loudness(mix), 2), 'peak dBFS', round(20 * np.log10(np.abs(mix).max()), 2))
for a, b, name in ((0, 6, 'intro'), (6, 26, 'groove'), (56, 68, 'agent'), (72, 76, 'build'), (76, 82, 'finale'), (82, 88, 'endcard')):
    seg = mix[int(a * SR):int(b * SR)]
    print(f'  {name:8s} {a:>4}-{b:<4} LUFS {meter.integrated_loudness(seg):6.1f}')
pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
with wave.open('score.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote score.wav', TOTAL, 's')
