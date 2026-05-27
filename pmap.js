export default (t, _ = Symbol()) => (S, ...a) => S[_] || (S[_] = t(S, ...a))

