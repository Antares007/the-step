function dot (o, l) { o.dot  (o, l           ) }
function tab2(o, l) { o.block(o, l, 'b', dot ) }
function tab1(o, l) { o.block(o, l, 'a', tab2) }
function tab (o, l) { o.block(o, l, 't', tab1) }
function call(f, ...args) { setTimeout(f, 1000, ...args) }
tab({
  dot  (o, l      ) { console.log('o'); call(l, o, dot); },
  block(o, l, x, u) { console.log(x); call(u, o, (o, l2) => o.block(o, l2, x, l)); }
}, dot)
