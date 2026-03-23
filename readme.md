![the step](./docs/20260323_1328_Machine's%20Step%20Evolution_simple_compose_01kmd0bkjyfewbkzg0zefatpdw.png)
```js
fetch(`
  // revolution now
  move register a number 20
  move register b number 3
  add register a register b
  add register a number 2
  output register a
  subtract register a number 1
  compare register a number 22
  if not equal goto up 3 steps
  halt the end!
  `.split('\n').map((iline) => iline.split(" ").map(λ => λ.trim()).filter(Boolean)),
  {a: 0, b: 0},
  make_os()
)

function make_os() {
  const nop = execute(function (c) { c.pc++, c.ontinue(c) });
  const tab_os = {
    undefined: nop,
    '//': words(nop),
    'halt': words(execute(function (c) { console.log('halted', c) })),
    'move': decode({
      'register': register(decode({
        'number': number(execute(function (c, [a, b]) {
          c.registers[a] = b
          c.pc++
          c.ontinue(c)
        })),
        'register': register(execute(function (c, [a, b]) {
          c.registers[a] = c.registers[b]
          c.pc++
          c.ontinue(c)
        })),
      }))
    }),
    'add': decode({
      'register': register(decode({
        'register': register(execute(function (c, [a, b]) {
          c.last = c.registers[a] = c.registers[a] + c.registers[b]
          c.pc++
          c.ontinue(c)
        })),
        'number': number(execute(function (c, [a, b]) {
          c.last = c.registers[a] = c.registers[a] + b
          c.pc++
          c.ontinue(c)
        }))
     }))
    }),
    'output': decode({
      register: register(execute(function(c, [a]){
        console.log(c.registers[a])
        c.pc++
        c.ontinue(c)
      }))
    }),
    'subtract': decode({
      'register': register(decode({
        'number': number(execute(function(c, [a,b]){
          c.last = c.registers[a] = c.registers[a] - b
          c.pc++
          c.ontinue(c)
        }))
      }))
    }),
    'compare': decode({
      'register': register(decode({
        'number': number(execute(function(c, [a,b]){
          c.last = c.registers[a] - b
          c.pc++
          c.ontinue(c)
        }))
      }))
    }),
    'if': decode({
      'not': decode({
        'equal': decode({
          'goto': decode({
            'up': number(decode({
              'steps': execute(function(c, [steps]) {
                c.pc = c.pc + (c.last ? -steps : 1)
                c.ontinue(c)
              })
            }))
          })
        })
      })
    })
  }
  return decode(tab_os)
  function decode   (tab      ) { return (c, ...a) => c.decode   (c, ...a, tab) }
  function number   (decoder  ) { return (c, ...a) => c.number   (c, ...a, decoder) }
  function register (decoder  ) { return (c, ...a) => c.register (c, ...a, decoder) }
  function words    (decoder  ) { return (c, ...a) => c.words    (c, ...a, decoder) }
  function execute  (operation) { return (c, ...a) => c.execute  (c, ...a, operation) }
}

function fetch(instructions, registers, os) {
  // I saw my context lying down asleep.
  // I was so overwhelmed with emotions that I kissed my context.
  // I touched his face with my hands and discovered I don't have hands,
  // then my context opened one eye, saw me, and smiled.
  const c = {
    pc: 0, registers, last: 0, instructions, os,
    decode,
    execute,
    words,
    register,
    number,
    ontinue
  }
  c.ontinue(c)

  function ontinue(c) {
    const words = c.instructions[c.pc]
    console.log(c.pc, ...words)
    setTimeout(c.os, 2000, c, words, [], [])
  }
  function decode(c, [word, ...words], rands, path, b) {
    if(b[word]) b[word](c, words, rands, [...path, word]) 
    else console.error(`decode [${path.join(' ')} >${word}< ${words.join(' ')}]\n${Object.keys(b)}`)
  }
  function execute(c, words, rands, path, b) {
    if (words.length === 0) b(c, rands, path)
    else console.error(`extra [${path.join(' ')} args: ${words.join(' ')}]`)
  }
  function words(c, words, rands, path, b) { b(c, [], [...rands, words], path) }
  function register(c, [word, ...words], rands, path, b) {
    const check = typeof c.registers[word] !== 'undefined';
    if (check) b(c, words, [...rands, word], [...path, word])
    else console.error(`not a register [${path.join(' ')} >${word}< ${words.join(' ')}]\n${Object.keys(c.registers)}`)
  }
  function number(c, [word, ...words], rands, path, b) {
    const imm = parseInt(word, 10);
    if (isNaN(imm) === false) b(c, words, [...rands, imm], [...path, word])
    else console.error(`not a number [${path.join(' ')} >${word}< ${words.join(' ')}]`)
  }
}
```
