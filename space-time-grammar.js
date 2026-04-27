const dot     = (d,t,b) => d() 
const S_t1    = (d,t,b) => t('b', dot)
const S_t22   = (d,t,b) => t('a', dot)
const S_t2    = (d,t,b) => b(S, S_t22)
const S_s2    = (d,t,b) => b(dot, S_t2)
const S       = (d,t,b) => b(S_s2, S_t1)

const tab     = (d,t,b) => t('t',
                (d,t,b) => t('a',
                (d,t,b) => t('b', dot)))

const tritab13= (d,t,b) => b(tab, dot)
const tritab12= (d,t,b) => b(tab, tritab13)
const tritab11= (d,t,b) => b(tab, tritab12)
const tritab  = (d,t,b) => b(dot, tritab11)

const alfz = (d,t,b) => t("z",               dot)
const alfy = (d,t,b) => t("y",               alfz)
const alfx = (d,t,b) => t("x",               alfy)
const alfw = (d,t,b) => t("w",               alfx)
const alfv = (d,t,b) => t("v",               alfw)
const alfu = (d,t,b) => t("u",               alfv)
const alft = (d,t,b) => t("t",               alfu)
const alfs = (d,t,b) => t("s",               alft)
const alfr = (d,t,b) => t("r",               alfs)
const alfq = (d,t,b) => t("q",               alfr)
const alfp = (d,t,b) => t("p",               alfq)
const alfo = (d,t,b) => t("o",               alfp)
const alfn = (d,t,b) => t("n",               alfo)
const alfm = (d,t,b) => t("m",               alfn)
const alfl = (d,t,b) => t("l",               alfm)
const alfk = (d,t,b) => t("k",               alfl)
const alfj = (d,t,b) => t("j",               alfk)
const alfi = (d,t,b) => t("i",               alfj)
const alfh = (d,t,b) => t("h",               alfi)
const alfg = (d,t,b) => t("g",               alfh)
const alff = (d,t,b) => t("f",               alfg)
const alfe = (d,t,b) => t("e",               alff)
const alfd = (d,t,b) => t("d",               alfe)
const alfc = (d,t,b) => t("c",               alfd)
const alfb = (d,t,b) => t("b",               alfc)
const alfa = (d,t,b) => t("a",               alfb)

const name_t1 = (d,t,b) => b(alfa,              dot)
const name_t2 = (d,t,b) => b(name,              name_t1)
const name_s2 = (d,t,b) => b(dot,               name_t2)
const name    = (d,t,b) => b(name_s2,           name_t1)

const quantifier3 = (d,t,b) => t("*",               dot);
const quantifier2 = (d,t,b) => t("+",               quantifier3);
const quantifier1 = (d,t,b) => t("?",               quantifier2);
const quantifier  = (d,t,b) => t(" ",               quantifier1);

const space_char2 = (d,t,b) => t("\n",              dot)
const space_char1 = (d,t,b) => t("\t",              space_char2)
const space_char  = (d,t,b) => t(" ",               space_char1)

const sp_t1 = (d,t,b) => b(space_char,        dot)
const sp_t2 = (d,t,b) => b(sp,                sp_t1)
const sp_s2 = (d,t,b) => b(dot,               sp_t2)
const sp    = (d,t,b) => b(sp_s2,             sp_t1)

const primary_member_t1 = (d,t,b) => b(name,              dot)
const primary_member_t22= (d,t,b) => t('\'',              dot)
const primary_member_t21= (d,t,b) => b(alfa,              primary_member_t22)
const primary_member_t2 = (d,t,b) => t('\'',              primary_member_t21)
const primary_member_t34= (d,t,b) => t(')',               dot)
const primary_member_t33= (d,t,b) => b(sp,                primary_member_t34)
const primary_member_t32= (d,t,b) => b(productions,       primary_member_t33)
const primary_member_t31= (d,t,b) => b(sp,                primary_member_t32)
const primary_member_t3 = (d,t,b) => t('(',               primary_member_t31)
const primary_member_s3 = (d,t,b) => b(dot,               primary_member_t3) 
const primary_member_s2 = (d,t,b) => b(primary_member_s3, primary_member_t2) 
const primary_member    = (d,t,b) => b(primary_member_s2, primary_member_t1)

const member_t11 = (d,t,b) => b(quantifier,        dot) 
const member_t1  = (d,t,b) => b(primary_member,    member_t11) 
const member     = (d,t,b) => b(dot,               member_t1)

const production_t1  = (d,t,b) => b(member,            dot)
const production_t21 = (d,t,b) => b(sp,                production_t1)
const production_t2  = (d,t,b) => b(production,        production_t21)
const production_s2  = (d,t,b) => b(dot,               production_t2)
const production     = (d,t,b) => b(production_s2,     production_t1)

const productions_t1  = (d,t,b) => b(production,        dot)
const productions_t23 = (d,t,b) => b(sp,                productions_t1)
const productions_t22 = (d,t,b) => t('|',               productions_t23)
const productions_t21 = (d,t,b) => b(sp,                productions_t22)
const productions_t2  = (d,t,b) => b(productions,       productions_t21)
const productions_s2  = (d,t,b) => b(dot,               productions_t2)
const productions     = (d,t,b) => b(productions_s2,    productions_t1)

const declaration_t14 = (d,t,b) => t(';',               dot)
const declaration_t13 = (d,t,b) => b(sp,                declaration_t14)
const declaration_t12 = (d,t,b) => b(productions,       declaration_t13)
const declaration_t11 = (d,t,b) => b(sp,                declaration_t12)
const declaration_t1  = (d,t,b) => b(name,              declaration_t11)
const declaration     = (d,t,b) => b(dot,               declaration_t1)

const declarations_t1  = (d,t,b) => b(declaration,       dot)
const declarations_t21 = (d,t,b) => b(sp,                declarations_t1)
const declarations_t2  = (d,t,b) => b(declarations,      declarations_t21)
const declarations_s2  = (d,t,b) => b(dot,               declarations_t2)
const declarations     = (d,t,b) => b(declarations_s2,   declarations_t1)

bnf_compiler(S, tritab, declarations);

function bnf_compiler(...symbols) {
  const write = (...args) => process.stdout.write(...args)
  let cs = 0
  let next = dot

  fetch()

  function time_dot       (   ) { write('\n'), space(next) }
  function time_terminal  (x,t) { write(JSON.stringify(x) + ' '), time(t) }
  function time_branch    (s,t) { if(symbols.indexOf(s) === -1) symbols.push(s)
                                  write(s.name + ' '), time(t) }
  function space_dot      (   ) { fetch() }
  function space_terminal (x,s) { write('  ' + JSON.stringify(x) + '\n'), space(s) }
  function space_branch   (s,t) { write('  '), next = s, time(t) }

  function time (s) { s(time_dot, time_terminal, time_branch) }
  function space(s) { s(space_dot, space_terminal, space_branch) }

  function fetch() {
    if(cs < symbols.length) 
      next = symbols[cs++], write(next.name + '\n'), space(next)
  }
}
