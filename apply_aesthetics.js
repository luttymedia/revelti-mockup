const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lewtc/Downloads/revelti/reveltiMockup/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f));

let gapChanges = 0;
let borderChanges = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Enhance whitespace on desktop elements
    content = content.replace(/lg:gap-6/g, 'lg:gap-8');
    content = content.replace(/gap-6 mb-8/g, 'gap-8 mb-8');

    // Soften borders and add shadow
    // Many cards use "bg-white p-4 rounded-lg border" or "bg-white rounded-lg shadow-lg"
    // Let's replace "border border-gray-200" with "border border-gray-100 shadow-sm" if we find it
    content = content.replace(/border border-gray-200/g, 'border border-gray-100 shadow-sm');

    // Some use just "border" without specifying color. Let's make them "border border-gray-100 shadow-sm"
    // e.g. class="bg-white p-4 rounded-lg border" -> class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
    content = content.replace(/class="bg-white p-4 rounded-lg border"/g, 'class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"');
    content = content.replace(/class="bg-gray-50 p-4 rounded-lg border"/g, 'class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"');

    // Soften shadow-lg to shadow-md
    content = content.replace(/shadow-lg/g, 'shadow-md');

    if (content !== original) {
        fs.writeFileSync(file, content);
        gapChanges++;
    }
});

console.log('Applied aesthetic changes to ' + gapChanges + ' files.');
