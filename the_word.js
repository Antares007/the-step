/* By an “aggregate” (Menge) we are to understand any collection
into a whole (Zusammenfassung zu einem Ganzen) M of definite and
separate objects m of our intuition or our thought. These objects are called the “elements” of M. */

/* Text constructed in single dimension as a whole "aggregate" */
var T, W, O, R, D, distinct, oB, oBi, oD, oDi, oT, oTi
T = (c, d, b, t) => t(c, W, O)
W = (c, d, b, t) => t(c, D, O)
O = (c, d, b, t) => b(c, 'o', R)
R = (c, d, b, t) => b(c, 'r', D)
D = (c, d, b, t) => d(c)

// Observer
oD = (c) => 'm = ' + c.join('')
oB = (c, m, real) => real([...c, m], oD, oB)
oT = () => { /* let's defer this */ }

// Observe
console.log(O([], oD, oB))

/* O([], oD, oB)
= oB([], 'o', R)
= R(['o'], oD, oB)
= oB(['o'], 'r', D)
= D(['o','r'], oD, oB)
= oD(['o','r'])
= 'm = ' + ['o','r'].join('')
= 'm = or' */







// Imaginary observer
oDi = (c) => 'M = {' + distinct(c).join(', ') + '}'
oBi = () => { /* let's defer this */ }
oTi = (c, imaginary, real) =>
  imaginary([...c, real([], oD, oB, oT)], oDi, oBi, oTi)

// Imagine 
distinct = (a) => a.filter((x, i) => a.indexOf(x) === i)
console.log(T([], oDi, oBi, oTi));

/* T([], oDi, oBi, oTi)
= oTi([], W, O)
= W([...[], O([], oD, oB, oT)], oDi, oBi, oTi)

We already observed that: O([], oD, oB, oT) = 'm = or'
= W([...[], 'm = or'], oDi, oBi, oTi)
= W(['m = or'], oDi, oBi, oTi)
= oTi(['m = or'], D, O)
= D([...['m = or'], O([], oD, oB, oT)], oDi, oBi, oTi)

Same substitution: O([], oD, oB, oT) = 'm = or'
= D(['m = or', 'm = or'], oDi, oBi, oTi)
= oDi(['m = or', 'm = or'])
= 'M = {' + distinct(['m = or','m = or']).join(', ') + '}'
= 'M = {m = or}' */
