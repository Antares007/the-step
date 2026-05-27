function fun() {
  function T(o) {
    o(S)
    o(A)
    o(expression)
    o(S, A, expression)
  }
  function expression(o) {
    o(additive)
    function additive(o) {
      o(multiplicative)
      o(additive, "+", multiplicative)
      o(additive, "-", multiplicative)

    }
    function multiplicative(o) {
      o(unary)
      o(multiplicative, "*", unary)
      o(multiplicative, "/", unary)
    }

    function unary(o) {
      o(primary)
      o("-", unary)
      o("!", unary)
    }

    function primary(o) {
      o(constant)
      o("(", expression, ")")
    }

    function constant(o) {
      o("1"), o("2"), o("3")
    }
  }
  function declarations(o) {
    o(declaration)
    o(declarations, sp, declaration)
    function declaration(o) {
      o(name, sp, productions, sp, ".")
      function name(o) {
        o(alfa)
        o(name, alfa)
      }
      function alfa(o) {
        o("a"), o("b"), o("c"), o("d"), o("e"), o("f"),
        o("g"), o("h"), o("i"), o("j"), o("k"), o("l"),
        o("m"), o("n"), o("o"), o("p"), o("q"), o("r"),
        o("s"), o("t"), o("u"), o("v"), o("w"), o("x"),
        o("y"), o("z")
      }
      function productions(o) {
        o(production)
        o(productions, sp, ",", sp, production)
        function production(o) {
          o(primary, quantifier)
          o(production, sp, primary, quantifier)
          function primary(o) {
            o(name)
            o("\"", alfa, "\"")
            o("(", sp, productions, sp, ")")
          }
          function quantifier(o) {
            o("?"), o("+"), o("*")
          }
        }
      }
    }
    function sp(o) {
      o(sp)
      o(sp, space_char)
      function space_char(o) {
        o(" "), o("\t"), o("\n")
      }
    }
  }

  const oDSL = pmap(S => {
    const times = [] 
    S((...spaces) => times.push(spaces.reverse().reduce(
      (t, s) => typeof s === "string" ? (D,B,T) => B(s, t)
                                      : (D,B,T) => T(oDSL(s), t),
      (D,B,T) => D()
    )))
    return times.reverse().reduce((s, t) => (D,B,T) => T(s, t), (D,B,T) => D())
  })
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
    o(tab)
    o(S, tab)
  }
  const N = (handmade().tritab)
  console.log(
    toti(
      N,
      "D",
      (x,u) => `B(${JSON.stringify(x)}, ${u})`,
      (s,t) => `T(${s}, ${t})`,
      (r,t) => `R(${r}, ${t})`
    )
  )
  console.log(N)
  //bnf_compiler(N)
  //console.log()
  //const s = toti(N)
  //bnf_compiler(s)
  //open_diagram(s)
}

const pmap = (t, _ = Symbol()) => (S, ...a) => S[_] || (S[_] = t(S, ...a))
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
    (    ) => c[2] ? dot : R(0, D),
    (x, t) => B(x, Blue_walk(t, c)),
    (s, t) => s === root ? R(c[1], Blue_walk(t, c))
                         : T(toti(s, D, B, T, R), Blue_walk(t, c))
  )
  const toti = Yellow_descend(root, [root, 0])
  return toti === D ? D : T(T(toti, D), D)
}, Yellow_Symbol)

