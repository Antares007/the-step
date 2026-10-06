{ SI, step, space } = require './step'

text = space 'text space',
  T1    : (o) -> step SI(o, 'tword'), SI(@, 'T'), SI(@, 'T3')
  T3    : (o) -> step SI(o, 'tword'), SI(@, 'T'), SI(@, 'T0')
  T0    : (o) -> step SI(o, 'tword'), SI(@, 'T'), SI(@, 'D')
  T     : (o) -> step SI(o, 'block'), 't',        SI(@, 'A')
  A     : (o) -> step SI(o, 'block'), 'a',        SI(@, 'B')
  B     : (o) -> step SI(o, 'block'), 'b',        SI(@, 'D')
  D     : (o) -> step SI(o, 'endot')

map = space 'mapping space',
  Red   : (si, cb_si) ->
    index = "Red #{si[0].name} #{si[1]}"
    @[index] ?= (os) =>
      step si, space 'inner observer',
        endot : (    ) -> step SI(os, 'endot')
        block : (x, r) =>
          s = space 'inner block cb',
            cb    : (si  ) -> step SI(os, 'block'), x, si
          step SI(@, 'Red'), r, SI(s, 'cb')
        tword : (i, r) =>
          s = space 'inner tword cb imaginary',
            cb    : (i_si  ) =>
              s = space 'inner tword cb real',
                cb    : (r_si  ) ->
                  step SI(os, 'tword'), i_si, r_si
              step SI(@, 'Red'), r, SI(s, 'cb')
          step SI(@, 'Red'), i, SI(s, 'cb')
    step cb_si, SI(@, index)

s = space 's',
  i: (si) ->
    step si, space 'outer observer',
        endot : (    ) -> console.log 'end'; console.log map
        block : (x, r) -> step r, @; console.log JSON.stringify(x)
        tword : (i, r) -> step i, @

step SI(map, 'Red'), SI(text, 'T0'), SI(s, 'i')
