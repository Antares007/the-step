const block = (...a) => (_,B) => B(...a)
const tword = (...a) => (_,__,T) => T(...a)
const Red = 1, Green = 2, Yellow = 3, Blue = 4
const Τ = Symbol("Τ")
const toti = S => {
  if (S[Τ]) return S[Τ]
  const d = d => d(Red)
  const s = Red_descend(S, [S], d)
  return S[Τ] = (s === d ? tword(d, tsvero(S)) : s)
}
export default toti
const Δ = Symbol("Δ")
const tsvero = S => {
  if (S[Δ]) return S[Δ]
  const d = d => d(Yellow)
  const s = Yellow_descend(S, [S], d)
  if (s === d) return S[Δ] = d
  else {
    const a = (_,__,T) => T(s, d, Yellow)
    const b = (_,__,T) => T(a, d, Yellow)
    return S[Δ] = b
  }
}
const Red_descend = (S, c, d) => S(
  (    ) => d,
  (x, s) => tword(Red_descend(s, c, d),
                  (_,B) => B(x, tsvero(c[0])),
                  Red),
  (s, t) =>     (t = Red_walk(t, c, d)) === d
          ?       Red_descend(s, c, d)
          : tword(Red_descend(s, c, d), t, Red)
)
const Red_walk = (S, c, d) => S(
  (    ) => (D,B,T) => tsvero(c[0])(D,B,T),
  (x, t) => block(x, Green_walk(t, c, d), Red),
  (s, t) => { for (let C = c; C; C = C[1])
                if (C[0] === s) return d
              return (s = Red_descend(s, [s, c], d)) === d
                      ?          Green_walk(t, c, d)
                      : tword(s, Green_walk(t, c, d), Red) }
)
const Green_walk = (S, c, d) => S(
  (    ) => (D,B,T) => tsvero(c[0])(D,B,T),
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
  (    ) => c[1] ? d : (D,B,T) => tsvero(c[0])(D,B,T),
  (x, t) => block(x, Blue_walk(t, c, d), Blue),
  (s, t) => (t = Blue_walk(t, c, d), (_,__,T) => T(toti(s), t, Blue))
)