function handmade() {
  const dot     = (d,b,t) => d() 
  const S_t1    = (d,b,t) => b('b', dot)
  const S_t22   = (d,b,t) => b('a', dot)
  const S_t2    = (d,b,t) => t(S, S_t22)
  const S_s2    = (d,b,t) => t(dot, S_t2)
  const S       = (d,b,t) => t(S_s2, S_t1)

  const tab2    = (d,b,t) => b('b', dot)
  const tab1    = (d,b,t) => b('a', tab2)
  const tab     = (d,b,t) => b('t', tab1)

  const tritab13= (d,b,t) => t(tab, dot)
  const tritab12= (d,b,t) => t(tab, tritab13)
  const tritab11= (d,b,t) => t(tab, tritab12)
  const tritab  = (d,b,t) => t(dot, tritab11)


  const Bt11= (d,b,t) => b("t", dot)
  const Bt1 = (d,b,t) => t(As0, Bt11)
  const Bs1 = (d,b,t) => t(dot, Bt1)
  const Bt0 = (d,b,t) => b("b", dot)
  const Bs0 = (d,b,t) => t(Bs1, Bt0)

  const At11= (d,b,t) => b("o", dot)
  const At1 = (d,b,t) => t(Bs0, At11)
  const As1 = (d,b,t) => t(dot, At1)
  const At0 = (d,b,t) => b("a", dot)
  const As0 = (d,b,t) => t(As1, At0)

  const alfz = (d,b,t) => b("z",dot)
  const alfy = (d,b,t) => b("y",alfz)
  const alfx = (d,b,t) => b("x",alfy)
  const alfw = (d,b,t) => b("w",alfx)
  const alfv = (d,b,t) => b("v",alfw)
  const alfu = (d,b,t) => b("u",alfv)
  const alft = (d,b,t) => b("t",alfu)
  const alfs = (d,b,t) => b("s",alft)
  const alfr = (d,b,t) => b("r",alfs)
  const alfq = (d,b,t) => b("q",alfr)
  const alfp = (d,b,t) => b("p",alfq)
  const alfo = (d,b,t) => b("o",alfp)
  const alfn = (d,b,t) => b("n",alfo)
  const alfm = (d,b,t) => b("m",alfn)
  const alfl = (d,b,t) => b("l",alfm)
  const alfk = (d,b,t) => b("k",alfl)
  const alfj = (d,b,t) => b("j",alfk)
  const alfi = (d,b,t) => b("i",alfj)
  const alfh = (d,b,t) => b("h",alfi)
  const alfg = (d,b,t) => b("g",alfh)
  const alff = (d,b,t) => b("f",alfg)
  const alfe = (d,b,t) => b("e",alff)
  const alfd = (d,b,t) => b("d",alfe)
  const alfc = (d,b,t) => b("c",alfd)
  const alfb = (d,b,t) => b("b",alfc)
  const alfa = (d,b,t) => b("a",alfb)

  const name_t1 = (d,b,t) => t(alfa,    dot)
  const name_t2 = (d,b,t) => t(name,    name_t1)
  const name_s2 = (d,b,t) => t(dot,     name_t2)
  const name    = (d,b,t) => t(name_s2, name_t1)

  const quantifier2 = (d,b,t) => b("*",         dot);
  const quantifier1 = (d,b,t) => b("+",         quantifier2);
  const quantifier0 = (d,b,t) => b("?",         quantifier1);
  const quantifier  = (d,b,t) => t(quantifier0, dot) 

  const space_char2 = (d,b,t) => b("\n",dot)
  const space_char1 = (d,b,t) => b("\t",space_char2)
  const space_char  = (d,b,t) => b(" ", space_char1)

  const sp_t1 = (d,b,t) => t(space_char,dot)
  const sp_t2 = (d,b,t) => t(sp,        sp_t1)
  const sp_s2 = (d,b,t) => t(dot,       sp_t2)
  const sp    = (d,b,t) => t(sp_s2,     dot)

  const primary_t1 = (d,b,t) => t(name,       dot)
  const primary_t22= (d,b,t) => b('"',        dot)
  const primary_t21= (d,b,t) => t(alfa,       primary_t22)
  const primary_t2 = (d,b,t) => b('"',        primary_t21)
  const primary_t34= (d,b,t) => b(')',        dot)
  const primary_t33= (d,b,t) => t(sp,         primary_t34)
  const primary_t32= (d,b,t) => t(productions,primary_t33)
  const primary_t31= (d,b,t) => t(sp,         primary_t32)
  const primary_t3 = (d,b,t) => b('(',        primary_t31)
  const primary_s3 = (d,b,t) => t(dot,        primary_t3) 
  const primary_s2 = (d,b,t) => t(primary_s3, primary_t2) 
  const primary    = (d,b,t) => t(primary_s2, primary_t1)

  const production_t11= (d,b,t) => t(quantifier,    dot)
  const production_t1 = (d,b,t) => t(primary,       production_t11)
  const production_t21= (d,b,t) => t(sp,            production_t1)
  const production_t2 = (d,b,t) => t(production,    production_t21)
  const production_s2 = (d,b,t) => t(dot,           production_t2)
  const production    = (d,b,t) => t(production_s2, production_t1)

  const productions_t1  = (d,b,t) => t(production,    dot)
  const productions_t23 = (d,b,t) => t(sp,            productions_t1)
  const productions_t22 = (d,b,t) => b(',',           productions_t23)
  const productions_t21 = (d,b,t) => t(sp,            productions_t22)
  const productions_t2  = (d,b,t) => t(productions,   productions_t21)
  const productions_s2  = (d,b,t) => t(dot,           productions_t2)
  const productions     = (d,b,t) => t(productions_s2,productions_t1)

  const declaration_t14 = (d,b,t) => b('.',         dot)
  const declaration_t13 = (d,b,t) => t(sp,          declaration_t14)
  const declaration_t12 = (d,b,t) => t(productions, declaration_t13)
  const declaration_t11 = (d,b,t) => t(sp,          declaration_t12)
  const declaration_t1  = (d,b,t) => t(name,        declaration_t11)
  const declaration     = (d,b,t) => t(dot,         declaration_t1)

  const declarations_t1 = (d,b,t) => t(declaration,     dot)
  const declarations_t21= (d,b,t) => t(sp,              declarations_t1)
  const declarations_t2 = (d,b,t) => t(declarations,    declarations_t21)
  const declarations_s2 = (d,b,t) => t(dot,             declarations_t2)
  const declarations    = (d,b,t) => t(declarations_s2, declarations_t1)
  return {declarations,S,tritab,tab,As0}
}
function fun2() {





const crypto = require('node:crypto')
const sha1 = s => crypto.hash('sha1', s, 'buffer')

const tword = (s, t) => (_,__,T) => T(s, t)
const block = (x, u) => (_,B,__) => B(x, u)
const inspace = (T, s, t) => t === dot ? s : T(s, t)
const Red_descend = (S, c) => S(
  (    ) => dot,
  (x, s) => block(x, Red_descend(s, c)),
  (s, t) => inspace(tword, Red_descend(s, c),  Red_walk(t, c))
)
const Red_branch = pmap(S => (Red_descend(S, [S])))
const intime = (T, s, t) => s === dot ? t : T(s, t)
const Red_walk = (S, c) => S(
  (    ) => Yellow_branch(c[0]),
  (x, t) => block(x, Green_walk(t, c)),
  (s, t) => {
    for (let d = c; d; d = d[1])
      if (d[0] === s) return dot
    return intime(tword, Red_descend(s, [s, c]), Green_walk(t, c))
})
const Green_walk = (S, c) => S(
  (    ) => Yellow_branch(c[0]),
  (x, t) => block(x, Green_walk(t, c)),
  (s, t) => (D, B, T) => intime(T, Red_branch(s), Green_walk(t, c)),
)
const Yellow_descend = (S, c) => S(
  (    ) => dot,
  (_, s) => Yellow_descend(s, c),
  (s, t) => inspace(tword, Yellow_descend(s, c), Yellow_walk(t, c)),
)
const Yellow_branch = pmap((S) => {
  const Yellow_s = Yellow_descend(S, [S])
  return Yellow_s === dot ? dot : tword(tword(Yellow_s, dot), dot)
})
const Yellow_walk = (S, c) => S(
  (    ) => dot,
  (x, t) => dot,
  (s, t) => {
    for (let d = c; d; d = d[1])
      if (d[0] === s) return d[1] ? dot : Blue_walk(t, c)
    return intime(tword, Yellow_descend(s, [s, c]), Blue_walk(t, c))
})
const Blue_walk = (S, c) => S(
  (    ) => c[1] ? dot : (D,B,T) => Yellow_branch(c[0])(D,B,T),
  (x, t) => block(x, Blue_walk(t, c)),
  (s, t) => (D,B,T) => intime(T, Red_branch(s), Blue_walk(t, c))
)

const space = (S, str, c) => S(
  (    ) => {},
  (x, s) => (str.startsWith(x) && c(str.slice(x.length)), space(s, str, c)),
  (s, t) => (time(t, str, c), space(s, str, c))
)
const time = (S, str, c) => S(
  (    ) => c(str),
  (x, t) => str.startsWith(x) && time(t, str.slice(x.length), c),
  (s, t) => space(s, str, (str) => time(t, str, c)),
)
//space(tritab, "bbb.", console.log.bind(console))
//space(eliminateLR(declarations), "a a,aaaa aaaaa aaa.#<<<<", console.log.bind(console)) 
//bnf_compiler(declarations)


function normalize(S) {
  const crypto = require('node:crypto')
  const sha1 = s => crypto.hash('sha1', s, 'hex')
  const cdb = {}
  const store = v => {
    const hash = sha1(JSON.stringify(v))
    cdb[hash] = v
    return hash
  }
  const HD = (    ) => store([0])
  const HB = (x, u) => store([1, x, u])
  const HT = (s, t) => store([2, s, t])
  const RST= (s, t) => store([3, s, t])
  const RS = (s, t) => store([4, s, t])
  const RT = (s, t) => store([5, s, t])
  const RB = (x, u) => store([6, x, u])
  const chain =
    (f) =>
    (S, c = (_, i) => -i) =>
      f(S, (v, i = 0) => (S === v ? i : c(v, i + 1)))
  const relate = chain((S, c) =>
    S(
      () => HD(),
      (x, u) =>
        ((ru) => (-1 < ru ? RB(x, ru) : HB(x, relate(u, c))))(c(u)),
      (s, t) =>
        ((rs, rt) => -1 < rs && -1 < rt ? RST(rs, rt)
                   : -1 < rs            ?  RS(rs, relate(t, c))
                   : -1 < rt            ?  RT(relate(s, c), rt)
                   : HT(relate(s, c), relate(t, c))
        )(c(s), c(t)),
    )
  )
  const hash = relate(S) 
  const map = {}
  const unchane = f => (hash, c) => {
    if (map[hash]) return
    map[hash] = true
    f(hash, i => i ? c(i-1) : hash)
  }
  const declarations = []
  const l = h => declarations.push(h)
  const hashes = Object.keys(cdb)
  const n = h => '_' + hashes.indexOf(h)
  const unrelate = unchane((hash, c) => ([
    (     ) => (l(`const ${n(hash)} = (D,_,__) => D()`)),
    (x,  u) => (l(`const ${n(hash)} = (_,B,__) => B(${JSON.stringify(x)}, ${n(u)})`),unrelate(u, c)),
    (s,  t) => (l(`const ${n(hash)} = (_,__,T) => T(${n(s)}, ${n(t)})`),unrelate(s, c),unrelate(t, c)),
    (rs,rt) => (l(`const ${n(hash)} = (_,__,T) => T(${n(c(rs))}, ${n(c(rt))})`)),
    (rs, t) => (l(`const ${n(hash)} = (_,__,T) => T(${n(c(rs))}, ${n(t)})`),unrelate(t, c)),
    (s, rt) => (l(`const ${n(hash)} = (_,__,T) => T(${n(s)}, ${n(c(rt))})`),unrelate(s, c)),
    (x, ru) => (l(`const ${n(hash)} = (_,B,__) => B(${JSON.stringify(x)}, ${n(c(ru))})`))
  ])[cdb[hash][0]](cdb[hash][1], cdb[hash][2]))

  unrelate(hash)
  return new Function([...declarations, "return " + n(hash)].join("\n"))()
}
//console.log(
//  normalize(
//    (() => {
//      const S = (_, b, t) => t(S, S)
//      return S
//    })(),
//  ),
//)


const dbt2obatsrd = pmap(S => (o,b,a,t,s,r,d) => S(
  (    ) => (                        o[s+0](o,b,a,t,s,r,d)),
  (x, u) => (o[a++] = x, o[a++] = t, o[s+1](o,b,a,t,s,r,d)),
  (s, t) => (o[a++] = s, o[a++] = t, o[s+2](o,b,a,t,s,r,d)),
))
const obatsrd2dbt = pmap((o,b,a,t,s,r,d) => (d,b,t) => (
  o[a] = (    ) => d(),
  o[a] = (x, u) => b(x, u),
  o[a] = (s, t) => t(s, t),
  o[s](o,b,a,t,s,r,d)
))

//open_diagram(As0)
//open_diagram(
//  //eliminateLR( declarations)
//  nd
//)
//const readline = require('node:readline')
//
//const rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout,
//  prompt: '> '
//})
//rl.prompt()
//rl.on('line', line => {
//  try {
//    console.log(eval(line))
//  } catch (e) {
//    console.error(e.message)
//  }
//  rl.prompt()
//})






//const hash = (S, hash) => {
//  const dot     =           hash([0      ])
//  const block    = (x, u) => hash([1, x, u])
//  const tword    = (s, t) => hash([2, s, t])
//  const relate  = (r, t) => hash([3, r, t])
//  const space = ((S, c) => S(
//    (    ) => dot,
//    (x, s) => block(x, space(s, c)),
//    (s, t) => tword(space(s, c), time(t, c)),
//  ))
//  const chain = (s, c) =>
//    (v, i) => v === s ? i : c(v, i + 1)
//  const time = ((S, c) => S(
//    (    ) => d=>d(),
//    (x, t) => block(x, time(t, c)),
//    (s, t) => {
//      const r = c(s, 0)
//      return -1 < r ? relate(r, time(t, c))
//                    : tword(
//                        space(s, chain(s, c)),
//                        time(t, c))
//    }
//  ))
//  return space(S, chain(S, () => -1))
//}
//
//const crypto = require('node:crypto')
//const sha1 = s => crypto.hash('sha1', s, 'hex')
//const cdb = {}
//const rez = hash(S, v => {
//  const hash = sha1(JSON.stringify(v))
//  cdb[hash] = v
//  return hash
//})
////
//////T(
//////  T(
//////    D(),
//////    R(0, B("a", D()))
//////  ),
//////  B("b", D())
//////)
////
//bnf_compiler(As0)
//bnf_compiler(S)
//bnf_compiler(eliminateLR(declarations))

//console.log(
//  hash(S, ([op,a,b]) => ([
//    (    ) => 'D()',
//    (x, u) => 'B(' + JSON.stringify(x) + ', ' + u + ')',
//    (s, t) => 'T(' + s + ', ' + t + ')',
//    (r, t) => 'R(' + r + ', ' + t + ')',
//  ])[op](a, b))
//)
//mermaid(eliminateLR(declarations))
//const keys = Object.keys(cdb)
//console.log(keys.indexOf(rez))
//for(let i = 0; i < keys.length; i++) {
//  const [op, a, b] = cdb[keys[i]];
//  ([
//    (    ) => console.log(`const _${i} = o => o[0]()`),
//    (x, u) => console.log(`const _${i} = o => o[1](${JSON.stringify(x)}, _${keys.indexOf(u)})`),
//    (s, t) => console.log(`const _${i} = o => o[2](_${keys.indexOf(s)}, _${keys.indexOf(t)})`),
//    (r, t) => console.log(`const _${i} = o => o[3](${r}, _${keys.indexOf(t)})`),
//  ])[op](a, b)
//}
//
//const unhash = pmap(hash => 
//  ([
//    (    ) => (D,_,__,___) => D(),
//    (s, t) => (_,__,B,___) => B(unhash(s),  unhash(t)),
//    (x, u) => (_,T,__,___) => T(x,          unhash(u)),
//    (r, t) => (_,__,___,R) => R(r,          unhash(t)),
//  ])[cdb[hash][0]](cdb[hash][1], cdb[hash][2]))
//
//unhash(rez)(
//  () => console.log(0),
//  () => console.log(2),
//  () => console.log(1),
//  () => console.log(3),
//)
//
//const unrel = S => {
//  const dot   =           (D,_,__) => D()
//  const block  = (x, u) => (_,T,__) => T(x, u)
//  const tword  = (s, t) => (_,__,B) => B(s, t)
//  const symbol  = Symbol("unrel")
//  const get = (s, c) =>
//              (r) => r ? c(r - 1) : s
//  const space = pmap((S, c) => S( 
//    (    ) => dot,
//    (x, s) => block(x, space(s, c)),
//    (s, t) => tword(space(s, c), time(t, c)),
//  ), symbol)
//  const time = pmap((S, c) => S( 
//    (    ) => d=>d(),
//    (x, s) => block(x, time(s, c)),
//    (s, t) => tword(space(s, get(s, c)), time(t, c)),
//    (r, t) => tword(c(r)[symbol], time(t, c)),
//  ), symbol)
//  return space(S, get(S, (r) => { throw new Error(r) }))
//}
//
//bnf_compiler(
//  unrel(unhash(rez))
//)

//open_diagram(declarations)


//bnf_compiler(
//  eliminateLR(declarations)
//);
//bnf_compiler(Yellow_descend(declarations, v => declarations === v ? 2 : 0));
//bnf_compiler(Green_descend(declarations, v => declarations === v));



// expr add.
// add mul (('+', '-') mul)*.
// mul atom (('*', '/') atom)*.
// atom INT, '(' expr ')'.
// 
// expr add.
// add mul, add '+' mul, add '-' mul.
// mul atom, mul ('*', '/') atom.
// atom INT, '(' expr ')'.

}
function bnf_compiler(...symbols) {
  const write = (args) => process.stdout.write(args)
  let cs = 0
  let next = d=>d()
  const name = s => symbols.indexOf(s) + ""
  fetch()

  function time_dot         (   ) { next_space(next) }
  function time_termin      (x,t) { write(JSON.stringify(x)), stm(next_time, t) }
  function time_branch      (s,t) { if(symbols.indexOf(s) === -1)
                                      symbols.push(s)
                                    write(name(s)), stm(next_time, t) }
  function next_time_termin (x,t) { write(' '), time_termin(x, t) }
  function next_time_branch (s,t) { write(' '), time_branch(s, t) }

  function space_dot        (   ) { write('.\n'),             stm(fetch) }
  function space_termin     (x,s) { write(JSON.stringify(x)), stm(next_space, s)}
  function space_branch     (s,t) { next = s,                 init_time(t)}

  function init_space_termin(x,s) { write(' '), space_termin(x, s) }
  function init_space_branch(s,t) { write(' '), space_branch(s, t) }
  function next_space_termin(x,s) { write(', '), stm(space_termin, x, s) }
  function next_space_branch(s,t) { write(', '), stm(space_branch, s, t) }

  function init_time (s) { s(time_dot,  time_termin,       time_branch) }
  function next_time (s) { s(time_dot,  next_time_termin,  next_time_branch) }
  function init_space(s) { s(space_dot, init_space_termin, init_space_branch) }
  function next_space(s) { s(space_dot, next_space_termin, next_space_branch) }

  function fetch() {
    if(cs < symbols.length) 
      next = symbols[cs++], write(name(next)), stm(init_space, next)
  }
  function stm(f,...args) { f(...args) }
}
function open_diagram(...args) {
  const state = {
    code: mermaid(...args),
    grid: true,
    mermaid: '{\n  "theme": "dark"\n}',
    //panZoom: true,
    //rough: false,
    //updateDiagram: true,
    //renderCount: 5,
    //pan: { x: 507.3228154144735, y: 52.80805721952268 },
    //zoom: 0.875,
    //editorMode: 'code'
  }
  openBrowser('https://mermaid.live/view#pako:' + require('zlib').deflateSync(Buffer.from(JSON.stringify(state), 'utf-8')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
  function openBrowser(url) {
    const { exec } = require('child_process');
    const os = require('os');
    const platform = os.platform();
    const cmd =
      platform === 'win32' ? `start "" "${url}"` :
      platform === 'darwin' ? `open "${url}"` :
      `xdg-open "${url}"`;

    exec(cmd);
  }
  function mermaid(...symbols) {
    const attrs = []
    const edges = []
    const iof = s => {
      let i = symbols.indexOf(s)
      if (i === -1) i = symbols.length, symbols.push(s)
      return i
    } 
    for(let i = 0; i < symbols.length; i++) {
      const s = symbols[i] 
      const n = s.name
      s((    ) =>  attrs[i] = [0, n], 
        (x, u) => (attrs[i] = [1, n, x], edges.push([i, iof(u), 1])),
        (s, t) => (attrs[i] = [2, n],    edges.push([i, iof(s), 0]),
          edges.push([i, iof(t), 1])))
    }
    return (`---
config:
  layout: elk
---
flowchart TB
` +
      attrs.map(([op,n,x],i) => i + (op === 0 ? '@{ shape: framed-circle }'
        :op === 1 ? '(('+JSON.stringify(x.replace(/"/g,"&quot;"))+'))'
          :           '(['+(n||i)+'])')).join('\n')
        + '\n' +
        edges.map(([a,b,c]) => a+(c ?' -':' .')+'-> '+b).join('\n')
      )
  }
}
fun()
