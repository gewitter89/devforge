/* ============================================================
   DevForge Tool — Timestamp Converter
   Convert between Unix timestamps and human-readable dates
   ============================================================ */

DevForge.registerTool({
  id: 'timestamp-converter',
  name: 'Timestamp Converter',
  description: 'Convert Unix timestamps to dates and vice versa with live clock',
  category: 'converters',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  tags: ['timestamp', 'unix', 'epoch', 'date', 'time', 'utc', 'converter'],

  render() {
    return `
      <div class="tool-full">
        <!-- Current Time Section -->
        <div style="background:var(--gradient-subtle);border-radius:var(--radius-md);padding:var(--space-lg);border:1px solid var(--border-accent);">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md);">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--text-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style="font-size:0.85rem;font-weight:600;color:var(--text-accent);text-transform:uppercase;letter-spacing:0.04em;">Live Clock</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-md);">
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:2px;">Unix Timestamp (seconds)</div>
              <div id="timestamp-converter-live-sec" style="font-family:'JetBrains Mono',monospace;font-size:1.2rem;font-weight:700;color:var(--text-primary);cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:2px;">Unix Timestamp (milliseconds)</div>
              <div id="timestamp-converter-live-ms" style="font-family:'JetBrains Mono',monospace;font-size:1.2rem;font-weight:700;color:var(--text-primary);cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:2px;">UTC</div>
              <div id="timestamp-converter-live-utc" style="font-family:'JetBrains Mono',monospace;font-size:0.95rem;color:var(--text-primary);"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:2px;">Local Time</div>
              <div id="timestamp-converter-live-local" style="font-family:'JetBrains Mono',monospace;font-size:0.95rem;color:var(--text-primary);"></div>
            </div>
          </div>
        </div>

        <!-- Timestamp → Date -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);">
          <div class="tool-group" style="grid-column:1/-1;">
            <label>Timestamp → Date</label>
            <div style="display:flex;gap:var(--space-sm);align-items:center;">
              <input type="text" id="timestamp-converter-ts-input" class="tool-input"
                placeholder="Enter Unix timestamp (e.g. 1719000000 or 1719000000000)"
                style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;flex:1;">
              <button class="tool-btn tool-btn-sm" id="timestamp-converter-now-btn">Now</button>
            </div>
          </div>
        </div>

        <!-- Timestamp Result -->
        <div id="timestamp-converter-ts-result" style="display:none;background:var(--bg-input);border:1px solid var(--border-primary);border-radius:var(--radius-md);padding:var(--space-lg);">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-md);">
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">ISO 8601</div>
              <div id="timestamp-converter-iso" style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">RFC 2822</div>
              <div id="timestamp-converter-rfc" style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">UTC</div>
              <div id="timestamp-converter-utc-out" style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">Local</div>
              <div id="timestamp-converter-local-out" style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;cursor:pointer;" title="Click to copy"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">Relative</div>
              <div id="timestamp-converter-relative" style="font-size:0.9rem;font-weight:600;color:var(--text-accent);"></div>
            </div>
            <div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px;">Day of Year / Week Number</div>
              <div id="timestamp-converter-extra" style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;"></div>
            </div>
          </div>
        </div>

        <!-- Date → Timestamp -->
        <div class="tool-group">
          <label>Date → Timestamp</label>
          <div style="display:flex;gap:var(--space-sm);align-items:center;flex-wrap:wrap;">
            <input type="datetime-local" id="timestamp-converter-date-input" class="tool-input"
              style="flex:1;min-width:220px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;">
          </div>
        </div>

        <!-- Date → Timestamp Result -->
        <div id="timestamp-converter-date-result" style="display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-md);">
            <div class="tool-group">
              <label>Unix Seconds</label>
              <div class="tool-inline-result">
                <span id="timestamp-converter-date-sec" style="flex:1;"></span>
                <span class="copy-icon" id="timestamp-converter-date-sec-copy">${DevForge.COPY_ICON}</span>
              </div>
            </div>
            <div class="tool-group">
              <label>Unix Milliseconds</label>
              <div class="tool-inline-result">
                <span id="timestamp-converter-date-ms" style="flex:1;"></span>
                <span class="copy-icon" id="timestamp-converter-date-ms-copy">${DevForge.COPY_ICON}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const liveSec = document.getElementById('timestamp-converter-live-sec');
    const liveMs = document.getElementById('timestamp-converter-live-ms');
    const liveUtc = document.getElementById('timestamp-converter-live-utc');
    const liveLocal = document.getElementById('timestamp-converter-live-local');

    const tsInput = document.getElementById('timestamp-converter-ts-input');
    const nowBtn = document.getElementById('timestamp-converter-now-btn');
    const tsResult = document.getElementById('timestamp-converter-ts-result');
    const isoEl = document.getElementById('timestamp-converter-iso');
    const rfcEl = document.getElementById('timestamp-converter-rfc');
    const utcEl = document.getElementById('timestamp-converter-utc-out');
    const localEl = document.getElementById('timestamp-converter-local-out');
    const relEl = document.getElementById('timestamp-converter-relative');
    const extraEl = document.getElementById('timestamp-converter-extra');

    const dateInput = document.getElementById('timestamp-converter-date-input');
    const dateResult = document.getElementById('timestamp-converter-date-result');
    const dateSec = document.getElementById('timestamp-converter-date-sec');
    const dateMs = document.getElementById('timestamp-converter-date-ms');
    const dateSecCopy = document.getElementById('timestamp-converter-date-sec-copy');
    const dateMsCopy = document.getElementById('timestamp-converter-date-ms-copy');

    // Live clock
    function updateLiveClock() {
      const now = new Date();
      liveSec.textContent = Math.floor(now.getTime() / 1000);
      liveMs.textContent = now.getTime();
      liveUtc.textContent = now.toUTCString();
      liveLocal.textContent = now.toLocaleString();
    }
    updateLiveClock();
    const _intervalId = setInterval(updateLiveClock, 1000);

    // Click to copy live values
    liveSec.addEventListener('click', () => DevForge.copyToClipboard(liveSec.textContent));
    liveMs.addEventListener('click', () => DevForge.copyToClipboard(liveMs.textContent));

    // Relative time helper
    function relativeTime(date) {
      const now = Date.now();
      const diff = now - date.getTime();
      const abs = Math.abs(diff);
      const future = diff < 0;

      const seconds = Math.floor(abs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(days / 365.25);

      let str;
      if (seconds < 5) str = 'just now';
      else if (seconds < 60) str = seconds + ' seconds';
      else if (minutes < 60) str = minutes + ' minute' + (minutes > 1 ? 's' : '');
      else if (hours < 24) str = hours + ' hour' + (hours > 1 ? 's' : '');
      else if (days < 30) str = days + ' day' + (days > 1 ? 's' : '');
      else if (months < 12) str = months + ' month' + (months > 1 ? 's' : '');
      else str = years + ' year' + (years > 1 ? 's' : '');

      if (str === 'just now') return str;
      return future ? 'in ' + str : str + ' ago';
    }

    // Day of year & week number
    function dayOfYear(date) {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff = date - start;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function weekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    }

    // RFC 2822 format
    function toRFC2822(date) {
      return date.toUTCString().replace('GMT', '+0000');
    }

    // Timestamp → Date
    function convertTimestamp() {
      const val = tsInput.value.trim();
      if (!val) {
        tsResult.style.display = 'none';
        return;
      }
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        tsResult.style.display = 'none';
        return;
      }

      // Auto-detect seconds vs milliseconds (if > year 2100 in seconds, assume ms)
      const ms = num > 9999999999 ? num : num * 1000;
      const date = new Date(ms);

      if (isNaN(date.getTime())) {
        tsResult.style.display = 'none';
        return;
      }

      tsResult.style.display = 'block';
      isoEl.textContent = date.toISOString();
      rfcEl.textContent = toRFC2822(date);
      utcEl.textContent = date.toUTCString();
      localEl.textContent = date.toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      relEl.textContent = relativeTime(date);
      extraEl.textContent = `Day ${dayOfYear(date)} of year · Week ${weekNumber(date)}`;
    }

    tsInput.addEventListener('input', convertTimestamp);

    // Click to copy result fields
    [isoEl, rfcEl, utcEl, localEl].forEach(el => {
      el.addEventListener('click', () => DevForge.copyToClipboard(el.textContent));
    });

    // "Now" button
    nowBtn.addEventListener('click', () => {
      tsInput.value = Math.floor(Date.now() / 1000);
      convertTimestamp();
    });

    // Date → Timestamp
    function convertDate() {
      const val = dateInput.value;
      if (!val) {
        dateResult.style.display = 'none';
        return;
      }
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        dateResult.style.display = 'none';
        return;
      }

      dateResult.style.display = 'block';
      dateSec.textContent = Math.floor(date.getTime() / 1000);
      dateMs.textContent = date.getTime();
    }

    dateInput.addEventListener('input', convertDate);

    dateSecCopy.addEventListener('click', () => DevForge.copyToClipboard(dateSec.textContent));
    dateMsCopy.addEventListener('click', () => DevForge.copyToClipboard(dateMs.textContent));

    // Set datetime-local to current time
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    dateInput.value = local.toISOString().slice(0, 16);
    convertDate();
  }
});
