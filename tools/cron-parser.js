/* ============================================================
   DevForge — Cron Expression Parser
   Parses cron schedules into human-readable descriptions + next runtime dates
   ============================================================ */

DevForge.registerTool({
  id: 'cron-parser',
  name: 'Cron Parser',
  description: 'Parse cron expressions into human-readable descriptions and calculate execution schedules.',
  category: 'web',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  tags: ['cron', 'scheduler', 'schedule', 'parser', 'unix', 'time'],
  
  render() {
    return `
      <div class="tool-split">
        <div class="tool-group">
          <label for="cron-input">Cron Expression (5 Fields)</label>
          <input type="text" id="cron-input" class="tool-input" placeholder="e.g. */5 4 * * 1-5" value="*/5 4 * * 1-5" style="font-family:'JetBrains Mono', monospace; font-size:1.1rem; letter-spacing:0.04em;">
          
          <div style="background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); margin-top:var(--space-sm); font-size:0.8rem; line-height:1.5; color:var(--text-secondary);">
            <div style="font-weight:bold; margin-bottom:4px; color:var(--text-primary);">Format Guide:</div>
            <div>* * * * *</div>
            <div>│ │ │ │ │</div>
            <div>│ │ │ │ └── Day of week (0 - 6) (0 = Sunday)</div>
            <div>│ │ │ └──── Month (1 - 12)</div>
            <div>│ │ └────── Day of month (1 - 31)</div>
            <div>│ └──────── Hour (0 - 23)</div>
            <div>└────────── Minute (0 - 59)</div>
          </div>
        </div>

        <div class="tool-group">
          <label>Translation & Next Events</label>
          <div style="background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); min-height: 220px; display:flex; flex-direction:column; gap:var(--space-md);">
            <div>
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-tertiary); font-weight:bold; display:block; margin-bottom:4px;">Human Readable Description</span>
              <div id="cron-desc" style="font-size:1rem; font-weight:600; color:var(--text-accent);">-</div>
            </div>
            <div style="border-top:1px solid var(--border-primary); padding-top:var(--space-sm);">
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-tertiary); font-weight:bold; display:block; margin-bottom:6px;">Next 5 Execution Dates</span>
              <ul id="cron-next-dates" style="font-family:'JetBrains Mono', monospace; font-size:0.82rem; list-style:disc; padding-left:18px; color:var(--text-primary); display:flex; flex-direction:column; gap:4px;">
                <li>-</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('cron-input');
    const desc = document.getElementById('cron-desc');
    const nextDatesList = document.getElementById('cron-next-dates');

    const parseCron = () => {
      const expr = input.value.trim().replace(/\s+/g, ' ');
      if (!expr) {
        desc.textContent = 'Please enter a cron expression';
        nextDatesList.innerHTML = '<li>-</li>';
        return;
      }

      const parts = expr.split(' ');
      if (parts.length !== 5) {
        desc.innerHTML = '<span style="color:var(--color-error)">Invalid format: Must contain exactly 5 space-separated values.</span>';
        nextDatesList.innerHTML = '<li>-</li>';
        return;
      }

      try {
        const parsed = translateCron(parts);
        desc.textContent = parsed;
        
        // Calculate mock run dates (simplified scheduler simulation)
        const nextDates = getMockNextDates(parts);
        nextDatesList.innerHTML = nextDates.map(date => `<li>${date.toLocaleString()}</li>`).join('');
      } catch (err) {
        desc.innerHTML = `<span style="color:var(--color-error)">Error: ${err.message}</span>`;
        nextDatesList.innerHTML = '<li>-</li>';
      }
    };

    // Very simplified Cron translation parser
    function translateCron(parts) {
      const [m, h, dom, mon, dow] = parts;
      
      const describePart = (val, type) => {
        if (val === '*') return `every ${type}`;
        if (val.startsWith('*/')) {
          const step = val.split('/')[1];
          return `every ${step} ${type}s`;
        }
        if (val.includes('-')) {
          const [start, end] = val.split('-');
          return `from ${start} to ${end}`;
        }
        if (val.includes(',')) {
          return `on (${val})`;
        }
        return `at ${val}`;
      };

      const mDesc = describePart(m, 'minute');
      const hDesc = describePart(h, 'hour');
      const domDesc = dom === '*' ? '' : `on ${describePart(dom, 'day of month')}`;
      const monDesc = mon === '*' ? '' : `in ${describePart(mon, 'month')}`;
      const dowDesc = dow === '*' ? '' : `on ${describePart(dow, 'day of week')}`;

      let result = `Runs ${mDesc}`;
      if (h !== '*') result += ` ${hDesc}`;
      if (domDesc) result += ` ${domDesc}`;
      if (monDesc) result += ` ${monDesc}`;
      if (dowDesc) result += ` ${dowDesc}`;

      return result.replace(/\s+/g, ' ').trim() + '.';
    }

    // Generate upcoming dates (Simplified local-time calculator)
    function getMockNextDates(parts) {
      const [m, h, dom, mon, dow] = parts;
      const dates = [];
      let current = new Date();
      current.setSeconds(0, 0);

      // Simple scheduler simulator matching step / exact filters
      const matchTime = (val, target) => {
        if (val === '*') return true;
        if (val.startsWith('*/')) return target % parseInt(val.split('/')[1]) === 0;
        if (val.includes(',')) return val.split(',').map(Number).includes(target);
        if (val.includes('-')) {
          const [s, e] = val.split('-').map(Number);
          return target >= s && target <= e;
        }
        return Number(val) === target;
      };

      for (let offset = 1; offset < 100000 && dates.length < 5; offset++) {
        const candidate = new Date(current.getTime() + offset * 60 * 1000);
        if (
          matchTime(m, candidate.getMinutes()) &&
          matchTime(h, candidate.getHours()) &&
          matchTime(dow, candidate.getDay()) &&
          matchTime(mon, candidate.getMonth() + 1)
        ) {
          dates.push(new Date(candidate));
        }
      }

      if (dates.length === 0) {
        throw new Error("Could not compute next dates. Cron pattern too sparse.");
      }

      return dates;
    }

    input.addEventListener('input', parseCron);
    parseCron();
  }
});
