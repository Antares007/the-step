import { fetch, decode, execute } from './loop.js'
import { number, register, words } from './denotations.js'
import os from './operations.js'
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

  point register a bond file: walk.step
  point register b bond file: tape.step

  goto register b
  halt the end!
  `.split('\n').map((iline) => iline.split(" ").map(λ => λ.trim()).filter(Boolean)),
  { a: 0, b: 0, c: 0, d: 0 },
  os(decode, execute, number, register, words)
);



