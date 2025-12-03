#!/usr/bin/env node

/**
 * Quick Changes - Generate common UI change instructions without typing
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Common UI change patterns
const CHANGES = {
  spacing: {
    name: 'Spacing/Padding',
    template: (answers) => `SPACING: ${answers.element} → ${answers.value}`,
    questions: [
      { key: 'element', prompt: 'Element (e.g., hero-title, .card, #navbar): ' },
      { key: 'value', prompt: 'New spacing (e.g., 80px, p-8, mt-4): ' }
    ]
  },
  move: {
    name: 'Move Element',
    template: (answers) => `MOVE: ${answers.element} → ${answers.position} ${answers.target}`,
    questions: [
      { key: 'element', prompt: 'Element to move: ' },
      { key: 'position', prompt: 'Position (above/below/inside/after/before): ' },
      { key: 'target', prompt: 'Target element: ' }
    ]
  },
  remove: {
    name: 'Remove Element',
    template: (answers) => `REMOVE: ${answers.element}`,
    questions: [
      { key: 'element', prompt: 'Element(s) to remove (e.g., all Cards, .sidebar): ' }
    ]
  },
  replace: {
    name: 'Replace Component',
    template: (answers) => `REPLACE: ${answers.old} → ${answers.new}`,
    questions: [
      { key: 'old', prompt: 'Old component (e.g., Card): ' },
      { key: 'new', prompt: 'New component (e.g., div): ' }
    ]
  },
  color: {
    name: 'Change Color',
    template: (answers) => `COLOR: ${answers.element} → ${answers.color}`,
    questions: [
      { key: 'element', prompt: 'Element: ' },
      { key: 'color', prompt: 'New color (e.g., blue-500, #000, primary): ' }
    ]
  },
  text: {
    name: 'Change Text',
    template: (answers) => `TEXT: "${answers.old}" → "${answers.new}"`,
    questions: [
      { key: 'old', prompt: 'Current text: ' },
      { key: 'new', prompt: 'New text: ' }
    ]
  },
  width: {
    name: 'Change Width',
    template: (answers) => `WIDTH: ${answers.element} → ${answers.width}`,
    questions: [
      { key: 'element', prompt: 'Element: ' },
      { key: 'width', prompt: 'New width (e.g., 100%, max-w-6xl, 500px): ' }
    ]
  },
  style: {
    name: 'Add/Change Styles',
    template: (answers) => `STYLE: ${answers.element} → ${answers.styles}`,
    questions: [
      { key: 'element', prompt: 'Element: ' },
      { key: 'styles', prompt: 'Styles (e.g., border rounded-lg shadow-md): ' }
    ]
  }
};

const changes = [];

function showMenu() {
  console.log('\nQuick UI Changes Generator');
  console.log('=========================\n');
  console.log('Select change type:');
  Object.keys(CHANGES).forEach((key, idx) => {
    console.log(`${idx + 1}. ${CHANGES[key].name}`);
  });
  console.log('0. Done - Generate template\n');
}

async function askQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function collectChange(changeType) {
  const change = CHANGES[changeType];
  const answers = {};
  
  console.log(`\n${change.name}:`);
  for (const question of change.questions) {
    answers[question.key] = await askQuestion(question.prompt);
  }
  
  return change.template(answers);
}

async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Usage: node quick-changes.js <file-path>');
    process.exit(1);
  }

  showMenu();
  
  while (true) {
    const choice = await askQuestion('Choice: ');
    
    if (choice === '0') break;
    
    const changeKeys = Object.keys(CHANGES);
    const idx = parseInt(choice) - 1;
    
    if (idx >= 0 && idx < changeKeys.length) {
      const changeText = await collectChange(changeKeys[idx]);
      changes.push(changeText);
      console.log(`✓ Added: ${changeText}`);
    }
    
    showMenu();
  }
  
  // Generate the template
  const template = `# Visual Edit Request

## File: \`${filePath}\`

## Changes:
${changes.map(c => `- ${c}`).join('\n')}

## Instructions for AI:
Apply the changes listed above to the file. Use the existing component structure and styling patterns.
`;

  fs.writeFileSync('quick-edit-request.md', template);
  console.log('\n✅ Created quick-edit-request.md');
  console.log('Copy to clipboard: cat quick-edit-request.md | pbcopy');
  
  rl.close();
}

main().catch(console.error);