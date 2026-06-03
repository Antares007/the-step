import zlib from 'node:zlib'
import child_process from 'node:child_process'
import os from 'node:os'

export default function open_diagram(...args) {
  const state = {
    code: mermaid(...args),
    grid: true,
    mermaid: '{ "theme": "dark" }',
  }
  const graph = zlib.deflateSync(Buffer.from(JSON.stringify(state), 'utf-8'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  openBrowser('https://mermaid.live/view#pako:' + graph);
  function openBrowser(url) {
    const { exec } = child_process;
    const platform = os.platform();
    const cmd =
      platform === 'win32' ? `start "" "${url}"` :
      platform === 'darwin' ? `open "${url}"` :
      `xdg-open "${url}"`;
    exec(cmd);
  }
}
function mermaid(...symbols) {
  const attrs = []
  const edges = []
  const iof = s => {
    let i = symbols.indexOf(s)
    if (i === -1) i = symbols.length, symbols.push(s)
    return i
  } 
  for(let i = 0; i < symbols.length; i++) {
    const s = symbols[i] 
    const n = s.name
    s((      q) =>  attrs[i] = [0, n, q], 
      (x, u, q) => (attrs[i] = [1, n, q, x], edges.push([i, iof(u), 1])),
      (s, t, q) => (attrs[i] = [2, n, q],    edges.push([i, iof(s), 0]),
        edges.push([i, iof(t), 1])))
  }
  return (
`---
config:
  layout: elk
---
flowchart TB`
    + '\n' +  attrs.map(([op,n,q,x],i) => i + (
        op === 0 ? '@{ shape: framed-circle }'
      : op === 1 ? '['+JSON.stringify(x.replace(new RegExp('"', 'g'), "&quot;"))+']'
      :            '(("T"))'
    )).join('\n')
    + '\n' +  attrs.map(([op,n,q,x],i) => 'style '+i+' color:Black,stroke:Black,fill:'+colors[q|0]).join('\n')
    + '\n' +  edges.map(([a,b,c]) => a+(c ?' -':' .')+'-> '+b).join('\n')
  )
}
const colors = ["Gray", "Red", "Green", "Yellow", "Blue"]

