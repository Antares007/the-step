bond = (o) ->
  n = {}
  for k, v of o
    n[k] = if typeof v is 'function' then v.bind(n) else v
  n
step = (fn, args...) ->
  setTimeout fn, 2000 >> 6, args...
  names = for a in args
    if typeof a.name is 'string' then a.name else JSON.stringify a
  console.log "#{fn.name}(#{names.join ', '})"

text = bond
  name  : 'tab'
  S     : (o) -> @T o
  T1    : (o) -> step o.tword, "T", "T3"
  T3    : (o) -> step o.tword, "T", "T0"
  T0    : (o) -> step o.tword, "T", "D"
  T     : (o) -> step o.block, "t", "A"
  A     : (o) -> step o.block, "a", "B"
  B     : (o) -> step o.block, "b", "D"
  D     : (o) -> step o.endot
# id ???

#map = (S, cb) ->
#  newSymbol = (o) ->
#    S bond
#      name  : 'inner observer'
#      endot : (    ) -> step o.endot
#      block : (x, r) ->
#        inner_cb = (n) -> step o.block, x.toUpperCase(), n
#        step map, r, inner_cb
#  step cb, newSymbol
#
#acb = (S) ->
#  step S, bond
#    name  : 'outer observer'
#    endot : () -> console.log 'end'
#    block : (x, r) -> step r, @; console.log JSON.stringify(x)
#
#step map, text.T, acb
map_cr =
bond
  name  : 'map_cr'
  S     : (text_space, sym, cb_cr) ->
    step cb_cr.S, bond
      u     : @
      name  : 'newSymbol_cr'
      S     : (o) ->
        step text_space[sym], bond
          u     : @
          name  : 'inner observer'
          endot : (    ) -> step o.endot
          block : (x, r) -> step @u.u.S, text_space, r, bond
            name  : 'inner_cb_cr'
            S     : (n) -> step o.block, x.toUpperCase(), n.S
step map_cr.S, text, "S", bond
  name  : 'acb_cr'
  S: (S) ->
    step S.S, bond
      name  : 'outer observer'
      endot : () -> console.log 'end'
      block : (x, r) -> step r, @; console.log JSON.stringify(x)
