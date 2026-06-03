# 拆音 sound clips (optional drop-in)

Put short audio clips here to replace the browser text-to-speech in the
**🧩 聽拆音** (Fred Talk) feature. If a clip is missing, the app automatically
falls back to TTS — so the app works with **none, some, or all** of these.

## How it works
- File format: **`.mp3`**, one clip per RWI sound.
- Location: this folder, named exactly `<sound>.mp3` (see list below).
- Keep them **short** (just the pure sound, ~0.3–0.6s), trimmed of silence.
- Split digraphs use an underscore: `a_e.mp3`, `i_e.mp3`, `o_e.mp3`, `u_e.mp3`.

Optionally, whole-word clips can go in `audio/words/<word>.mp3` (e.g.
`audio/words/skate.mp3`) and they'll be used for the final blended read.

## ⚠️ Sourcing the audio (important)
The official **Read Write Inc. Speed Sounds** recordings are © Oxford
University Press / Ruth Miskin — do **not** rip and republish those in a public
repo. Use one of these instead:
- Record your own voice saying each pure sound (perfectly fine for family use).
- Use a free phonics/CC-licensed sound set you have the right to host.

## Filenames needed (62 sounds)

**Single letters:** `a b c d e f g h i j k l m n o p qu r s t u v w x y z`
(note: `qu` is one sound, not `q`)

**Consonant digraphs:** `ch sh th ng nk ph wh ck ll ss zz`

**Vowel graphemes:** `ai ay ee igh ie ey oa ow oo or ar er ir ur air au aw ou oi oy ew ue`

**Split digraphs (magic-e):** `a_e e_e i_e o_e u_e`

Exact list:
```
a.mp3  a_e.mp3  ai.mp3  air.mp3  ar.mp3  au.mp3  aw.mp3  ay.mp3
b.mp3  c.mp3  ch.mp3  ck.mp3  d.mp3  e.mp3  ee.mp3  er.mp3  ew.mp3  ey.mp3
f.mp3  g.mp3  h.mp3  i.mp3  i_e.mp3  ie.mp3  igh.mp3  ir.mp3
j.mp3  k.mp3  l.mp3  ll.mp3  m.mp3  n.mp3  ng.mp3  nk.mp3
o.mp3  o_e.mp3  oi.mp3  oo.mp3  or.mp3  ou.mp3  ow.mp3  oy.mp3
p.mp3  ph.mp3  qu.mp3  r.mp3  s.mp3  sh.mp3  ss.mp3
t.mp3  th.mp3  u.mp3  u_e.mp3  ue.mp3  ur.mp3
v.mp3  w.mp3  wh.mp3  x.mp3  y.mp3  z.mp3  zz.mp3
```
