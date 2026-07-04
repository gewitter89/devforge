/**
 * DevForge Smoke Test
 * Verifies that all tools are properly registered and functional
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔥 Running DevForge Smoke Test\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Check tools directory exists
test('Tools directory exists', () => {
  const toolsDir = join(rootDir, 'tools');
  const files = readdirSync(toolsDir);
  assert(files.length > 0, 'Tools directory is empty');
});

// Test 2: Check minimum tool count
test('At least 21 tools registered', () => {
  const toolsDir = join(rootDir, 'tools');
  const files = readdirSync(toolsDir).filter(f => f.endsWith('.js'));
  assert(files.length >= 21, `Expected at least 21 tools, found ${files.length}`);
  console.log(`    Found ${files.length} tool files`);
});

// Test 3: Check each tool file has proper structure
test('All tools have proper structure', () => {
  const toolsDir = join(rootDir, 'tools');
  const files = readdirSync(toolsDir).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const content = readFileSync(join(toolsDir, file), 'utf8');
    
    // Check for DevForge.registerTool
    assert(
      content.includes('DevForge.registerTool'),
      `${file}: Missing DevForge.registerTool`
    );
    
    // Check for required properties
    assert(
      content.includes('id:') && content.includes('name:') && content.includes('render'),
      `${file}: Missing required properties (id, name, render)`
    );
    
    // Check for init function
    assert(
      content.includes('init:'),
      `${file}: Missing init function`
    );
  }
});

// Test 4: Check index.html loads all tools
test('index.html loads all tools', () => {
  const indexContent = readFileSync(join(rootDir, 'index.html'), 'utf8');
  const toolsDir = join(rootDir, 'tools');
  const toolFiles = readdirSync(toolsDir).filter(f => f.endsWith('.js'));
  
  for (const file of toolFiles) {
    assert(
      indexContent.includes(file),
      `index.html missing script tag for ${file}`
    );
  }
});

// Test 5: Check sw.js caches all tools
test('sw.js caches all tools', () => {
  const swContent = readFileSync(join(rootDir, 'sw.js'), 'utf8');
  
  assert(
    swContent.includes('TOOL_ASSETS'),
    'sw.js missing TOOL_ASSETS array'
  );
  
  const toolsDir = join(rootDir, 'tools');
  const toolFiles = readdirSync(toolsDir).filter(f => f.endsWith('.js'));
  
  for (const file of toolFiles) {
    assert(
      swContent.includes(file),
      `sw.js missing cache entry for ${file}`
    );
  }
});

// Test 6: Check core files exist
test('Core files exist', () => {
  const requiredFiles = [
    'index.html',
    'sw.js',
    'js/app.js',
    'js/contributors.js',
    'js/i18n.js',
    'js/sound.js',
    'css/styles.css'
  ];
  
  for (const file of requiredFiles) {
    const path = join(rootDir, file);
    try {
      readFileSync(path);
    } catch (error) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
});

// Test 7: Check package.json scripts
test('package.json has required scripts', () => {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, 'package.json'), 'utf8')
  );
  
  const requiredScripts = ['lint', 'test', 'dev'];
  
  for (const script of requiredScripts) {
    assert(
      packageJson.scripts && packageJson.scripts[script],
      `Missing script: ${script}`
    );
  }
});

// Test 8: Check ESLint config exists
test('ESLint config exists', () => {
  const eslintConfig = join(rootDir, 'eslint.config.js');
  readFileSync(eslintConfig);
});

// Test 9: Check tool ID uniqueness
test('All tool IDs are unique', () => {
  const toolsDir = join(rootDir, 'tools');
  const files = readdirSync(toolsDir).filter(f => f.endsWith('.js'));
  const ids = new Set();
  
  for (const file of files) {
    const content = readFileSync(join(toolsDir, file), 'utf8');
    const match = content.match(/id:\s*['"]([^'"]+)['"]/);
    
    if (match) {
      const id = match[1];
      assert(
        !ids.has(id),
        `Duplicate tool ID: ${id} (found in ${file})`
      );
      ids.add(id);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50) + '\n');

if (failed > 0) {
  console.error('❌ Smoke test failed');
  process.exit(1);
} else {
  console.log('✅ All smoke tests passed!');
  process.exit(0);
}