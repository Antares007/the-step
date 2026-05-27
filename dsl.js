import pmap from './pmap.js'
const oDSL = pmap(S => {
  const times = [] 
  S((...spaces) => times.push(spaces.reverse().reduce(
    (t, s) => typeof s === "string"
  ? (_,B,__) => B(s, t)
  : (_,__,T) => T(oDSL(s), t),
    (D,_,__) => D()
  )))
  return times.reverse().reduce((s, t) => (_,__,T) => T(s, t), (D,_,__) => D())
})
export default oDSL

