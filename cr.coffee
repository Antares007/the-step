SI  = (space, index) ->
  si = [space, index]
  si.name = "'#{space.name}'[#{index}]"
  si
step = ([space, index], args...) ->
  setTimeout (-> space[index] args...), 2000 >> 6
  console.log "'#{space.name}'[#{index}](#{(a.name ? JSON.stringify a for a in args).join ', '})"

text =
  name  : 'text space'
  T1    : (o) -> step SI(o, 'tword'), 'T', SI(text, 'T3')
  T3    : (o) -> step SI(o, 'tword'), 'T', SI(text, 'T0')
  T0    : (o) -> step SI(o, 'tword'), 'T', SI(text, 'D')
  T     : (o) -> step SI(o, 'block'), 't', SI(text, 'A')
  A     : (o) -> step SI(o, 'block'), 'a', SI(text, 'B')
  B     : (o) -> step SI(o, 'block'), 'b', SI(text, 'D')
  D     : (o) -> step SI(o, 'endot')

map =
  name  : 'mapping space'
  text  : text
  Red   : (index, cb_si) ->
    @[index] = (os) ->
      inner_observer_space =
        name  : 'inner observer'
        endot : (    ) -> step SI(os, 'endot')
        block : (x, r) ->
          s =
            name  : 'inner cb'
            cb    : (si  ) -> step SI(os, 'block'), x.toUpperCase(), si
          step SI(map, 'Red'), r[1], SI(s, 'cb')
      step SI(@text, index), inner_observer_space
    step cb_si, SI(@, index)

s =
  name: 's'
  i: (si) ->
    step si,
        name  : 'outer observer'
        endot : (    ) -> console.log 'end'
        block : (x, r) -> step r, @; console.log JSON.stringify(x)
step SI(map, 'Red'), 'T', SI(s, 'i')
