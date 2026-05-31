import open_diagram from './open_diagram.js'
import bnf_compiler from './bnf_compiler.js'
import pmap from './pmap.js'
import oDSL from './dsl.js'

import {expression} from './grammars.js'

function fun() {
  function A(o) {
    o('a')
    o(B, 'o')
    function B(o) {
      o('b')
      o(A, 't')
    }
  }

  const uc = pmap(S => S(
    () => S,
    (x, u) => (_,B) => B(x.toUpperCase(), uc(u)),
    (s, t) => (_,__,T) => T(uc(s), uc(t)),
  ))

//const dot     = (d,b,t) => d() 
//const S_t1    = (d,b,t) => b('b', dot)
//const S_t22   = (d,b,t) => b('a', dot)
//const S_t2    = (d,b,t) => t(S, S_t22)
//const S_s2    = (d,b,t) => t(dot, S_t2)
//const S       = (d,b,t) => t(S_s2, S_t1)
//
//const tab2    = (d,b,t) => b('b', dot)
//const tab1    = (d,b,t) => b('a', tab2)
//const tab     = (d,b,t) => b('t', tab1)
//
//const tritab14= (d,b,t) => t(S, dot)
//const tritab13= (d,b,t) => t(tab, tritab14)
//const tritab12= (d,b,t) => t(tab, tritab13)
//const tritab11= (d,b,t) => t(tab, tritab12)
//const tritab  = (d,b,t) => t(dot, tritab11)

const S = o => {
  o('b')
  o(S, 'a')
}
const tab = o => {
  o('t')
  o('a')
  o('b')
}
const tritab = o => {
  o(tab, tab, tab, S)
}
const R = o => o('r', R)

  const N = oDSL(tritab)
  //open_diagram(N)

  //bonf_compiler(N)
  console.log()
  console.log('wut?')
  const s = toti(N)
  bnf_compiler(s)
  //open_diagram(s)
}

const toti = pmap((root) => {
  const D = D => D("Red")
  const B = (...a) => (_,B) => B(...a)
  const T = (...a) => (_,__,T) => T(...a)
  const Red_descend = (S, c) => S(
    (    ) => D,
    (x, s) => T(Red_descend(s, c), B(x, tsvero(c[0]), "Red"), "Red"),
    (s, t) => (t = Red_walk(t, c)) === D ? Red_descend(s, c)
                                         : T(Red_descend(s, c), t, "Red")
  )
  const Red_walk = (S, c) => S(
    (    ) => tsvero(c[0]),
    (x, t) => B(x, Green_walk(t, c), "Red"),
    (s, t) => { for (let d = c; d; d = d[1])
                  if (d[0] === s) return D
                return (s = Red_descend(s, [s, c])) === D
                      ? D
                      : T(s, Green_walk(t, c), "Red") }
  )
  const Green_walk = (S, c) => S(
    (    ) => tsvero(c[0]),
    (x, t) => B(x, Green_walk(t, c), "Green"),
    (s, t) => (t = Green_walk(t, c), (_,__,T) => T(toti(s), t, "Green"))
  )
  return Red_descend(root, [root])
}, Symbol('Red'))
const tsvero = pmap((root) => {
  const D = D => D("Yellow")
  const B = (...a) => (_,B) => B(...a)
  const T = (...a) => (_,__,T) => T(...a)
  const Yellow_descend = (S, c) => S(
    (    ) => D,
    (_, s) => Yellow_descend(s, c),
    (s, t) => (t = Yellow_walk(t, c)) === D ? Yellow_descend(s, c)
                                            : T(Yellow_descend(s, c), t, "Yellow")
  )
  const Yellow_walk = (S, c) => S(
    (    ) => D,
    (    ) => D,
    (s, t) => { for (let d = c; d; d = d[1])
                  if (d[0] === s) return d[1] ? D : Blue_walk(t, c)
                return (s = Yellow_descend(s, [s, c])) === D
                      ? D
                      : T(s, Blue_walk(t, c), "Yellow") }
  )
  const Blue_walk = (S, c) => S(
    (    ) => c[1] ? D => D("Blue") : Yellow_dot,
    (x, t) => B(x, Blue_walk(t, c), "Blue"),
    (s, t) => (t = Blue_walk(t, c), (_,__,T) => T(toti(s), t, "Blue"))
  )
  const Yellow_dot  = (_,__,T) => T(Yellow_dots, D, "Yellow")
  const Yellow_dots = (_,__,T) => T(Yellow_s, D, "Yellow")
  const Yellow_s = Yellow_descend(root, [root])
  return Yellow_s === D ? D : Yellow_dot
}, Symbol('Yellow'))
fun()
