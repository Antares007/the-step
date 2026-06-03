import open_diagram from './open_diagram.js'
import bnf_compiler from './bnf_compiler.js'
import dsl from './dsl.js'
import toti from './toti.js'
import {expression, declarations} from './grammars.js'

const tab =    o => { o('t'), o('a'), o('b') }
const tritab = o => { o(tab, tab, tab, S) }
const S =      o => (o(B), o(S, A))
const B =      o => (o('b'), o(A, 't'))
const A =      o => (o('a'), o(B, 'o'))

const grammar = dsl(tritab)
bnf_compiler(grammar)
open_diagram(grammar)
// https://tinyurl.com/2e6cb8sm

console.log()

const ტ = toti(grammar)
bnf_compiler(ტ)
open_diagram(ტ)
// https://tinyurl.com/yswxfwxw 
