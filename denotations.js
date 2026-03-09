export function words(continuation) {
  return function (c, rands, words) {
    continuation(c, [...rands, words], []);
  };
}
export function  register(continuation) {
  return function (c, rands, [word, ...words]) {
    if (typeof c.registers[word] !== "undefined")
      continuation(c, [...rands, word], words);
    else c.diagnostics(c, "expected register", {
      "available register are": Object.keys(c.registers),
    });
  };
}
export function number(continuation) {
  return function (c, rands, [word, ...words]) {
    const number = parseInt(word, 10);
    if (isNaN(number) === false) continuation(c, [...rands, number], words);
    else c.diagnostics(c, "expected immediate");
  };
}
