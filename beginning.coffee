SI = (index, space) ->
  si = [space, index]
  si.name = "SI(#{index}, #{space.name})"
  si

step = (si, args...) ->
  [space, index] = si
  setTimeout (-> space[index] args...), 2000 >> 6
  console.log "#{si.name}(#{(a.name ? JSON.stringify a for a in args).join ', '})"

space = ((c) -> (n, s) ->
  s.name = n + ((c[n] ?= 0) or "")
  c[n]++
  s)({})

s = space 'text',
  B : (o) -> step SI('begin', o),                  SI('A', @)
  A : (o) -> step SI('block', o), SI('B', @), 'a', SI('T', @)
  T : (o) -> step SI('block', o), SI('A', @), 't', SI('O', @)
  O : (o) -> step SI('endot', o), SI('T', @)

map = space 'map',
  Red   : (si, cb) ->
    index = "Red #{si.name}"
    @[index] ?= (o) ->
      Red    = SI('Red', @)
      map    = @
      step si, space 'inner observer',

        begin : (   r) ->
          step Red, r, SI 'cb', space 'begin cb',
            cb: (r) => (map[index] = (o) -> step SI('begin', o), r) o

        endot : (l   ) ->
          step Red, l, SI 'cb', space 'endot cb',
            cb: (l) => (map[index] = (o) -> step SI('endot', o), l) o

        block : (l, x, r) ->
          step Red, r, SI 'cb', space 'block cb r',
            cb: (r) ->
              step Red, l, SI 'cb', space 'block cb l',
                cb: (l) ->
                  X = x.toUpperCase()
                  (map[index] = (o) -> step SI('block', o), l, X, r) o

    step cb, SI(index, @)
i = 0
right = space 'Red',
  begin : (r      ) -> step r, @
  block : (l, x, r) -> step r, @; console.log x
  endot : (l      ) -> step l, left
left  = space 'Maroon',
  begin : (r      ) -> if i++ < 10 then step r, right else console.log map
  block : (l, x, r) -> step l, @; console.log x
  endot : (l      ) -> step l, @
step SI('Red', map), SI('B', s), SI 'cb', space 'outer cb',
  cb: (s) -> step s, right
