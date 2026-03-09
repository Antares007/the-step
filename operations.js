import fs from 'node:fs'

export default function (decode, execute, number, register, words) {
  const nop = words(execute(function nop(c) { c.pc++, c.ontinue(c); }))

  return decode({
    lidt: decode({
      bond: decode({
        'below:': words(execute(function(c, [words]) {
        })),
      }),
    }),
    goto: decode({
      register: register(execute(function(c, [a]) {
        c.pc = c.registers[a];
        c.ontinue(c);   
      })),
      offset: number(execute(goto_offset)),
      bond: decode({
        'below:': words(execute(function(c, [a]) {
          const offset = below(c, [a]);
          c.instructions[c.pc] = ['goto', 'offset', offset]
          goto_offset(c, [offset]);
        })),
      }),
    }),
    point: decode({
      register: register(decode({
        offset: number(execute(point_register_offset)),
        bond: decode({
          'file:': words(execute(function(c, [a, words]) {
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
          'higher:': words(execute(function(c, [a, words]) {
            const offset = higher(words, c.pc, c.instructions);
            point_register_offset_bond(c, [a, offset]);
          })),
          'below:': words(execute(function(c, [a, words]) {
            const offset = below(c, [words]);
            point_register_offset_bond(c, [a, offset]);
          })),
        }),
      })),
    }),
    undefined: nop, '//': nop, '#': nop, '##': nop, '###': nop,
    halt(c, rands, words) {
      console.log(rands, words, c);
    },
    move: decode({
      register: register(decode({
        register: register(execute(function (c, [a, b]) {
          ((c.registers[a] = c.registers[b]), c.pc++), c.ontinue(c);
        })),
        number: number(execute(function (c, [a, b]) {
          c.registers[a] = b, c.pc++, c.ontinue(c);
        })),
        offset: number(execute(move_register_offset)),
        bond: decode({
          'higher:': words(execute(function(c, [a, words]) {
            const offset = 1 + higher(words, c.pc, c.instructions);
            c.instructions[c.pc] = ['move', 'register', a, 'offset', offset]
            move_register_offset(c, [a, offset]);
          })),
          'below:': words(execute(function(c, [a, words]) {
            const offset = 1 + below(c, [words]);
            c.instructions[c.pc] = ['move', 'register', a, 'offset', offset]
            move_register_offset(c, [a, offset]);
          })),
        }),
      })),
    }),
    add: decode({
      register: register(decode({
        register: register(execute(function (c, [a, b]) {
          c.last = c.registers[a] = c.registers[a] + c.registers[b];
          c.pc++, c.ontinue(c);
        })),
        number: number(execute(function (c, [a, b]) {
          c.last = c.registers[a] = c.registers[a] + b;
          c.pc++, c.ontinue(c);
        })),
      })),
    }),
    subtract: decode({
      register: register(decode({
        number: number(execute(function (c, [a, b]) {
          c.last = c.registers[a] = c.registers[a] - b;
          c.pc++, c.ontinue(c);
        })),
      })),
    }),
    compare: decode({
      register: register(decode({
        number: number(execute(function (c, [a, b]) {
          c.last = c.registers[a] - b;
          c.pc++, c.ontinue(c);
        })),
      })),
    }),
    output: decode({
      register: register(execute(function (c, [a]) {
        console.log(c.registers[a]);
        c.pc++, c.ontinue(c);
      })),
    }),
    if: decode({
      not: decode({
        equal: decode({
          goto: decode({
            up: number(decode({
              steps: execute(function (c, [off]) {
                c.pc += c.last ? -off : 1, c.ontinue(c);
              }),
            })),
          }),
        }),
      }),
    }),
  })

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

  function higher(words, pc, instructions) {
    const a_joint = words.join(' ')
    for (let i = pc - 1; i >= 0; i--) {
      const [o, ...b] = instructions[i];
      if ((o === '#' || o === '##' || o === '###') && a_joint === b.join(' '))
        return i - pc;
    }
    console.error("hey bond, where is label to bind to?", words)
  }

  function below(c, [words]) {
    const a_joint = words.join(' ')
    for (let i = c.pc + 1; i < c.instructions.length; i++) {
      const [o, ...b] = c.instructions[i];
      if ((o === '#' || o === '##' || o === '###') && a_joint === b.join(' '))
        return i - c.pc;
    }
    console.error("hey bond, where is label to bind to?", words)
  }
}

