const dot     = (o) => o[0]() 
const S_t1    = (o) => o[2]('b', dot)
const S_t22   = (o) => o[2]('a', dot)
const S_t2    = (o) => o[1](S, S_t22)
const S_s2    = (o) => o[1](dot, S_t2)
const S       = (o) => o[1](S_s2, S_t1)

const tab     = (o) => o[2]('t',
                (o) => o[2]('a',
                (o) => o[2]('b', dot)))

const tritab13= (o) => o[1](tab, dot)
const tritab12= (o) => o[1](tab, tritab13)
const tritab11= (o) => o[1](tab, tritab12)
const tritab  = (o) => o[1](dot, tritab11)

const alfz              = (o) => o[2]("z",               dot)
const alfy              = (o) => o[2]("y",               alfz)
const alfx              = (o) => o[2]("x",               alfy)
const alfw              = (o) => o[2]("w",               alfx)
const alfv              = (o) => o[2]("v",               alfw)
const alfu              = (o) => o[2]("u",               alfv)
const alft              = (o) => o[2]("t",               alfu)
const alfs              = (o) => o[2]("s",               alft)
const alfr              = (o) => o[2]("r",               alfs)
const alfq              = (o) => o[2]("q",               alfr)
const alfp              = (o) => o[2]("p",               alfq)
const alfo              = (o) => o[2]("o",               alfp)
const alfn              = (o) => o[2]("n",               alfo)
const alfm              = (o) => o[2]("m",               alfn)
const alfl              = (o) => o[2]("l",               alfm)
const alfk              = (o) => o[2]("k",               alfl)
const alfj              = (o) => o[2]("j",               alfk)
const alfi              = (o) => o[2]("i",               alfj)
const alfh              = (o) => o[2]("h",               alfi)
const alfg              = (o) => o[2]("g",               alfh)
const alff              = (o) => o[2]("f",               alfg)
const alfe              = (o) => o[2]("e",               alff)
const alfd              = (o) => o[2]("d",               alfe)
const alfc              = (o) => o[2]("c",               alfd)
const alfb              = (o) => o[2]("b",               alfc)
const alfa              = (o) => o[2]("a",               alfb)
const name_t1           = (o) => o[1](alfa,              dot)
const name_t2           = (o) => o[1](name,              name_t1)
const name_s2           = (o) => o[1](dot,               name_t2)
const name              = (o) => o[1](name_s2,           name_t1)
const quantifier3       = (o) => o[2]("*",               dot);
const quantifier2       = (o) => o[2]("+",               quantifier3);
const quantifier1       = (o) => o[2]("?",               quantifier2);
const quantifier        = (o) => o[2](" ",               quantifier1);
const space_char2       = (o) => o[2]("\n",              dot)
const space_char1       = (o) => o[2]("\t",              space_char2)
const space_char        = (o) => o[2](" ",               space_char1)
const sp_t1             = (o) => o[1](space_char,        dot)
const sp_t2             = (o) => o[1](sp,                sp_t1)
const sp_s2             = (o) => o[1](dot,               sp_t2)
const sp                = (o) => o[1](sp_s2,             sp_t1)
const primary_member_t1 = (o) => o[1](name,              dot)
const primary_member_t22= (o) => o[2]('\'',              dot)
const primary_member_t21= (o) => o[1](alfa,              primary_member_t22)
const primary_member_t2 = (o) => o[2]('\'',              primary_member_t21)
const primary_member_t34= (o) => o[2](')',               dot)
const primary_member_t33= (o) => o[1](sp,                primary_member_t34)
const primary_member_t32= (o) => o[1](productions,       primary_member_t33)
const primary_member_t31= (o) => o[1](sp,                primary_member_t32)
const primary_member_t3 = (o) => o[2]('(',               primary_member_t31)
const primary_member_s3 = (o) => o[1](dot,               primary_member_t3) 
const primary_member_s2 = (o) => o[1](primary_member_s3, primary_member_t2) 
const primary_member    = (o) => o[1](primary_member_s2, primary_member_t1)
const member_t11        = (o) => o[1](quantifier,        dot) 
const member_t1         = (o) => o[1](primary_member,    member_t11) 
const member            = (o) => o[1](dot,               member_t1)
const production_t1     = (o) => o[1](member,            dot)
const production_t21    = (o) => o[1](sp,                production_t1)
const production_t2     = (o) => o[1](production,        production_t21)
const production_s2     = (o) => o[1](dot,               production_t2)
const production        = (o) => o[1](production_s2,     production_t1)
const productions_t1    = (o) => o[1](production,        dot)
const productions_t23   = (o) => o[1](sp,                productions_t1)
const productions_t22   = (o) => o[2]('|',               productions_t23)
const productions_t21   = (o) => o[1](sp,                productions_t22)
const productions_t2    = (o) => o[1](productions,       productions_t21)
const productions_s2    = (o) => o[1](dot,               productions_t2)
const productions       = (o) => o[1](productions_s2,    productions_t1)
const declaration_t16   = (o) => o[2](';',               dot)
const declaration_t15   = (o) => o[1](sp,                declaration_t16)
const declaration_t14   = (o) => o[1](productions,       declaration_t15)
const declaration_t13   = (o) => o[1](sp,                declaration_t14)
const declaration_t12   = (o) => o[2](':',               declaration_t13)
const declaration_t11   = (o) => o[1](sp,                declaration_t12)
const declaration_t1    = (o) => o[1](name,              declaration_t11)
const declaration       = (o) => o[1](dot,               declaration_t1)
const declarations_t1   = (o) => o[1](declaration,       dot)
const declarations_t21  = (o) => o[1](sp,                declarations_t1)
const declarations_t2   = (o) => o[1](declarations,      declarations_t21)
const declarations_s2   = (o) => o[1](dot,               declarations_t2)
const declarations      = (o) => o[1](declarations_s2,   declarations_t1)

