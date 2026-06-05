import bnf_compiler from './bnf_compiler.js'
import open_diagram from './open_diagram.js'
import dsl from './dsl.js'
import toti from './toti.js'
import {expression, declarations} from './grammars.js'

const tab =    o => { o('t'), o('a'), o('b') }
const tritab = o => { o(tab, tab, tab)  }
const S =      o => { o('b'), o(S, 'a') }
const B =      o => { o('b'), o(A, 't') }
const A =      o => { o('a'), o(B, 'o') }

const grammar = dsl(S)
bnf_compiler(grammar)
open_diagram(grammar)

console.log()

const ტ = toti(grammar)
bnf_compiler(ტ)
open_diagram(ტ)
