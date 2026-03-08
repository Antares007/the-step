export function words(continuation) {
  return function (c, rands, words) {
    continuation(c, [...rands, words], []);
  };
}
export function  register(continuation) {
  return function (c, rands, [word, ...words]) {
    if (typeof c.registers[word] !== "undefined")
      continuation(c, [...rands, word], words);
    else diagnostics(c, "expected register");
  };
}
export function number(continuation) {
  return function (c, rands, [word, ...words]) {
    const number = parseInt(word, 10);
    if (isNaN(number) === false) continuation(c, [...rands, number], words);
    else diagnostics(c, "expected immediate");
  };
}
