const boot_sector = `
move reg a imm 2
move reg b imm 3
add reg a reg b
add reg a imm 48` +

// this is heading
`
output reg a
subtract reg a imm 1
compare reg a imm 47
jmp not equal imm -3
halt`
const regs = {a:0, b:0, c:0};
/*
  A program is a list of lines. Each line is a sentence of words.
  The machine has a finger pointing at the current line: the program counter.
  To run, the machine reads the line under its finger,
  walks the words left to right, and each word narrows down what
  the sentence means until the last word fires the action.
  Then the finger moves.
  That walk, word by word, narrowing to an action, is the whole machine.
  Everything else is which words are valid at each step.
*/
const operation_semantics = {
  'undefined': execute((o, t, ...s) => o(t + 1, ...s)),
  halt: execute((o, t, registers, last) =>
    console.log('halted', {t, registers, last})),
  move: decode({
    reg: decode({
      reg: execute((a, b, o, t, r, ...s) => (r[a] = r[b], o(t + 1, r, ...s))),
      imm: execute((a, b, o, t, r, ...s) => (r[a] = b,    o(t + 1, r, ...s))),
    }),
  }),
  add: decode({
    reg: decode({
      reg: execute((a, b, o, t, r, l, ...s) => (l = r[a] = r[a] + r[b], o(t + 1, r, l, ...s))),
      imm: execute((a, b, o, t, r, l, ...s) => (l = r[a] = r[a] +   b,  o(t + 1, r, l, ...s))),
    }),
  }),
  subtract: decode({
    reg: decode({
      imm: execute((a, b, o, t, r, l, ...s) => (l = r[a] = r[a] -   b,  o(t + 1, r, l, ...s))),
    }),
  }),
  compare: decode({
    reg: decode({
      imm: execute((a, b, o, t, r, l, ...s) => (l =        r[a] -   b,  o(t + 1, r, l, ...s))),
    }),
  }),
  output: decode({
    reg: execute((a, o, t, r, ...s) => (console.log(r[a]), o(t + 1, r, ...s)))
  }),
  jmp: decode({
    not: decode({
      equal: decode({
        imm: execute((offset, o, t, r, l, ...s) => o(t + (l ? offset :  1), r, l, ...s))
      }),
    }),
  }),
}

const memory = boot_sector.split('\n')
  .map(iline => iline.split(' ').map(x => x.trim()).filter(Boolean))

fetch(0, regs, 0, decode(operation_semantics), memory)()

function fetch(instruction_index, registers, last_value, operational_semantics, memory) {
  return function() {
    const words = memory[instruction_index];
    const operands = []
    operational_semantics(
      words,
      operands,
      instruction_index,
      registers,
      last_value,
      operational_semantics,
      memory
    )
  }
}
function decode(table) {
  const decoders = {
    reg(continuation) {
      return function ([word, ...words], operands, instruction_index, registers, ...context) {
        if (typeof registers[word] !== 'undefined')
          continuation(words, [...operands, word], instruction_index, registers, ...context)
        else diagnostics(
          instruction_index,
          "expected reg",
          { "registers available": Object.keys(regs) }
        )
      }
    },
    imm(continuation) {
      return function ([word, ...words], operands, instruction_index, ...context) {
        const imm = parseInt(word, 10)
        if (isNaN(imm) === false)
          continuation(words, [...operands, imm], instruction_index, ...context)
        else diagnostics(instruction_index, 'expected imm integer')
      }
    },
  }
  const decoders_applied = Object.keys(table)
    .reduce((t,k) => (t[k] = decoders[k] ? decoders[k](table[k]) : table[k], t), {})

  return function decode([word, ...words], operands, instruction_index, ...context) {
    if (decoders_applied[word]) {
      decoders_applied[word](words, operands, instruction_index, ...context)
    } else diagnostics(
      instruction_index,
      "invalid syntax",
      { 'expected one of': Object.keys(decoders_applied) }
    )
  }
}
function execute(operation) {
  return function execute(words, operands, instruction_index, ...context) {
    if (words.length === 0) {
      const loOp = (...context) => setImmediate(fetch(...context))
      operation(...operands, loOp, instruction_index, ...context)
    } else diagnostics(instruction_index, "extra term")
  }
}
function diagnostics(instruction_index, message, description = {}) {
  console.error([
    `Error:instruction_index:${instruction_index}: ${message}`,
    ...Object.keys(description).map(heading=> heading + ": " + description[heading].join(', ')),
  ].join('\n'))
}
