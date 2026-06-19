const fs = require('fs');
const path = 'c:\\Users\\user\\Documents\\AI HR 2026\\js\\app.js';

let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('function PreAssessment()');
if (startIdx !== -1) {
    let pre = content.substring(0, startIdx);
    let post = content.substring(startIdx);
    
    post = post.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
    
    fs.writeFileSync(path, pre + post, 'utf8');
    console.log('Fixed!');
} else {
    console.log('Not found!');
}
