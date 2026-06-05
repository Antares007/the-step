const awrite = c => (s) => process.stdout.write(`\x1b[${c}m${s}\x1b[0m`)
const write = (s, q) => awrite(30+(q|0))(s)
const name = (c,s) => c.symbols.indexOf(s) + ""

const iotD= (c,       q) => c.next(c, os)
const otB = (c, x, t, q) => (write(JSON.stringify(x), q), t(c, it))
const otT = (c, s, t, q) => { if(c.symbols.indexOf(s) === -1)
                                (c.symbols.push(s), c.symbols_color.push(q))
                              write(name(c, s), q), t(c, it) }
const itB = (c, x, t, q) => (write(' ', q), otB(c, x, t, q))
const itT = (c, s, t, q) => (write(' ', q), otT(c, s, t, q))

const iosD= (c,       q) => (write('\n', q), fetch(c))
const iosB= (c, x, s, q) => (write(JSON.stringify(x), q), s(c, os))
const iosT= (c, s, t, q) => (c.next = s, t(c, ot))

const osB = (c, x, s, q) => (write(' → ' , q), iosB(c, x, s, q))
const osT = (c, s, t, q) => (write(' → ' , q), iosT(c, s, t, q))
const isB = (c, x, s, q) => (write(' | ',  q), iosB(c, x, s, q))
const isT = (c, s, t, q) => (write(' | ',  q), iosT(c, s, t, q))

const ot = [iotD,  otB, otT]
const it = [iotD,  itB, itT]
const is = [iosD,  osB, osT]
const os = [iosD,  isB, isT]

function fetch(c) {
  if(c.cs < c.symbols.length)
    c.next = c.symbols[c.cs],
      write(name(c, c.next),
        c.symbols_color[c.cs++]),
    c.next(c, is)
}
export default function bnf_compiler(...symbols) {
  fetch({
    symbols,
    symbols_color: symbols.map(_ => 0),
    cs: 0,
  })
}
