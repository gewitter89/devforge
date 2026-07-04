(function() {
  if (!window.DevForge) return;

  DevForge.registerTool({
    id: "ai-agent-config-hub",
    name: "AI Agent Config Hub",
    description: "Universal configuration generator for AI coding agents (Cline, Cursor, OpenCode, Crush)",
    category: "ai-tools",
    icon: "🤖",
    tags: ["cline", "cursor", "opencode", "crush", "ai-agent", "config", "llm"],
    
    render() {
      return `
        <div class="tool-container">
          <h2>AI Agent Config Hub</h2>
          <p class="tool-description">
            Generate configuration files for popular AI coding agents. 
            Support for Cline, Cursor, OpenCode, Crush, and custom setups.
          </p>
          
          <div class="config-section">
            <h3>1. Select Agent Type</h3>
            <div class="agent-selector">
              <button class="agent-btn active" data-agent="opencode">OpenCode</button>
              <button class="agent-btn" data-agent="cline">Cline</button>
              <button class="agent-btn" data-agent="cursor">Cursor</button>
              <button class="agent-btn" data-agent="crush">Crush</button>
              <button class="agent-btn" data-agent="custom">Custom</button>
            </div>
          </div>
          
          <div class="config-section">
            <h3>2. Provider Configuration</h3>
            <div class="provider-selector">
              <label class="provider-option">
                <input type="radio" name="provider" value="openrouter" checked>
                <span>OpenRouter (Recommended)</span>
              </label>
              <label class="provider-option">
                <input type="radio" name="provider" value="anthropic">
                <span>Anthropic (Claude)</span>
              </label>
              <label class="provider-option">
                <input type="radio" name="provider" value="openai">
                <span>OpenAI (GPT)</span>
              </label>
              <label class="provider-option">
                <input type="radio" name="provider" value="ollama">
                <span>Ollama (Local)</span>
              </label>
              <label class="provider-option">
                <input type="radio" name="provider" value="custom">
                <span>Custom API</span>
              </label>
            </div>
          </div>
          
          <div class="config-section">
            <h3>3. Model Selection</h3>
            <div class="model-selector">
              <div class="model-group" data-provider="openrouter">
                <label>
                  <input type="checkbox" value="zhipu/glm-5.2:free" checked>
                  GLM-5.2 (753B, 128K ctx) - Free
                </label>
                <label>
                  <input type="checkbox" value="mistralai/fable-5:free" checked>
                  Fable 5 (45B, 32K ctx) - Free
                </label>
                <label>
                  <input type="checkbox" value="meta-llama/llama-3.3-70b:free">
                  Llama 3.3 70B (70B, 8K ctx) - Free
                </label>
                <label>
                  <input type="checkbox" value="qwen/qwen3-72b:free">
                  Qwen3 72B (72B, 32K ctx) - Free
                </label>
                <label>
                  <input type="checkbox" value="anthropic/claude-sonnet-4">
                  Claude Sonnet 4 (Paid)
                </label>
              </div>
              
              <div class="model-group" data-provider="anthropic" style="display:none">
                <label>
                  <input type="radio" name="anthropic-model" value="claude-sonnet-4" checked>
                  Claude Sonnet 4
                </label>
                <label>
                  <input type="radio" name="anthropic-model" value="claude-opus-4">
                  Claude Opus 4
                </label>
                <label>
                  <input type="radio" name="anthropic-model" value="claude-haiku-3.5">
                  Claude Haiku 3.5
                </label>
              </div>
              
              <div class="model-group" data-provider="openai" style="display:none">
                <label>
                  <input type="radio" name="openai-model" value="gpt-4-turbo" checked>
                  GPT-4 Turbo
                </label>
                <label>
                  <input type="radio" name="openai-model" value="gpt-4">
                  GPT-4
                </label>
                <label>
                  <input type="radio" name="openai-model" value="gpt-3.5-turbo">
                  GPT-3.5 Turbo
                </label>
              </div>
              
              <div class="model-group" data-provider="ollama" style="display:none">
                <label>Base URL: <input type="text" value="http://localhost:11434" class="ollama-url"></label>
                <label>
                  <input type="checkbox" value="glm-5.2" checked>
                  GLM-5.2 (requires 32GB+ RAM)
                </label>
                <label>
                  <input type="checkbox" value="llama3.3:70b">
                  Llama 3.3 70B
                </label>
                <label>
                  <input type="checkbox" value="qwen3:72b">
                  Qwen3 72B
                </label>
                <label>
                  <input type="checkbox" value="deepseek-r1:671b">
                  DeepSeek R1 671B (requires 480GB+ RAM)
                </label>
              </div>
              
              <div class="model-group" data-provider="custom" style="display:none">
                <label>API Base URL: <input type="text" placeholder="https://api.example.com/v1" class="custom-url"></label>
                <label>Model ID: <input type="text" placeholder="model-name" class="custom-model"></label>
              </div>
            </div>
          </div>
          
          <div class="config-section">
            <h3>4. API Key (Optional)</h3>
            <label class="api-key-label">
              <input type="password" placeholder="Enter API key (sk-...)" class="api-key-input">
              <span class="api-key-hint">Leave empty to use environment variable</span>
            </label>
            <div class="env-var-info">
              <strong>Environment variables:</strong>
              <ul>
                <li><code>OPENROUTER_API_KEY</code> - OpenRouter</li>
                <li><code>ANTHROPIC_API_KEY</code> - Anthropic</li>
                <li><code>OPENAI_API_KEY</code> - OpenAI</li>
              </ul>
            </div>
          </div>
          
          <div class="config-section">
            <h3>5. Token Optimization</h3>
            <label class="toggle-option">
              <input type="checkbox" class="use-ponytail" checked>
              <span>Enable Ponytail (Prompt compression -50%)</span>
            </label>
            <label class="toggle-option">
              <input type="checkbox" class="use-caveman" checked>
              <span>Enable Caveman (Output compression -70%)</span>
            </label>
            <label class="toggle-option">
              <input type="checkbox" class="use-memanto" checked>
              <span>Enable Memanto (Context deduplication -28%)</span>
            </label>
            <label class="toggle-option">
              <input type="checkbox" class="use-pxpipe">
              <span>Enable pxpipe (Image compression -77%)</span>
            </label>
          </div>
          
          <div class="config-section">
            <h3>6. Advanced Settings</h3>
            <div class="advanced-grid">
              <label>
                Max Tokens
                <input type="number" value="8192" min="256" max="128000" class="max-tokens">
              </label>
              <label>
                Temperature
                <input type="number" value="0.7" step="0.1" min="0" max="2" class="temperature">
              </label>
              <label>
                Timeout (seconds)
                <input type="number" value="300" min="30" max="3600" class="timeout">
              </label>
              <label>
                Context Window
                <input type="number" value="128000" min="4096" max="1000000" class="context-window">
              </label>
            </div>
          </div>
          
          <div class="config-section">
            <h3>Generated Configuration</h3>
            <div class="config-output">
              <div class="output-header">
                <span class="filename">opencode.jsonc</span>
                <button class="copy-btn">📋 Copy</button>
                <button class="download-btn">💾 Download</button>
              </div>
              <pre class="config-preview"><code></code></pre>
            </div>
          </div>
        </div>
      `;
    },
    
    init(container) {
      let currentAgent = "opencode";
      let currentProvider = "openrouter";
      
      // Agent selector
      container.querySelectorAll(".agent-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          container.querySelectorAll(".agent-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentAgent = btn.dataset.agent;
          updateFilename();
          generateConfig();
        });
      });
      
      // Provider selector
      container.querySelectorAll('input[name="provider"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
          currentProvider = e.target.value;
          container.querySelectorAll(".model-group").forEach(g => g.style.display = "none");
          container.querySelector(`.model-group[data-provider="${currentProvider}"]`).style.display = "block";
          updateFilename();
          generateConfig();
        });
      });
      
      // Model checkboxes
      container.querySelectorAll('input[type="checkbox"][value]').forEach(cb => {
        cb.addEventListener("change", generateConfig);
      });
      
      // Model radios
      container.querySelectorAll('input[type="radio"][name*="-model"]').forEach(radio => {
        radio.addEventListener("change", generateConfig);
      });
      
      // Input fields
      container.querySelectorAll("input[type='text'], input[type='number'], input[type='password']").forEach(input => {
        input.addEventListener("input", generateConfig);
      });
      
      // Toggle options
      container.querySelectorAll(".toggle-option input").forEach(toggle => {
        toggle.addEventListener("change", generateConfig);
      });
      
      // Copy button
      container.querySelector(".copy-btn").addEventListener("click", () => {
        const code = container.querySelector(".config-preview code").textContent;
        navigator.clipboard.writeText(code).then(() => {
          DevForge.toast("📋 Configuration copied!");
        });
      });
      
      // Download button
      container.querySelector(".download-btn").addEventListener("click", () => {
        const code = container.querySelector(".config-preview code").textContent;
        const filename = container.querySelector(".filename").textContent;
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        DevForge.toast("💾 Configuration downloaded!");
      });
      
      function updateFilename() {
        const filenames = {
          opencode: "opencode.jsonc",
          cline: ".clinerules",
          cursor: ".cursorrules",
          crush: "crush.yaml",
          custom: "config.json"
        };
        container.querySelector(".filename").textContent = filenames[currentAgent];
      }
      
      function generateConfig() {
        const provider = currentProvider;
        const models = getSelectedModels();
        const apiKey = container.querySelector(".api-key-input").value;
        const usePonytail = container.querySelector(".use-ponytail").checked;
        const useCaveman = container.querySelector(".use-caveman").checked;
        const useMemanto = container.querySelector(".use-memanto").checked;
        const usePxpipe = container.querySelector(".use-pxpipe").checked;
        const maxTokens = container.querySelector(".max-tokens").value;
        const temperature = container.querySelector(".temperature").value;
        const timeout = container.querySelector(".timeout").value;
        const contextWindow = container.querySelector(".context-window").value;
        
        let config = "";
        
        switch (currentAgent) {
          case "opencode":
            config = generateOpenCodeConfig({
              provider, models, apiKey, maxTokens, temperature, timeout, contextWindow
            });
            break;
          case "cline":
            config = generateClineConfig({
              provider, models, apiKey, maxTokens, temperature
            });
            break;
          case "cursor":
            config = generateCursorConfig({
              provider, models, apiKey, maxTokens, temperature
            });
            break;
          case "crush":
            config = generateCrushConfig({
              provider, models, apiKey, maxTokens, temperature
            });
            break;
          default:
            config = generateCustomConfig({
              provider, models, apiKey, maxTokens, temperature
            });
        }
        
        // Add token optimization comments
        if (usePonytail || useCaveman || useMemanto || usePxpipe) {
          config += "\n\n// Token Optimization Hooks:\n";
          if (usePonytail) config += "// - Ponytail: Prompt compression (-50% tokens)\n";
          if (useCaveman) config += "// - Caveman: Output compression (-70% tokens)\n";
          if (useMemanto) config += "// - Memanto: Context deduplication (-28% tokens)\n";
          if (usePxpipe) config += "// - pxpipe: Image compression (-77% tokens)\n";
          config += "// See docs/token-savings.md for setup instructions\n";
        }
        
        container.querySelector(".config-preview code").textContent = config;
      }
      
      function getSelectedModels() {
        const models = [];
        const providerGroup = container.querySelector(`.model-group[data-provider="${currentProvider}"]`);
        
        if (currentProvider === "anthropic" || currentProvider === "openai") {
          const selected = providerGroup.querySelector('input[type="radio"]:checked');
          if (selected) models.push(selected.value);
        } else {
          providerGroup.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            models.push(cb.value);
          });
        }
        
        return models;
      }
      
      function generateOpenCodeConfig({ provider, models, apiKey, maxTokens, temperature, timeout, contextWindow }) {
        let config = `{
  // OpenCode Configuration
  // Generated by DevForge AI Agent Config Hub
  
  "provider": {
    "${provider}": {
      "models": ${JSON.stringify(models, null, 6)},`;
        
        if (apiKey) {
          config += `
      "apiKey": "${apiKey}",`;
        }
        
        if (provider === "ollama") {
          const baseUrl = container.querySelector(".ollama-url").value;
          config += `
      "baseUrl": "${baseUrl}",`;
        } else if (provider === "custom") {
          const baseUrl = container.querySelector(".custom-url").value;
          config += `
      "baseUrl": "${baseUrl}",`;
        }
        
        config += `
      "maxTokens": ${maxTokens},
      "temperature": ${temperature},
      "timeout": ${timeout}
    }
  },
  
  "context": {
    "window": ${contextWindow},
    "reserve": 10000
  }
}`;
        
        return config;
      }
      
      function generateClineConfig({ provider, models, apiKey, maxTokens, temperature }) {
        let rules = `# Cline Configuration
# Generated by DevForge AI Agent Config Hub

## Provider: ${provider}
`;
        
        if (provider === "openrouter") {
          rules += `\nModels: ${models.join(", ")}\n`;
          rules += `\n## Setup\n`;
          rules += `1. Install Cline extension in VS Code\n`;
          rules += `2. Set API key: export OPENROUTER_API_KEY="${apiKey || "your-key-here"}"\n`;
          rules += `3. Configure in VS Code settings:\n`;
          rules += `   - cline.apiProvider: "openrouter"\n`;
          rules += `   - cline.openrouter.models: ["${models.join('", "')}"]\n`;
          rules += `   - cline.maxTokens: ${maxTokens}\n`;
          rules += `   - cline.temperature: ${temperature}\n`;
        }
        
        return rules;
      }
      
      function generateCursorConfig({ provider, models, apiKey, maxTokens, temperature }) {
        let rules = `# Cursor Configuration
# Generated by DevForge AI Agent Config Hub

## Provider: ${provider}
`;
        
        if (provider === "openrouter") {
          rules += `\n## Setup\n`;
          rules += `1. Open Cursor Settings (Cmd/Ctrl + ,)\n`;
          rules += `2. Go to "Cursor" > "AI"\n`;
          rules += `3. Select "OpenRouter" as provider\n`;
          rules += `4. Add API key: "${apiKey || "your-key-here"}"\n`;
          rules += `5. Add custom models:\n`;
          rules += models.map(m => `   - ${m}`).join("\n") + "\n";
          rules += `\n## Recommended Settings\n`;
          rules += `- Max tokens: ${maxTokens}\n`;
          rules += `- Temperature: ${temperature}\n`;
          rules += `- Enable "Fast" mode for quick edits\n`;
        }
        
        return rules;
      }
      
      function generateCrushConfig({ provider, models, apiKey, maxTokens, temperature }) {
        let yaml = `# Crush Configuration
# Generated by DevForge AI Agent Config Hub

provider: ${provider}
`;
        
        if (provider === "openrouter") {
          yaml += `
models:
${models.map(m => `  - ${m}`).join("\n")}

api_key: ${apiKey ? `"${apiKey}"` : '"${OPENROUTER_API_KEY}"'}

settings:
  max_tokens: ${maxTokens}
  temperature: ${temperature}
  timeout: 300
`;
        }
        
        return yaml;
      }
      
      function generateCustomConfig({ provider, models, apiKey, maxTokens, temperature }) {
        return JSON.stringify({
          provider,
          models,
          api_key: apiKey || null,
          max_tokens: parseInt(maxTokens),
          temperature: parseFloat(temperature)
        }, null, 2);
      }
      
      // Generate initial config
      generateConfig();
    }
  });
})();
