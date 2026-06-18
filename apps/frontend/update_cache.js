const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const v = Date.now();
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let updated = content.replace(/<script src="sidebar\.js[^"]*"><\/script>/g, `<script src="sidebar.js?v=${v}"></script>`);
  if (updated !== content) {
    fs.writeFileSync(f, updated);
    count++;
  }
});
console.log(`Updated sidebar.js version to ?v=${v} in ${count} HTML files.`);
