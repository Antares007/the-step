const ds = Symbol()
const oDSL = S => {
  if (S[ds]) return S[ds]
  const times = [] 
  S((...spaces) => times.push(spaces.reverse().reduce(
    (t, s) => typeof s === "string" ? (_,B,__) => B(s, t)
                                    : (_,__,T) => T(oDSL(s), t),
                                      (D,_,__) => D()
  )))
  return S[ds] = times.reverse().reduce((s, t) => (_,__,T) => T(s, t), (D,_,__) => D())
}
export default oDSL

