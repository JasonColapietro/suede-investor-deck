"""Assemble the 30s social cut (16:9) from the graded master: bar-aligned chunks on the social score.
Usage: python3 cut_social.py <graded_master.mp4> <out.mp4>"""
import subprocess, sys, imageio_ffmpeg
F = imageio_ffmpeg.get_ffmpeg_exe()
# (full-film start, end) in seconds; each chunk is a whole number of 2s bars at 120 BPM
CHUNKS = [(2, 6), (8.5, 10.5), (16, 18), (21, 23), (28, 30), (33.5, 35.5), (39.5, 41.5),
          (53, 55), (60, 62), (72, 74), (77, 81), (82.5, 86.5)]
def graph(extra=''):
    parts = [f"[0:v]trim=start_frame={round(a*30)}:end_frame={round(b*30)},setpts=PTS-STARTPTS[c{k}]" for k, (a, b) in enumerate(CHUNKS)]
    lab = ''.join(f'[c{k}]' for k in range(len(CHUNKS)))
    return ';'.join(parts) + f';{lab}concat=n={len(CHUNKS)}:v=1:a=0,fps=30,fade=t=in:st=0:d=0.3,fade=t=out:st=29.4:d=0.6{extra}[v]'
if __name__ == '__main__':
    assert abs(sum(b - a for a, b in CHUNKS) - 30) < 1e-6
    src, out = sys.argv[1], sys.argv[2]
    subprocess.run([F, '-loglevel', 'error', '-y', '-i', src, '-i', 'score_social.wav', '-filter_complex', graph(),
                    '-map', '[v]', '-map', '1:a', '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-maxrate', '10M',
                    '-bufsize', '20M', '-tune', 'film', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k',
                    '-shortest', '-movflags', '+faststart', out], check=True)
    print('wrote', out)
