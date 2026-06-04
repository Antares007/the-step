const Red = 1, Green = 2, Yellow = 3, Blue = 4
const toti   = S => S[Τ] ? S[Τ]
                         :(S[Τ] = Red_descend(S, [S], d => d(Red)))
const tsvero = S => S[Δ] ? S[Δ]
                         :(S[Δ] = Yellow_descend(S, [S], d => d(Yellow)))
export default toti
const Τ = Symbol("Τ")
const Δ = Symbol("Δ")

const block = (...a) => (_,B) => B(...a)
const tword = (...a) => (_,__,T) => T(...a)
const Red_descend = (S, c, d) => S(
  (    ) => d,
  (x, s) => tword(Red_descend(s, c, d),
                  block(x,
                        (_,__,T) => T(tsvero(c[0]), d, Red),
                        Red),
                  Red),
  (s, t) =>     (t = Red_walk(t, c, d)) === d
          ?       Red_descend(s, c, d)
          : tword(Red_descend(s, c, d), t, Red)
)
const Red_walk = (S, c, d) => S(
  (    ) => d,
  (x, t) => block(x, Green_walk(t, c, d), Red),
  (s, t) => { for (let C = c; C; C = C[1])
                if (C[0] === s) return d
              return (s = Red_descend(s, [s, c], d)) === d
                    ? d
                    : tword(s, Green_walk(t, c, d), Red) }
)
const Green_walk = (S, c, d) => S(
  (    ) => (_,__,T) => T(tsvero(c[0]), d, Green),
  (x, t) => block(x, Green_walk(t, c, d), Green),
  (s, t) => (t = Green_walk(t, c, d), (_,__,T) => T(toti(s), t, Green))
)
const Yellow_descend = (S, c, d) => S(
  (    ) => d,
  (_, s) => Yellow_descend(s, c, d),
  (s, t) =>     (t = Yellow_walk(t, c, d)) === d
          ?       Yellow_descend(s, c, d)
          : tword(Yellow_descend(s, c, d), t, Yellow)
)
const Yellow_walk = (S, c, d) => S(
  (    ) => d,
  (    ) => d,
  (s, t) => { for (let C = c; C; C = C[1])
                if (C[0] === s)
                  return C[1] ? d : Blue_walk(t, c, d)
              return (s = Yellow_descend(s, [s, c], d)) === d
                    ? d
                    : tword(s, Blue_walk(t, c, d), Yellow) }
)
const Blue_walk = (S, c, d) => S(
  (    ) => c[1] ? d : (_,__,T) => T(tsvero(c[0]), d, Blue),
  (x, t) => block(x, Blue_walk(t, c, d), Blue),
  (s, t) => (t = Blue_walk(t, c, d), (_,__,T) => T(toti(s), t, Blue))
)
