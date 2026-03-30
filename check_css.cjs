const fs = require('fs');
const content = fs.readFileSync('c:/Users/z/Documents/AK/AI/PCB Masterclass/pcb-masterclass-dashboard/src/index.css', 'utf8');
let open = 0;
let close = 0;
let line = 1;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') open++;
  if (content[i] === '}') close++;
  if (content[i] === '\n') line++;
  if (close > open) {
    console.error(`Mismatched closing brace at line ${line}`);
    process.exit(1);
  }
}
console.log(`Total Open: ${open}, Total Close: ${close}`);
if (open !== close) {
  console.error(`Unmatched braces! Open: ${open}, Close: ${close}`);
  process.exit(1);
}
