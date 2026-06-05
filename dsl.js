const ds = Symbol()
const oDSL = S => {
  if (S[ds]) return S[ds]
  const times = [] 
  S((...spaces) => times.push(spaces.reverse().reduce(
    (t, s) => typeof s === "string" ? (o,p) => p[1](o, s, t)
                                    : (o,p) => p[2](o, oDSL(s), t),
    (o,p) => p[0](o)
  )))
  return S[ds] = times.reverse().reduce(
    (s, t) => (o,p) => p[2](o, s, t),
    (o,p) => p[0](o)
  )
}
export default oDSL

