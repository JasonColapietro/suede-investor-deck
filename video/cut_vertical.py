"""Compose the 9:16 vertical cut: reframe each chunk of the 30s social cut into a 1080x1080 window
and stack it under the vertical.html overlay (headline band, lockup, progress, CTA).
Usage: python3 cut_vertical.py <social_1080.mp4> <overlay.mov> <out.mp4>"""
import subprocess, sys, imageio_ffmpeg
F = imageio_ffmpeg.get_ffmpeg_exe()
# (social start, end, source crop rect x, y, w, h) -> scaled to fit the 1080x1080 window
FRAMES = [
    (0, 4, 420, 0, 1080, 1080),     # open: mark + title
    (4, 6, 0, 40, 1920, 1000),      # map (fit)
    (6, 8, 40, 280, 1840, 520),    # iOS icon grid
    (8, 10, 360, 140, 1200, 720),   # three phones
    (10, 12, 780, 140, 920, 920),   # Suede Sing panel
    (12, 14, 380, 120, 1320, 760),  # Suede Lens + Page Passport
    (14, 16, 640, 180, 1200, 780),  # Create -> IP Registry
    (16, 18, 60, 150, 1800, 900),   # creator rail (fit)
    (18, 20, 100, 280, 880, 600),   # agent terminal 402 flow
    (20, 22, 60, 150, 1800, 900),   # economy (fit)
    (22, 26, 0, 40, 1920, 1000),  # constellation
    (26, 30, 300, 0, 1320, 1080),   # end card
]
def build(src, ov, out):
    parts, labs = [], []
    for k, (a, b, x, y, w, h) in enumerate(FRAMES):
        s = min(1080 / w, 1080 / h)
        W, H = round(w * s / 2) * 2, round(h * s / 2) * 2
        parts.append(f"[0:v]trim=start_frame={a*30}:end_frame={b*30},setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},"
                     f"scale={W}:{H}:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x0b1026[w{k}]")
        labs.append(f'[w{k}]')
    fc = ';'.join(parts) + f";{''.join(labs)}concat=n={len(FRAMES)}:v=1:a=0,fps=30[win];" \
         "color=c=0x080c1d:s=1080x1920:r=30:d=30[bg];[bg][win]overlay=0:420:shortest=1[base];" \
         "[base][1:v]overlay=0:0:format=auto,fade=t=out:st=29.4:d=0.6,format=yuv420p[v]"
    subprocess.run([F, '-loglevel', 'error', '-y', '-i', src, '-i', ov, '-filter_complex', fc, '-map', '[v]', '-map', '0:a',
                    '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-maxrate', '10M', '-bufsize', '20M', '-tune', 'film',
                    '-c:a', 'copy', '-movflags', '+faststart', out], check=True)
    print('wrote', out)
if __name__ == '__main__':
    build(*sys.argv[1:4])
