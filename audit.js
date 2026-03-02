const fs = require('fs');
const path = require('path');

const dir = './';
const cssFile = 'style.css';

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const cssContent = fs.readFileSync(cssFile, 'utf8');
// Simple regex to find class names in CSS
const classRegex = /\.([a-zA-Z0-9_-]+)(?![^{]*\})/g;
let match;
const cssClasses = new Set();
// We'll just grab everything that looks like a class definition
const cssLines = cssContent.split('\n');
cssLines.forEach(line => {
    // Basic extraction
    let m = line.match(/\.([a-zA-Z0-9_-]+)/g);
    if (m) {
        m.forEach(c => {
            let className = c.replace('.', '');
            // Filter out pseudos or generic elements
            if (isNaN(className[0])) {
                cssClasses.add(className);
            }
        });
    }
});

// Remove common third-party or functional classes that might not be directly in HTML
const ignoreList = ['horizontal-scroll', 'rule-enter', 'rule-enter-active', 'commission-tier-enter', 'commission-tier-enter-active', 'dt-button', 'dataTables_wrapper', 'dataTables_filter', 'peer-checked', 'visible', 'open', 'filter-modal', 'options-container'];
ignoreList.forEach(c => cssClasses.delete(c));

const classUsage = {};
for (const c of cssClasses) {
    classUsage[c] = 0;
}

const buttonClasses = [];
const paddingClasses = new Set();

htmlFiles.forEach(file => {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');

    // Check custom classes
    for (const c of cssClasses) {
        // Simple string finding for the class name
        if (html.includes(c)) {
            classUsage[c]++;
        }
    }

    // Check button inconsistencies
    // Find things like <button class="..."> or <a ... class="...btn...">
    const btnRegex = /class="([^"]*?(?:btn|button|bg-[a-zA-Z]+ text-white rounded-(lg|md|sm))[^"]*?)"/g;
    let btnMatch;
    while ((btnMatch = btnRegex.exec(html)) !== null) {
        buttonClasses.push({ file, classes: btnMatch[1] });
    }
});

const unusedClasses = Object.keys(classUsage).filter(c => classUsage[c] === 0);

console.log('--- Unused CSS Classes ---');
console.log(unusedClasses);

console.log('\n--- Button/Link Sizing Inconsistencies ---');
const btnSizings = buttonClasses.map(b => {
    // Extract padding (px, py, p-), text size (text-), and height (h-)
    const p = b.classes.match(/\bp[xytrbl]?-\d+\b/g) || [];
    const t = b.classes.match(/\btext-(xs|sm|base|lg|xl|2xl)\b/g) || [];
    const h = b.classes.match(/\bh-\d+\b/g) || [];
    return { file: b.file, raw: b.classes, sizing: [...p, ...t, ...h].sort().join(' ') };
});

const sizingCounts = {};
btnSizings.forEach(b => {
    if (b.sizing) {
        if (!sizingCounts[b.sizing]) sizingCounts[b.sizing] = [];
        sizingCounts[b.sizing].push(b.file);
    }
});

for (const [sizing, files] of Object.entries(sizingCounts)) {
    console.log(`[${sizing}] used ${files.length} times in: ${[...new Set(files)].join(', ')}`);
}
