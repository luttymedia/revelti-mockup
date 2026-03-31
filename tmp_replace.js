const fs = require('fs');
const file = 'organizerMediaWorkspace.html';
let content = fs.readFileSync(file, 'utf8');

// Replace event: 'dfs'
content = content.replace(/event:\s*'bgf'/g, "event: 'dfs'");
// Replace id: 'dfs_...'
content = content.replace(/id:\s*'dfs_/g, "id: 'dfs_");
// Replace "bgf_" in other contexts (like children arrays)
content = content.replace(/'dfs_/g, "'dfs_");

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced bgf with dfs in organizerMediaWorkspace.html');