const write = (...args) => process.stdout.write(...args)
const symbols = [tab, tritab, S, declarations]
let        cs = 0
let      next = dot
const stm = (f,...args) => setTimeout(f, 200,...args)
const time = [
  (    ) => { write('.\n'), next(space) },
  (s, t) => { if(symbols.indexOf(s) === -1) symbols.push(s);
              write(' ' + symbols.indexOf(s)), stm(t, time); },
  (x, t) => { write(' ' + JSON.stringify(x)), stm(t, time); },
]
const space = [
  (    ) => { write(';\n');
              if(++cs < symbols.length)
                 console.log(cs), symbols[cs](space); },
  (s, t) => { write('  '), next = s, stm(t, time); },
  (x, s) => { write('  ' + JSON.stringify(x) + '.\n'), stm(s, space); },
]
console.log(cs), symbols[cs](space)

//console.log('// ' + Object.keys(symbols).join(', '))

//const gram = `
//alfa
//  'a'
//  'b'
//  'c'
//  'd'
//  'e'
//  'f'
//  'g'
//  'h'
//  'i'
//  'j'
//  'k'
//  'l'
//  'm'
//  'n'
//  'o'
//  'p'
//  'q'
//  'r'
//  's'
//  't'
//  'u'
//  'v'
//  'w'
//  'x'
//  'y'
//  'z'
//name
//  alfa
//  name alfa
//quantifier
//  '?'
//  '+'
//  '*'
//  ' '
//space_char
//  ' '
//  '\t'
//  '\n'
//sp
//  space_char
//  sp space_char
//primary_member
//  name
//  '\'' alfa '\''
//  '(' sp productions sp ')'
//member
//  primary_member quantifier
//production
//  member
//  production sp member
//productions
//  production
//  productions sp '|' sp production
//declaration
//  name sp ':' sp productions sp ';'
//declarations
//  declaration
//  declarations sp declaration
//`.split('\n').map(l => 1 < l.length && l[0] === ' ' && l[1] === ' ' ? '\t' +l.trim(): l.trim()).filter(Boolean).join('\n')
//// expr   : add ;
//// add    : mul (('+'|'-') mul)* ;
//// mul    : atom (('*'|'/') atom)* ;
//// atom   : INT | '(' expr ')' ;
//// n1 m11 m12 | m21 m22 ;
//// n2 m11 m12 | m21 m22 ;
////
//
//const print_bnf = [
//  () => write('.\n'),
//  (lhs) => write(lhs + ' →'),
//  (rhs) => write(' ' + rhs),
//  () => {},
//]
////bnf(tritab)(print_bnf)
////bnf(S)(print_bnf)
//const map = {}
//let cur = '';
//bnf(declarations)([
//  () => {},
//  (lhs) => {
//    if (map[lhs]) {
//      map[lhs].push([])
//    } else {
//      map[lhs] = [[]];
//    }
//    cur = lhs;
//  },
//  (rhs) => map[cur][map[cur].length-1].push(rhs),
//  () => {},
//])
//console.log(
//  Object.keys(map).map(n => 
//    n +'\n' + map[n].map(p => '  ' + p.join(' ')).join('\n')
//  ).join('\n')
//)
//
//
//// The stabilizer: wraps recursion in a map to prevent infinite loops,
//// identifying cycles in the "soul."
//const SpaceTime = (S) => {
//  const Space = (S, d) =>
//    d.has(S) ? dot : d.set(S, {
//      [S.name]: o => S([
//        o[0],
//        (s, t) => o[1](Space(s, d), Time(t, d)),
//        (x, s) => o[2](x, Space(s, d)),
//      ])
//    }[S.name]).get(S)
//  const Time = (S, d) =>
//    d.has(S) ? dot : d.set(S, {
//      [S.name]: o => S([
//        o[0],
//        (s, t) => o[1](Space(s, new Map()), Time(t, d)),
//        (x, t) => o[2](x, Time(t, d)),
//      ])
//    }[S.name]).get(S)
//  return Space(S, new Map())
//}
//
//// unified space time structure into
//// Backus-Naur Form for human observation.
//function bnf(S, d = new Map()) {
//  return o => {
//    if(d.has(S)) return o[3]()
//    d.set(S)
//    const space = [
//      (    ) => o[3](),
//      (s, t) => (o[1](S.name), t(time), s(space)),
//      (x, s) => (o[1](S.name), o[2](JSON.stringify(x)), o[0](), s(space)),
//    ]
//    const time  = [
//      (    ) => o[0](),
//      (s, t) => (o[2](s.name), t(time), bnf(s, d)(o)),
//      (x, t) => (o[2](JSON.stringify(x)), t(time)),
//    ]
//    S(space)
//  }
//}
