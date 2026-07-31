const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'frontend/src'));
let modifiedCount = 0;

for(let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace string literals like "http://localhost:5000/api..."
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
    
    // Replace inside template literals like `http://localhost:5000${...}`
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated', file);
        modifiedCount++;
    }
}
console.log(`Replaced in ${modifiedCount} files.`);
