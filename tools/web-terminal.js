/* ============================================================
   DevForge Tool — Visual Web Terminal
   Provides an interactive CLI environment to execute tool actions 
   and utility scripts fully client-side.
   ============================================================ */

DevForge.registerTool({
  id: 'web-terminal',
  name: 'Visual Web Terminal',
  description:
    'Interact with DevForge using an interactive Unix-like command-line interface in your browser.',
  category: 'web',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  tags: ['terminal', 'cli', 'console', 'unix', 'shell', 'interactive'],

  render() {
    return `
      <div class="tool-full" style="font-family:'JetBrains Mono', monospace;">
        <!-- Terminal Container -->
        <div style="background:#05050a; border:1px solid var(--border-accent); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); overflow:hidden; display:flex; flex-direction:column; min-height:420px; max-height:500px;">
          <!-- Top bar -->
          <div style="background:var(--bg-tertiary); padding:8px var(--space-md); border-bottom:1px solid var(--border-primary); display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-secondary); user-select:none;">
            <span>devforge-terminal@client-shell:~</span>
            <div style="display:flex; gap:6px;">
              <span style="width:10px; height:10px; border-radius:50%; background:#ef4444; display:inline-block;"></span>
              <span style="width:10px; height:10px; border-radius:50%; background:#f59e0b; display:inline-block;"></span>
              <span style="width:10px; height:10px; border-radius:50%; background:#22c55e; display:inline-block;"></span>
            </div>
          </div>

          <!-- Console Lines Output -->
          <div id="term-output" style="flex:1; padding:var(--space-md); overflow-y:auto; font-size:0.85rem; line-height:1.5; color:#a78bfa; display:flex; flex-direction:column; gap:4px; font-family:'JetBrains Mono', monospace;">
            <div style="color:var(--text-secondary);">Welcome to DevForge CLI v1.0.0 (Web Terminal Shell)</div>
            <div style="color:var(--text-tertiary); margin-bottom:var(--space-sm);">Type 'help' to view the list of available commands.</div>
          </div>

          <!-- Console Input Line -->
          <div style="background:rgba(0,0,0,0.3); border-top:1px solid var(--border-primary); padding:var(--space-sm) var(--space-md); display:flex; align-items:center; gap:var(--space-sm);">
            <span style="color:var(--color-success); font-weight:bold; user-select:none;">devforge:~$</span>
            <input type="text" id="term-input" style="flex:1; background:none; border:none; outline:none; font-family:'JetBrains Mono', monospace; font-size:0.85rem; color:#fff;" autocomplete="off" autofocus>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const output = document.getElementById('term-output');
    const input = document.getElementById('term-input');

    const history = [];
    let historyIndex = -1;

    // Focus input on console wrapper click
    output.parentNode.addEventListener('click', () => {
      input.focus();
    });

    const printLine = (text, type = 'default') => {
      const div = document.createElement('div');

      if (type === 'error') {
        div.style.color = 'var(--color-error)';
      } else if (type === 'success') {
        div.style.color = 'var(--color-success)';
      } else if (type === 'info') {
        div.style.color = 'var(--text-accent)';
      } else if (type === 'cmd') {
        div.style.color = '#fff';
        div.style.fontWeight = 'bold';
      } else {
        div.style.color = 'var(--text-primary)';
      }

      div.innerHTML = text;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    };

    const executeCommand = line => {
      const raw = line.trim();
      if (!raw) return;

      history.push(raw);
      historyIndex = history.length;

      printLine(`devforge:~$ ${escapeHTML(raw)}`, 'cmd');

      const parts = raw.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (window.SoundFX) window.SoundFX.playClick();

      switch (cmd) {
        case 'help':
          printLine('Available Commands:', 'info');
          printLine('  <strong>help</strong>           - Show this help listing');
          printLine('  <strong>list</strong>           - List all available toolkit tools');
          printLine('  <strong>run [id]</strong>       - Open/Switch to specified tool');
          printLine('  <strong>uuid</strong>           - Generate a new v4 UUID & copy it');
          printLine('  <strong>base64 [str]</strong>   - Encode raw string parameters to Base64');
          printLine('  <strong>theme [theme]</strong>  - Switch UI theme (light/dark)');
          printLine('  <strong>sound [on/off]</strong> - Turn UI feedback sounds on or off');
          printLine('  <strong>clear</strong>          - Clear terminal output buffer');
          break;

        case 'list':
          printLine('DevForge Toolkit tools:', 'info');
          DevForge.tools.forEach(t => {
            printLine(`  * <strong>${t.id}</strong> - ${t.name}`);
          });
          break;

        case 'run':
          if (!args[0]) {
            printLine('Usage: run [tool-id]', 'error');
            break;
          }
          const tool = DevForge.tools.find(t => t.id === args[0].toLowerCase());
          if (tool) {
            printLine(`Opening ${tool.name}...`, 'success');
            window.location.hash = `#/tool/${tool.id}`;
          } else {
            printLine(`Tool "${args[0]}" not found. Type "list" to view all.`, 'error');
          }
          break;

        case 'uuid':
          const bytes = new Uint8Array(16);
          crypto.getRandomValues(bytes);
          bytes[6] = (bytes[6] & 0x0f) | 0x40;
          bytes[8] = (bytes[8] & 0x3f) | 0x80;
          const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
          const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
          DevForge.copyToClipboard(uuid);
          printLine(`UUID generated and copied to clipboard: <strong>${uuid}</strong>`, 'success');
          break;

        case 'base64':
          if (!args[0]) {
            printLine('Usage: base64 [string]', 'error');
            break;
          }
          const str = args.join(' ');
          try {
            const enc = btoa(unescape(encodeURIComponent(str)));
            printLine(`Encoded output: <strong>${enc}</strong> (Copied to clipboard)`, 'success');
            DevForge.copyToClipboard(enc);
          } catch (e) {
            printLine(`Encoding failed: ${e.message}`, 'error');
          }
          break;

        case 'theme':
          const theme = args[0] ? args[0].toLowerCase() : '';
          if (theme === 'light' || theme === 'dark') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('devforge-theme', theme);
            const sun = document.querySelector('.icon-sun');
            const moon = document.querySelector('.icon-moon');
            if (sun) sun.style.display = theme === 'dark' ? 'block' : 'none';
            if (moon) moon.style.display = theme === 'dark' ? 'none' : 'block';
            printLine(`Theme switched to <strong>${theme}</strong>.`, 'success');
          } else {
            printLine('Usage: theme [light/dark]', 'error');
          }
          break;

        case 'sound':
          const val = args[0] ? args[0].toLowerCase() : '';
          if (val === 'on' || val === 'off') {
            const active = val === 'on';
            if (window.SoundFX) {
              window.SoundFX.enabled = active;
              localStorage.setItem('devforge-sound', active);
              const soundToggle = document.getElementById('sound-toggle');
              if (soundToggle) {
                const onIcon = soundToggle.querySelector('.icon-sound-on');
                const offIcon = soundToggle.querySelector('.icon-sound-off');
                if (onIcon && offIcon) {
                  onIcon.style.display = active ? 'block' : 'none';
                  offIcon.style.display = active ? 'none' : 'block';
                }
              }
            }
            printLine(`Sound effects turned <strong>${val}</strong>.`, 'success');
          } else {
            printLine('Usage: sound [on/off]', 'error');
          }
          break;

        case 'clear':
          output.innerHTML = '';
          break;

        default:
          printLine(
            `Command not found: <strong>${cmd}</strong>. Type "help" for a list of commands.`,
            'error'
          );
      }
    };

    function escapeHTML(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        executeCommand(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.value = '';
        }
      }
    });

    // Auto-focus terminal input on load
    input.focus();
  }
});
