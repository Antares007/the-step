SI  = (space, index) ->
  si = [space, index]
  si.name = "'#{space.name}'[#{index}]"
  si

step = ([space, index], args...) ->
  setTimeout (-> space[index] args...), 2000 >> 6
  console.log "'#{space.name}'[#{index}](#{(a.name ? JSON.stringify a for a in args).join ', '})"

space = ((c) -> (n, s) ->
  s.name = n + ((c[n] ?= 0) or "")
  c[n]++
  s)({})

module.exports = { SI, step, space }
