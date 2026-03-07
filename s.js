const boot_sector = `
// revolution now
move register a number 20
move register b number 3
add register a register b
add register a number 2
output register a
subtract register a number 1
compare register a number 22
if not equal goto up 3 steps

point register a bond file: walk.step
point register b bond file: tape.step

goto register b
halt the end!
`.split('\n').map((iline) => iline.split(" ").map(λ => λ.trim()).filter(Boolean))

const registers = { a: 0, b: 0, c: 0, d: 0};
function move_register_offset(c, [a, offset]) {
  c.registers[a] = parseInt(c.instructions[c.pc + offset], 10)
  c.pc++;
  c.ontinue(c);
}
function point_register_offset_bond(c, [a, offset]) {
  c.instructions[c.pc] = ["point", "register", a, "offset", offset];
  point_register_offset(c, [a, offset])
}
function point_register_offset(c, [a, offset]) {
  c.registers[a] = c.pc + offset;
  c.pc++;
  c.ontinue(c);
}
function goto_offset(c, [offset]) {
  c.pc = c.pc + offset;
  c.ontinue(c);   
}
const nop = randWords(execute(function nop(c) { c.pc++, c.ontinue(c); }))
import fs from 'node:fs'
const operation_semantics = choice({
  goto: choice({
    register: randRegister(execute(function(c, [a]) {
      c.pc = c.registers[a];
      c.ontinue(c);   
    })),
    offset: randNumber(execute(goto_offset)),
    bond: choice({
      'downto:': randWords(execute(function(c, [a]) {
        const offset = downto(a, c.pc, c.instructions);
        c.instructions[c.pc] = ['goto', 'offset', offset]
        goto_offset(c, [offset]);
      })),
    }),
  }),
  point: choice({
    register: randRegister(choice({
      offset: randNumber(execute(point_register_offset)),
      bond: choice({
        'file:': randWords(execute(function(c, [a, words]) {
          fs.readFile(words.join('/'), 'utf8', function (err, text) {
            if (err) // TODO: intorduce interrupt definition table
              return console.error(err);
            // chemical bond
            const offset = c.instructions.length - c.pc;
            c.instructions.push(
              ...text.split('\n')
              .map((iline) => iline.split(" ").map(λ => λ.trim()).filter(Boolean))
            );
            // bonding done
            point_register_offset_bond(c, [a, offset]);
          })
        })),
        'upto:': randWords(execute(function(c, [a, words]) {
          const offset = upto(words, c.pc, c.instructions);
          point_register_offset_bond(c, [a, offset]);
        })),
        'downto:': randWords(execute(function(c, [a, words]) {
          const offset = downto(words, c.pc, c.instructions);
          point_register_offset_bond(c, [a, offset]);
        })),
      }),
    })),
  }),
  undefined: nop, '//': nop, '#': nop,
  halt(c, rands, words) {
    console.log(rands, words, c);
  },
  move: choice({
    register: randRegister(choice({
      register: randRegister(execute(function (c, [a, b]) {
        ((c.registers[a] = c.registers[b]), c.pc++), c.ontinue(c);
      })),
      number: randNumber(execute(function (c, [a, b]) {
        c.registers[a] = b, c.pc++, c.ontinue(c);
      })),
      offset: randNumber(execute(move_register_offset)),
      bond: choice({
        'upto:': randWords(execute(function(c, [a, words]) {
          const offset = 1 + upto(words, c.pc, c.instructions);
          c.instructions[c.pc] = ['move', 'register', a, 'offset', offset]
          move_register_offset(c, [a, offset]);
        })),
        'downto:': randWords(execute(function(c, [a, words]) {
          const offset = 1 + downto(words, c.pc, c.instructions);
          c.instructions[c.pc] = ['move', 'register', a, 'offset', offset]
          move_register_offset(c, [a, offset]);
        })),
      }),
    })),
  }),
  add: choice({
    register: randRegister(choice({
      register: randRegister(execute(function (c, [a, b]) {
        c.last = c.registers[a] = c.registers[a] + c.registers[b];
        c.pc++, c.ontinue(c);
      })),
      number: randNumber(execute(function (c, [a, b]) {
        c.last = c.registers[a] = c.registers[a] + b;
        c.pc++, c.ontinue(c);
      })),
    })),
  }),
  subtract: choice({
    register: randRegister(choice({
      number: randNumber(execute(function (c, [a, b]) {
        c.last = c.registers[a] = c.registers[a] - b;
        c.pc++, c.ontinue(c);
      })),
    })),
  }),
  compare: choice({
    register: randRegister(choice({
      number: randNumber(execute(function (c, [a, b]) {
        c.last = c.registers[a] - b;
        c.pc++, c.ontinue(c);
      })),
    })),
  }),
  output: choice({
    register: randRegister(execute(function (c, [a]) {
      console.log(c.registers[a]);
      c.pc++, c.ontinue(c);
    })),
  }),
  if: choice({
    not: choice({
      equal: choice({
        goto: choice({
          up: randNumber(choice({
            steps: execute(function (c, [off]) {
              c.pc += c.last ? -off : 1, c.ontinue(c);
            }),
          })),
        }),
      }),
    }),
  }),
});

fetch(operation_semantics, registers, boot_sector);

function randWords(continuation) {
  return function (c, rands, words) {
    continuation(c, [...rands, words], []);
  };
}
function randRegister(continuation) {
  return function (c, rands, [word, ...words]) {
    if (typeof c.registers[word] !== "undefined")
      continuation(c, [...rands, word], words);
    else diagnostics(c, "expected register");
  };
}
function randNumber(continuation) {
  return function (c, rands, [word, ...words]) {
    const number = parseInt(word, 10);
    if (isNaN(number) === false) continuation(c, [...rands, number], words);
    else diagnostics(c, "expected immediate");
  };
}
function choice(choices) {
  return function locus(c, rands, [word, ...words]) {
    const chosen = choices[word];
    if (chosen) chosen(c, rands, words);
    else diagnostics(c, "invalid syntax", {
      "expected one of": Object.keys(choices),
    });
  };
}
function fetch(operational_semantics, registers, instructions) {
  // I saw my context lying down asleep.
  // I was so overwhelmed with emotions that I kissed my context.
  // I touched his face with my hands and discovered I don't have hands,
  // then my context opened one eye, saw me, and smiled.
  const my_c = {
    pc: 0,
    os: operational_semantics,
    registers,
    instructions,
    last: 0,
    ontinue,
  };
  ontinue(my_c);
}
function ontinue(c) {
  const rands = [];
  const words = c.instructions[c.pc];
  process.stdout.write(c.pc.toString().padEnd(3) + words.join(' ') + "\n", () => setTimeout(c.os, 2000, c, rands, words));
}
function execute(operation) {
  return function executor(c, rands, words) {
    if (words.length === 0) operation(c, rands)
    else diagnostics(c, "extra term");
  };
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

function upto(a, pc, instructions) {
  const a_joint = a.join(' ')
  for (let i = pc - 1; i >= 0; i--) {
    const [o, ...b] = instructions[i];
    if ((o === '#' || o === '##' || o === '###') && a_joint === b.join(' '))
      return i - pc;
  }
  console.error("hey bond, where is label to bind to?", a)
}
function downto(a, pc, instructions) {
  const a_joint = a.join(' ')
  for (let i = pc + 1; i < instructions.length; i++) {
    const [o, ...b] = instructions[i];
    if ((o === '#' || o === '##' || o === '###') && a_joint === b.join(' '))
      return i - pc;
  }
  console.error("hey bond, where is label to bind to?", a)
}

