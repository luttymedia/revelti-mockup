const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lewtc/Downloads/revelti/reveltiMockup/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f));

let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace the long list of classes with the single component class 'btn-mobile-tab'
    // Note that 'tab-button' is already present but usually there's also 'flex-1 py-3 px-1 text-center text-gray-500 hover:revelti-blue transition duration-300'
    // Let's replace the block of classes.
    const regex = /tab-button flex-1 py-3 px-1 text-center text-gray-500 hover:revelti-blue transition duration-300/g;
    content = content.replace(regex, 'tab-button btn-mobile-tab');

    // Some tabs might have 'hover:text-revelti-blue' instead
    const regex2 = /tab-button flex-1 py-3 px-1 text-center text-gray-500 hover:text-revelti-blue transition duration-300/g;
    content = content.replace(regex2, 'tab-button btn-mobile-tab');

    if (content !== original) {
        fs.writeFileSync(file, content);
        changes++;
    }
});

console.log('Consolidated tab buttons in ' + changes + ' files.');
