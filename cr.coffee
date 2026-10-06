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

text = space 'text space',
  T1    : (o) -> step SI(o, 'tword'), SI(text, 'T'), SI(text, 'T3')
  T3    : (o) -> step SI(o, 'tword'), SI(text, 'T'), SI(text, 'T0')
  T0    : (o) -> step SI(o, 'tword'), SI(text, 'T'), SI(text, 'D')
  T     : (o) -> step SI(o, 'block'), 't',           SI(text, 'A')
  A     : (o) -> step SI(o, 'block'), 'a',           SI(text, 'B')
  B     : (o) -> step SI(o, 'block'), 'b',           SI(text, 'D')
  D     : (o) -> step SI(o, 'endot')

map = space 'mapping space',
  Red   : (si, cb_si) ->
    index = "Red #{si[0].name} #{si[1]}"
    @[index] ?= (os) ->
      step si, space 'inner observer',
        endot : (    ) -> step SI(os, 'endot')
        block : (x, r) ->
          s = space 'inner block cb',
            cb    : (si  ) -> step SI(os, 'block'), x, si
          step SI(map, 'Red'), r, SI(s, 'cb')
        tword : (i, r) ->
          s = space 'inner tword cb imaginary',
            cb    : (i_si  ) ->
              s = space 'inner tword cb real',
                cb    : (r_si  ) ->
                  step SI(os, 'tword'), i_si, r_si
              step SI(map, 'Red'), r, SI(s, 'cb')
          step SI(map, 'Red'), i, SI(s, 'cb')
    step cb_si, SI(@, index)

s = space 's',
  i: (si) ->
    step si, space 'outer observer',
        endot : (    ) -> console.log 'end'; console.log map
        block : (x, r) -> step r, @; console.log JSON.stringify(x)
        tword : (i, r) -> step i, @

step SI(map, 'Red'), SI(text, 'T0'), SI(s, 'i')
