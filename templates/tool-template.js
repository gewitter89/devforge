<![CDATA[/* ============================================================
   DevForge — Tool Template
   ============================================================
   Copy this file to create a new tool:
     cp templates/tool-template.js tools/your-tool-name.js

   Then:
   1. Replace all placeholder values below
   2. Add your processing logic in init()
   3. Add a <script> tag to index.html:
        <script src="tools/your-tool-name.js" defer></script>
   4. Test in browser and open a PR!

   Docs: https://github.com/your-username/devforge/blob/main/CONTRIBUTING.md
   ============================================================ */

DevForge.registerTool({

  // ─── METADATA ──────────────────────────────────────────────
  // Unique ID in kebab-case. Used in URLs (#/tool/your-tool-id)
  // and as a prefix for all DOM element IDs.
  id: 'your-tool-id',

  // Display name shown in the catalog card and tool header
  name: 'Your Tool Name',

  // One-sentence description shown on the catalog card
  description: 'Briefly describe what this tool does',

  // Category — determines sidebar grouping
  // Options: 'formatters' | 'generators' | 'converters' | 'encoders' | 'text' | 'web'
  category: 'converters',

  // SVG icon (24×24 viewBox, stroke-based, use currentColor for theme support)
  // Find icons at: https://feathericons.com or https://lucide.dev
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
         </svg>`,

  // Tags for search — users can find your tool by typing these words
  tags: ['keyword1', 'keyword2', 'keyword3'],


  // ─── UI ────────────────────────────────────────────────────
  // render() returns the HTML for your tool's interface.
  // Available layouts:
  //   .tool-split  → 2-column (input | output)
  //   .tool-full   → single column
  //
  // Available components:
  //   .tool-group     → label + input wrapper
  //   .tool-textarea  → styled textarea
  //   .tool-input     → styled text input
  //   .tool-result    → output display (.success / .error states)
  //   .tool-actions   → button row
  //   .tool-btn       → secondary button
  //   .tool-btn-primary → gradient primary button
  //   .tool-options   → options row
  //   .tool-option    → label + select pair
  //   .tool-checkbox  → checkbox label
  //
  // ⚠️ IMPORTANT: Prefix ALL element IDs with your tool id!
  //    e.g., 'your-tool-id-input', 'your-tool-id-output'

  render() {
    return `
      <div class="tool-split">

        <!-- INPUT SIDE -->
        <div class="tool-group">
          <label>Input</label>
          <textarea class="tool-textarea" id="your-tool-id-input"
                    placeholder="Paste your content here..."></textarea>
        </div>

        <!-- OUTPUT SIDE -->
        <div class="tool-group">
          <label>Output</label>
          <div class="tool-result" id="your-tool-id-output">
            Result will appear here
          </div>
        </div>

      </div>

      <!-- OPTIONS (optional — remove if not needed) -->
      <div class="tool-options">
        <div class="tool-option">
          <label>Mode</label>
          <select id="your-tool-id-mode">
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </div>
        <label class="tool-checkbox">
          <input type="checkbox" id="your-tool-id-option1" checked>
          Some Option
        </label>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="tool-actions">
        <button class="tool-btn-primary" id="your-tool-id-process">
          Process
        </button>
        <button class="tool-btn" id="your-tool-id-copy">
          Copy Result
        </button>
        <button class="tool-btn" id="your-tool-id-clear">
          Clear
        </button>
      </div>
    `;
  },


  // ─── LOGIC ─────────────────────────────────────────────────
  // init() is called once after your UI is rendered into the DOM.
  // Use it to attach event listeners and set up your tool's logic.

  init() {
    // Grab DOM elements (always use your prefixed IDs)
    const input   = document.getElementById('your-tool-id-input');
    const output  = document.getElementById('your-tool-id-output');
    const mode    = document.getElementById('your-tool-id-mode');
    const processBtn = document.getElementById('your-tool-id-process');
    const copyBtn    = document.getElementById('your-tool-id-copy');
    const clearBtn   = document.getElementById('your-tool-id-clear');

    // ── Core processing function ──
    function process() {
      const value = input.value;

      // Handle empty input
      if (!value.trim()) {
        output.textContent = 'Enter some input above';
        output.classList.remove('success', 'error');
        return;
      }

      try {
        // ====================================================
        // 🔧 YOUR LOGIC HERE
        // Replace this with your actual processing code
        // ====================================================
        const result = value.toUpperCase(); // ← Example — replace me!

        // Show success
        output.textContent = result;
        output.classList.add('success');
        output.classList.remove('error');

      } catch (err) {
        // Show error
        output.textContent = 'Error: ' + err.message;
        output.classList.add('error');
        output.classList.remove('success');
      }
    }

    // ── Event listeners ──

    // Real-time processing (process as the user types)
    input.addEventListener('input', process);

    // Also process when options change
    mode.addEventListener('change', process);

    // Button handlers
    processBtn.addEventListener('click', process);

    copyBtn.addEventListener('click', () => {
      const text = output.textContent;
      if (text && text !== 'Enter some input above') {
        DevForge.copyToClipboard(text);
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      output.textContent = 'Enter some input above';
      output.classList.remove('success', 'error');
    });
  }

});
]]>
