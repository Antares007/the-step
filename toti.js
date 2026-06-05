const Red = 1, Green = 2, Yellow = 3, Blue = 4
const dot   =           (o,p) => p[0](o)
const block = (...a) => (o,p) => p[1](o, ...a)
const tword = (...a) => (o,p) => p[2](o, ...a)
const Red_descend = [
  (c      ) => dot,
  (c, x, s) => block(x, s(c, Red_descend), Red),
  (c, s, t) => (t =  t(c, Red_walk)) === dot
             ?       s(c, Red_descend)
             : tword(s(c, Red_descend), t, Red)
]
const Red_walk = [
  (c      ) => dot,
  (c, x, t) => block(x, t(c, Green_walk), Red),
  (c, s, t) => { for (let ι = c; ι; ι = ι[1])
                   if (ι[0] === s) return dot
                 return (s = s([s, c], Red_descend)) === dot
                       ? dot
                       : tword(s, t(c, Green_walk), Red) }
]
const Green_walk = [
  (c      ) => (o,p) => p[2](o, tsvero(c[0]), dot, Green),
  (c, x, t) => block(x, t(c, Green_walk), Green),
  (c, s, t) => (t = t(c, Green_walk), (o,p) => p[2](o, toti(s), t, Green))
]
const Yellow_descend = [
  (c      ) => dot,
  (c, _, s) => s(c, Yellow_descend),
  (c, s, t) => (t =  t(c, Yellow_walk)) === dot
             ?       s(c, Yellow_descend)
             : tword(s(c, Yellow_descend), t, Yellow)
]
const Yellow_walk = [
  (c      ) => dot,
  (c,     ) => dot,
  (c, s, t) => { for (let ι = c; ι; ι = ι[1])
                   if (ι[0] === s)
                     return ι[1] ? dot : t(c, Blue_walk)
                 return (s = s([s, c], Yellow_descend)) === dot
                       ? dot
                       : tword(s, t(c, Blue_walk), Yellow) }
]
const Blue_walk = [
  (c      ) => c[1] ? dot : (o,p) => p[2](o, tsvero(c[0]), dot, Blue),
  (c, x, t) => block(x, t(c, Blue_walk), Blue),
  (c, s, t) => (t = t(c, Blue_walk), (o,p) => p[2](o, toti(s), t, Blue))
]
const Τ = Symbol("Τ")
const toti   = S => S[Τ] ? S[Τ]
                         :(S[Τ] = S([S], Red_descend))
const Δ = Symbol("Δ")
const tsvero = S => S[Δ] ? S[Δ]
                         :(S[Δ] = S([S], Yellow_descend))
export default toti
