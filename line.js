function dot    (d,b,t,i, l) { step(d)(d,b,t,i, l           ) }
function tab2   (d,b,t,i, l) { step(b)(d,b,t,i, l, 'b', dot ) }
function tab1   (d,b,t,i, l) { step(b)(d,b,t,i, l, 'a', tab2) }
function tab    (d,b,t,i, l) { step(b)(d,b,t,i, l, 't', tab1) }
function tritab3(d,b,t,i, l) { step(t)(d,b,t,i, l, tab, dot    ) }
function tritab2(d,b,t,i, l) { step(t)(d,b,t,i, l, tab, tritab3) }
function tritab1(d,b,t,i, l) { step(t)(d,b,t,i, l, tab, tritab2) }
function tritab (d,b,t,i, l) { step(t)(d,b,t,i, l, dot, tritab1) }

const step =
  (t) =>
  (...o) =>
    setTimeout(
      (...args) => (
        console.log(
          t.name.padStart(10) +
            "(" +
            args.map((x) => (typeof x === "function" ? x.name : x).toString().padStart(4)).join(", ") +
            ")",
        ),
        t(...args)
      ),
      1000,
      ...o,
    )

step(tab)(
  function D(d, b, t, i, l) {
    step(l)(d, b, t, i, dot)
  },
  function B(d, b, t, i, l, x, u) {
    const n = ("s" + i)
    const s = {
      [n]: (d, b, t, i, l2) => step(b)(d, b, t, i, l2, x, l),
    }[n]
    step(u)(d, b, t, i + 1, s)
  },
  0,
  0,
  dot,
)
