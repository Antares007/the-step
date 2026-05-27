import pmap from './pmap.js'
import oDSL from './dsl.js'
import crypto from 'node:crypto'
import open_diagram from './open_diagram.js'
import bnf_compiler from './bnf_compiler.js'

function fun() {
  function A(o) {
    o("a")
    o(B, "o")
    function B(o) {
      o("b")
      o(A, "t")
    }
  }
  function tab(o) { o("t"), o("a"), o("b") }
  function tritab(o) { o(tab),o(tab),o(tab) }
  function S(o) {
    o("b")
    o(S, "a")
  }
  function R(o) { o('r', M) }
  function M(o) { o('m', R) }
  const N = oDSL(S)
  const sha1 = s => crypto.hash('sha1', s, 'buffer')
  console.log(
    toti(
      N,
      ("D"),
      (x,u) => (`B(${JSON.stringify(x)}, ${u})`),
      (s,t) => (`T(${s}, ${t})`),
      (r,t) => (`R(${r}, ${t})`)
    ).toString('hex')
  )
  console.log(N)
  bnf_compiler(N)
  console.log()
  //const s = toti(N)
  //bnf_compiler(s)
  open_diagram(N)
}

const Red_Symbol = Symbol("Red")
const toti = pmap((root, D, B, T, R) => {
  const Red_descend = (S, c) => S(
    (    ) => D,
    (x, s) => B(x, Red_descend(s, c)),
    (s, t) => (t = Red_walk(t, c)) === D ? Red_descend(s, c)
                                         : T(Red_descend(s, c), t)
  )
  const Red_walk = (S, c) => S(
    (    ) => tsvero(c[0], D, B, T, R),
    (x, t) => B(x, Green_walk(t, c)),
    (s, t) => { for (let d = c; d; d = d[2])
                  if (d[0] === s) return D
                return (s = Red_descend(s, [s, c[1] + 1, c])) === D
                       ? D
                       : T(s, Green_walk(t, c)) }
  )
  const Green_walk = (S, c) => S(
    (    ) => tsvero(c[0], D, B, T, R),
    (x, t) => B(x, Green_walk(t, c)),
    (s, t) => s === root ? R(c[1], Green_walk(t, c))
                         : T(toti(s, D, B, T, R), Green_walk(t, c))
  )
  return Red_descend(root, [root, 0])
}, Red_Symbol)
const Yellow_Symbol = Symbol("Yellow")
const tsvero = pmap((root, D, B, T, R) => {
  const Yellow_descend = (S, c) => S(
    (    ) => D,
    (_, s) => Yellow_descend(s, c),
    (s, t) => (t = Yellow_walk(t, c)) === D ? Yellow_descend(s, c)
                                            : T(Yellow_descend(s, c), t)
  )
  const Yellow_walk = (S, c) => S(
    (    ) => D,
    (    ) => D,
    (s, t) => { for (let d = c; d; d = d[2])
                  if (d[0] === s) return d[2] ? D : Blue_walk(t, c)
                return (s = Yellow_descend(s, [s, c[1] + 1, c])) === D
                       ? D
                       : T(s, Blue_walk(t, c)) }
  )
  const Blue_walk = (S, c) => S(
    (    ) => c[2] ? D : R(1, D),
    (x, t) => B(x, Blue_walk(t, c)),
    (s, t) => s === root ? R(c[1], Blue_walk(t, c))
                         : T(toti(s, D, B, T, R), Blue_walk(t, c))
  )
  const Yellow_s = Yellow_descend(root, [root, 0])
  return Yellow_s === D ? D : T(T(Yellow_s, D), D)
}, Yellow_Symbol)

fun()
