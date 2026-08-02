const fs = require('fs');
let content = fs.readFileSync('src/data/jobDetails.ts', 'utf8');

// Find the injection and remove it
const badStart = content.indexOf(`  'cwc-young-professional-2026': {`);
if (badStart !== -1) {
  let before = content.slice(0, badStart);
  let after = content.slice(badStart);
  
  const endInjection = after.indexOf("  },\n};") + 7;
  after = after.slice(endInjection);
  
  content = before + "  };\n" + after;
  fs.writeFileSync('src/data/jobDetails.ts', content);
  console.log('Fixed interface!');
}
