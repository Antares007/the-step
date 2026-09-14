function dot    (o, l) { o.dot  (o, l           ) }
function tab2   (o, l) { o.block(o, l, 'b', dot ) }
function tab1   (o, l) { o.block(o, l, 'a', tab2) }
function tab    (o, l) { o.block(o, l, 't', tab1) }

function tritab3(o, l) { o.tword(o, l, tab, dot    ) }
function tritab2(o, l) { o.tword(o, l, tab, tritab3) }
function tritab1(o, l) { o.tword(o, l, tab, tritab2) }
function tritab (o, l) { o.tword(o, l, dot, tritab1) }

const goto = (t) => (...o) => setTimeout(t, 1000, ...o)
tab({
  dot  (o, l      ) { console.log('o'); goto(l)(o, dot); },
  block(o, l, x, u) { console.log(x);   goto(u)(o, (o, l2) => o.block(o, l2, x, l)); }
}, dot)
