export default function bnf_compiler(...symbols) {
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
