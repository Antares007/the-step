import open_diagram from './open_diagram.js'
import bnf_compiler from './bnf_compiler.js'
import pmap from './pmap.js'
import oDSL from './dsl.js'

function fun() {
  function A(o) {
    o(B)
    o(B, A)
    function B(o) {
      o(A)
      o(A, B)
    }
  }
  function tab(o) { o("t"), o("a"), o("b") }
  function tritab(o) { o(tab),o(tab),o(tab) }
  function S(o) {
    o(tab)
    o(S, tab)
  }
  function R(o) { o('r', M) }
  function M(o) { o('m', R) }
  const N = oDSL(R)
  open_diagram(N)
  bnf_compiler(N)
  //console.log()
  //const s = toti(N)
  //bnf_compiler(s)
}

const toti = ((root, r) => {
  const D = D => D()
  const B = (x, u) => (_,B) => B(x, u)
  const T = (s, t) => (_,__,T) => T(s, t)
  r = [root, r, (f, t, c) => (_,__,T) => T(Red_s, f(t, c))]
  const Red_descend = (S, c) => S(
    (    ) => D,
    (x, s) => B(x, Red_descend(s, c)),
    (s, t) => (t = Red_walk(t, c)) === D ? Red_descend(s, c)
                                         : T(Red_descend(s, c), t)
  )
  const Red_walk = (S, c) => S(
    (    ) => tsvero(c[0], r),
    (x, t) => B(x, Green_walk(t, c)),
    (s, t) => { for (let d = c; d; d = d[1])
                  if (d[0] === s) return D
                return (s = Red_descend(s, [s, c])) === D
                       ? D
                       : T(s, Green_walk(t, c)) }
  )
  const Green_walk = (S, c) => S(
    (    ) => tsvero(c[0], r),
    (x, t) => B(x, Green_walk(t, c)),
    (s, t) => { for (let d = r; d; d = d[1])
                  if (d[0] === s) return d[2](Green_walk, t, c)
                return T(toti(s, r), Green_walk(t, c)) }
  )
  const Red_s = Red_descend(root, [root])
  return Red_s
})
const tsvero = pmap((root, rec) => {
  const D = D => D()
  const B = (x, u) => (_,B) => B(x, u)
  const T = (s, t) => (_,__,T) => T(s, t)
  const Yellow_descend = pmap((S, c) => S(
    (    ) => D,
    (_, s) => Yellow_descend(s, c),
    (s, t) => (t = Yellow_walk(t, c)) === D ? Yellow_descend(s, c)
                                            : T(Yellow_descend(s, c), t)
  ))
  const Yellow_walk = pmap((S, c) => S(
    (    ) => D,
    (    ) => D,
    (s, t) => { for (let d = c; d; d = d[1])
                  if (d[0] === s) return d[1] ? D : Blue_walk(t, c)
                return (s = Yellow_descend(s, [s, c])) === D
                       ? D
                       : T(s, Blue_walk(t, c)) }
  ))
  const Blue_walk = pmap((S, c) => S(
    (    ) => c[2] ? D : Yellow_dot,
    (x, t) => B(x, Blue_walk(t, c)),
    (s, t) => { for (let d = r; d; d = d[1])
                  if (d[0] === s) return d[2](Blue_walk, t, c)
                return T(toti(s, r), Blue_walk(t, c)) }
  ))
  const Yellow_dot  = (_,__,T) => T(Yellow_dots, D)
  const Yellow_dots = (_,__,T) => T(Yellow_s, D)
  const Yellow_s = Yellow_descend(root, [root])
  return Yellow_s === D ? D : Yellow_dot
})

fun()
