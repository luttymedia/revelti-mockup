const fs = require('fs');
const path = require('path');

const dir = './';
const cssFile = 'style.css';

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Categorize files
const attendeeFiles = [];
const organizerFiles = [];

htmlFiles.forEach(file => {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    // Simple heuristic: Attendees have a white header (or #navbar-placeholder which is white),
    // Organizers have #organizer-navbar-placeholder or explicit "Organizer View" text
    if (html.includes('id="organizer-navbar-placeholder"') || html.toLowerCase().includes('organizer dashboard')) {
        organizerFiles.push(file);
    } else {
        // Assume Attendee unless otherwise specified
        attendeeFiles.push(file);
    }
});

function getButtonSizings(files) {
    const buttonClasses = [];
    files.forEach(file => {
        const html = fs.readFileSync(path.join(dir, file), 'utf8');
        const btnRegex = /class="([^"]*?(?:btn|button|bg-[a-zA-Z]+ text-white rounded-(lg|md|sm))[^"]*?)"/g;
        let btnMatch;
        while ((btnMatch = btnRegex.exec(html)) !== null) {
            buttonClasses.push({ file, classes: btnMatch[1] });
        }
    });

    const btnSizings = buttonClasses.map(b => {
        const p = b.classes.match(/\bp[xytrbl]?-\d+\b/g) || [];
        const t = b.classes.match(/\btext-(xs|sm|base|lg|xl|2xl)\b/g) || [];
        const h = b.classes.match(/\bh-\d+\b/g) || [];
        return { file: b.file, raw: b.classes, sizing: [...p, ...t, ...h].sort().join(' ') };
    });

    const sizingCounts = {};
    btnSizings.forEach(b => {
        if(b.sizing) {
            if(!sizingCounts[b.sizing]) sizingCounts[b.sizing] = [];
            sizingCounts[b.sizing].push(b.file);
        }
    });

    return sizingCounts;
}

console.log('--- ATTENDEE VIEW BUTTON SIZINGS ---');
const attendeeSizings = getButtonSizings(attendeeFiles);
for(const [sizing, files] of Object.entries(attendeeSizings)) {
    console.log(`[${sizing}] used ${files.length} times in: ${[...new Set(files)].join(', ')}`);
}

console.log('\n--- ORGANIZER VIEW BUTTON SIZINGS ---');
const organizerSizings = getButtonSizings(organizerFiles);
for(const [sizing, files] of Object.entries(organizerSizings)) {
    console.log(`[${sizing}] used ${files.length} times in: ${[...new Set(files)].join(', ')}`);
}
