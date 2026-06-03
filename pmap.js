export default (t, _ = Symbol()) => (S, ...a) => S[_] || (S[_] = 0, S[_] = t(S, ...a))

