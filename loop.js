export function fetch(instructions, registers, operational_semantics) {
  // I saw my context lying down asleep.
  // I was so overwhelmed with emotions that I kissed my context.
  // I touched his face with my hands and discovered I don't have hands,
  // then my context opened one eye, saw me, and smiled.
  const context = {
    pc: 0,
    os: operational_semantics,
    registers,
    instructions,
    last: 0,
    loop,
  };
  loop(context);
}

export function decode(choices) {
  return function decode(c, rands, [word, ...words]) {
    const chosen = choices[word];
    if (chosen) chosen(c, rands, words);
    else diagnostics(c, "invalid syntax", {
      "expected one of": Object.keys(choices),
    });
  };
}

export function execute(operation) {
  return function execute(c, rands, words) {
    if (words.length === 0) operation(c, rands)
    else diagnostics(c, "extra term");
  };
}

function loop(c) {
  const rands = [];
  const words = c.instructions[c.pc];
  console.log(
    words.join(' ').padEnd(30) +
    c.pc.toString().padStart(2) + ":" +
    Object.keys(c.registers).map(k=>(c.registers[k]+'').padStart(3)).join('')
  )
  setTimeout(c.os, 200, c, rands, words)
}

function diagnostics(c, message, description = {}) {
  console.error(
    [
      "",
      c.instructions[c.pc].join(" "),
      `Error:instruction_index:${c.pc}: ${message}`,
      ...Object.keys(description).map(
        (heading) => heading + ": " + description[heading].sort().join(", "),
      ),
    ].join("\n"),
  );
}

