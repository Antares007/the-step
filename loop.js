const c = {
  i: 0,
  dot
}
//c.dot(c)
function dot(c) {
  console.log(c.i++)
  setTimeout(c.dot, 200, c)
}
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'me> '
}).on('line', (input) => {
  const line = input.trim();

  if (line === 'exit' || line === 'quit') {
    rl.close();
    return;
  }

  try {
    const result = eval(line);          // evaluate what the user typed
    if (result !== undefined) {
      console.log(result);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }

  rl.prompt();                          // show the prompt again
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});
rl.prompt();
