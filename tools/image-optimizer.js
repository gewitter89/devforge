/* ============================================================
   DevForge — Client-Side Image Optimizer
   Resize, compress and convert images to WebP/PNG/JPEG fully client-side
   ============================================================ */

DevForge.registerTool({
  id: 'image-optimizer',
  name: 'Image Optimizer',
  description: 'Compress, resize, and convert images locally in your browser. Private by design.',
  category: 'web',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  tags: ['image', 'compress', 'optimize', 'resize', 'webp', 'png', 'converter'],
  
  render() {
    return `
      <div class="tool-full">
        <div class="tool-split">
          <div class="tool-group">
            <label for="img-file">Upload Image</label>
            <input type="file" id="img-file" class="tool-input" accept="image/*" style="padding-top:8px;">
            
            <!-- Controls panel -->
            <div style="background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); margin-top:var(--space-sm); display:flex; flex-direction:column; gap:var(--space-md);">
              <div class="tool-option">
                <label for="img-quality">Quality (JPEG/WebP only): <span id="img-quality-val">80%</span></label>
                <input type="range" id="img-quality" min="10" max="100" value="80" style="width:100%; height:8px; border-radius:4px; outline:none; background:var(--bg-tertiary); cursor:pointer;">
              </div>
              <div class="tool-option">
                <label for="img-format">Output Format:</label>
                <select id="img-format">
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                </select>
              </div>
              <div class="tool-option" style="display:flex; gap:var(--space-sm);">
                <div style="flex:1;">
                  <label for="img-width">Width (px)</label>
                  <input type="number" id="img-width" class="tool-input" placeholder="Auto" style="height:34px;">
                </div>
                <div style="flex:1;">
                  <label for="img-height">Height (px)</label>
                  <input type="number" id="img-height" class="tool-input" placeholder="Auto" style="height:34px;">
                </div>
              </div>
            </div>

            <div class="tool-actions">
              <button class="tool-btn tool-btn-primary" id="img-optimize-btn" disabled>Optimize Image</button>
              <button class="tool-btn" id="img-reset-btn">Reset</button>
            </div>
          </div>

          <!-- Preview & Result Area -->
          <div class="tool-group">
            <label>Optimization Results</label>
            <div style="background:var(--bg-input); border:1px solid var(--border-primary); border-radius:var(--radius-md); padding:var(--space-md); min-height: 240px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:var(--space-md);">
              <div id="img-preview-container" style="max-width:100%; max-height:220px; overflow:hidden; display:none; border:2px solid var(--border-secondary); border-radius:var(--radius-sm);">
                <img id="img-preview" src="" alt="Preview" style="max-height:200px; display:block;">
              </div>
              
              <div id="img-stats" style="text-align:center; font-size:0.85rem; display:none; width:100%;">
                <div style="display:flex; justify-content:space-around; margin-bottom:var(--space-sm);">
                  <div>
                    <span style="color:var(--text-secondary); display:block; font-size:0.75rem;">Original Size</span>
                    <strong id="img-orig-size">-</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-secondary); display:block; font-size:0.75rem;">Optimized Size</span>
                    <strong id="img-opt-size">-</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-secondary); display:block; font-size:0.75rem;">Savings</span>
                    <strong id="img-savings" style="color:var(--color-success);">-</strong>
                  </div>
                </div>
                <button class="tool-btn tool-btn-sm" id="img-download-btn" style="margin-top:var(--space-sm);">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Download Optimized Image
                </button>
              </div>

              <div id="img-placeholder" style="color:var(--text-tertiary); text-align:center; font-size:0.85rem;">
                Upload an image to start optimization
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const fileInput = document.getElementById('img-file');
    const qualityInput = document.getElementById('img-quality');
    const qualityVal = document.getElementById('img-quality-val');
    const formatSelect = document.getElementById('img-format');
    const widthInput = document.getElementById('img-width');
    const heightInput = document.getElementById('img-height');
    const optimizeBtn = document.getElementById('img-optimize-btn');
    const resetBtn = document.getElementById('img-reset-btn');
    const previewContainer = document.getElementById('img-preview-container');
    const previewImg = document.getElementById('img-preview');
    const statsDiv = document.getElementById('img-stats');
    const origSizeSpan = document.getElementById('img-orig-size');
    const optSizeSpan = document.getElementById('img-opt-size');
    const savingsSpan = document.getElementById('img-savings');
    const downloadBtn = document.getElementById('img-download-btn');
    const placeholder = document.getElementById('img-placeholder');

    let loadedImage = null;
    let originalSize = 0;
    let optimizedBlob = null;

    qualityInput.addEventListener('input', () => {
      qualityVal.textContent = `${qualityInput.value}%`;
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      originalSize = file.size;
      const reader = new FileReader();
      reader.onload = (event) => {
        loadedImage = new Image();
        loadedImage.onload = () => {
          widthInput.value = loadedImage.naturalWidth;
          heightInput.value = loadedImage.naturalHeight;
          optimizeBtn.disabled = false;
          placeholder.style.display = 'none';
        };
        loadedImage.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    optimizeBtn.addEventListener('click', () => {
      if (!loadedImage) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const width = parseInt(widthInput.value) || loadedImage.naturalWidth;
      const height = parseInt(heightInput.value) || loadedImage.naturalHeight;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(loadedImage, 0, 0, width, height);

      const format = formatSelect.value;
      const quality = parseInt(qualityInput.value) / 100;

      canvas.toBlob((blob) => {
        if (!blob) return;
        optimizedBlob = blob;

        // Render preview & info
        previewImg.src = URL.createObjectURL(blob);
        previewContainer.style.display = 'block';
        statsDiv.style.display = 'block';

        origSizeSpan.textContent = formatBytes(originalSize);
        optSizeSpan.textContent = formatBytes(blob.size);

        const savings = originalSize - blob.size;
        const savingsPercent = originalSize > 0 ? Math.round((savings / originalSize) * 100) : 0;
        savingsSpan.textContent = savingsPercent > 0 ? `${savingsPercent}% (${formatBytes(savings)})` : `0%`;
        savingsSpan.style.color = savingsPercent > 0 ? 'var(--color-success)' : 'var(--color-warning)';

        if (window.SoundFX) window.SoundFX.playSuccess();
        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
        }
      }, format, quality);
    });

    downloadBtn.addEventListener('click', () => {
      if (!optimizedBlob) return;
      const ext = formatSelect.value.split('/')[1];
      const link = document.createElement('a');
      link.href = URL.createObjectURL(optimizedBlob);
      link.download = `optimized-image.${ext}`;
      link.click();
    });

    const reset = () => {
      fileInput.value = '';
      widthInput.value = '';
      heightInput.value = '';
      previewImg.src = '';
      previewContainer.style.display = 'none';
      statsDiv.style.display = 'none';
      placeholder.style.display = 'block';
      optimizeBtn.disabled = true;
      loadedImage = null;
      optimizedBlob = null;
    };

    resetBtn.addEventListener('click', () => {
      reset();
      if (window.SoundFX) window.SoundFX.playClick();
    });

    function formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
});
