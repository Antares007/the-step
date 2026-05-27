import zlib from 'zlib'
import child_process from 'child_process'
import os from 'os'

export default function open_diagram(...args) {
  const state = {
    code: mermaid(...args),
    grid: true,
    mermaid: '{\n  "theme": "dark"\n}',
    //panZoom: true,
    //rough: false,
    //updateDiagram: true,
    //renderCount: 5,
    //pan: { x: 507.3228154144735, y: 52.80805721952268 },
    //zoom: 0.875,
    //editorMode: 'code'
  }
  openBrowser('https://mermaid.live/view#pako:' + zlib.deflateSync(Buffer.from(JSON.stringify(state), 'utf-8')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
  function openBrowser(url) {
    const { exec } = child_process;
    const platform = os.platform();
    const cmd =
      platform === 'win32' ? `start "" "${url}"` :
      platform === 'darwin' ? `open "${url}"` :
      `xdg-open "${url}"`;

    exec(cmd);
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
      s((    ) =>  attrs[i] = [0, n], 
        (x, u) => (attrs[i] = [1, n, x], edges.push([i, iof(u), 1])),
        (s, t) => (attrs[i] = [2, n],    edges.push([i, iof(s), 0]),
                                         edges.push([i, iof(t), 1])))
    }
    return (`---
config:
  layout: elk
---
flowchart TB
` +
      attrs.map(([op,n,x],i) => i + (op === 0 ? '@{ shape: framed-circle }'
        :op === 1 ? '(('+JSON.stringify(x.replace(/"/g,"&quot;"))+'))'
          :           '(['+(n||i)+'])')).join('\n')
        + '\n' +
        edges.map(([a,b,c]) => a+(c ?' -':' .')+'-> '+b).join('\n')
      )
  }
}

