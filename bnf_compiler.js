export default function bnf_compiler(...symbols) {
  const symbols_color = symbols.map(_ => 0)
  const ansi = c => (s) => write_(`\x1b[${c}m${s}\x1b[0m`)
  const write_ = (s) => process.stdout.write(s)
  const write = (s, q) => ansi(30+(q|0))(s)
  let cs = 0
  let next = d => d()
  const name = s => symbols.indexOf(s) + ""

  const iotD= (      q) =>  os(next)
  const otB = (x, t, q) =>  (write(JSON.stringify(x), q), it(t))
  const otT = (s, t, q) =>  { if(symbols.indexOf(s) === -1)
                                (symbols.push(s), symbols_color.push(q))
                              write(name(s), q), it(t) }
  const itB = (x, t, q) =>  (write(' ', q), otB(x, t, q))
  const itT = (s, t, q) =>  (write(' ', q), otT(s, t, q))

  const iosD= (      q) =>  (write('\n', q), fetch())
  const iosB= (x, s, q) =>  (write(JSON.stringify(x), q), os(s))
  const iosT= (s, t, q) =>  (next = s, ot(t))

  const osB = (x, s, q) =>  (write(' → ' , q), iosB(x, s, q))
  const osT = (s, t, q) =>  (write(' → ' , q), iosT(s, t, q))
  const isB = (x, s, q) =>  (write(' | ', q), iosB(x, s, q))
  const isT = (s, t, q) =>  (write(' | ', q), iosT(s, t, q))

  const ot = (s) => s(iotD,  otB, otT)
  const it = (s) => s(iotD,  itB, itT)
  const is = (s) => s(iosD,  osB, osT)
  const os = (s) => s(iosD,  isB, isT)

  fetch()
  function fetch() {
    if(cs < symbols.length) 
      next = symbols[cs], write(name(next), symbols_color[cs++]), is(next)
  }
}
