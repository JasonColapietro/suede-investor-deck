window.SCENE_ORDER = ['open','map','ios','chrome','web','creator','agent','economy','finale'];
// Cuts that are designed as match cuts (no camera zoom/blur/sweep across them).
window.MATCH_IN = ['map', 'ios', 'finale'];
// Output-time -> film-time knots. Every scene start lands on a 2s bar at 120 BPM.
// Film scene starts: open 0 · map 7.2 · ios 17.4 · chrome 32.6 · web 44.8 · creator 57 · agent 70.2 · economy 84.4 · finale 93.6 (end 106.6)
window.WARP = [
  [0, 0], [6, 7.2], [14, 17.4], [26, 32.6], [36, 44.8], [46, 57], [56, 70.2], [68, 84.4], [76, 93.6],
  [82, 100.8],   // finale collapse into the end card lands on a bar
  [88, 106.6],
];
