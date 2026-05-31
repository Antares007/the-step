import open_diagram from './open_diagram.js'
import bnf_compiler from './bnf_compiler.js'
import pmap from './pmap.js'
import space_time_dsl from './dsl.js'

import {expression, declarations} from './grammars.js'

function fun() {

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
//const tritab13= (d,b,t) => t(tab, dot)
//const tritab12= (d,b,t) => t(tab, tritab13)
//const tritab11= (d,b,t) => t(tab, tritab12)
//const tritab  = (d,b,t) => t(dot, tritab11)

  //const tab = o => { o('t'), o('a'), o('b') }
  //const tritab = o => { o(tab, tab, tab, S) }
  const S = o => (o('b'), o(S, 'a'))
  const B = o => (o('b'), o(A, 't'))
  const A = o => (o('a'), o(B, 'o'))
  const N = space_time_dsl(o => o(S, A))
  bnf_compiler(N)
  open_diagram(N)
  console.log('wut?')
  // one can guarantee decidability because the shape
  // of possibilities does not have meaning attached
  // so we can manipulate them freely.
  const s = toti(N)
  open_diagram(s)
  // Here one can attach meaning and can build topology
  // for a linguistic scheduler to walk on and turn
  // processes as described by the shape of possibilities.
  const uc = pmap(S => S(
    () => S,
    (x, u, q) => (_,B) => B('process('+x+')', uc(u), q),
    (s, t, q) => (_,__,T) => T(uc(s), uc(t), q),
  ))
  bnf_compiler(uc(s))








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
  const Blue_D = D => D("Blue")
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
    (    ) => c[1] ? Blue_D : tip,
    (x, t) => B(x, Blue_walk(t, c), "Blue"),
    (s, t) => (t = Blue_walk(t, c), (_,__,T) => T(toti(s), t, "Blue"))
  )
  const tip  = T((_,__,T) => T(Yellow_s, D, "Yellow"), D, "Yellow")
  const Yellow_s = Yellow_descend(root, [root])
  return Yellow_s === D ? D : tip
}, Symbol('Yellow'))
fun()
