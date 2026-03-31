const fs = require('fs');
const path = require('path');

let totalReplacements = 0;
let filesModified = new Set();
let replacementsLog = [];
let ambiguousCases = [];

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('.gemini')) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if ((file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) && !file.endsWith('refactor.js')) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
}

walk(__dirname, function(err, files) {
    if (err) throw err;

    files.forEach(file => {
        let originalContent = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file);
        let content = originalContent;

        // 1. Remove " - The Festival of Nations" and its en-dash variations
        content = content.replace(/\s*[-–]\s*The Festival of Nations/gi, '');
        content = content.replace(/The Festival of Nations/gi, 'Dance Fest Spain 2026'); // standalone leftover

        // 2. Exact slugs/URLs
        content = content.replace(/bachata-geneva-festival-20(\d{2})/gi, 'dance-fest-spain-20$1');
        content = content.replace(/bachata-geneva-festival/gi, 'dance-fest-spain');
        content = content.replace(/bachata-geneva/gi, 'lmp-events');
        content = content.replace(/"bgf2026"/gi, '"dance-fest-spain-2026"');
        content = content.replace(/event:\s*'bgf'/gi, "event: 'dfs'");
        content = content.replace(/id:\s*'bgf_/gi, "id: 'dfs_");
        content = content.replace(/'bgf_/gi, "'dfs_");
        content = content.replace(/value="bgf"/gi, 'value="dfs"');
        content = content.replace(/value="bgf2026"/gi, 'value="dance-fest-spain-2026"');

        // 3. Line by line text replacements
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let originalLine = line;

            // Editions with explicit years
            line = line.replace(/Bachata Geneva Festival 20(\d{2})/gi, 'Dance Fest Spain 20$1');
            line = line.replace(/Bachata Geneva 20(\d{2})/gi, 'Dance Fest Spain 20$1');
            line = line.replace(/BGF 20(\d{2})/gi, 'Dance Fest Spain 20$1');

            // "Bachata Geneva Festival" handling
            if (line.match(/Bachata Geneva Festival/i)) {
                line = line.replace(/Bachata Geneva Festival/gi, 'Dance Fest Spain');
                ambiguousCases.push(`[SERIES MAPPED] ${fileName}:${i+1} - ${originalLine.trim()}`);
            }

            // "Bachata Geneva" handling (Organizer)
            if (line.match(/Bachata Geneva/i) && !line.match(/Dance Fest Spain/)) {
                line = line.replace(/Bachata Geneva/gi, 'LMP Events');
                // ambiguousCases.push(`[ORGANIZER] ${fileName}:${i+1} - ${originalLine.trim()}`);
            }

            if (line !== originalLine) {
                totalReplacements++;
                filesModified.add(fileName);
                replacementsLog.push(`[${fileName}:${i+1}]\n- ${originalLine.trim()}\n+ ${line.trim()}\n`);
            }
            lines[i] = line;
        }

        content = lines.join('\n');

        // Apply changes
        fs.writeFileSync(file, content, 'utf8');
        fs.writeFileSync('refactor_diff.txt', replacementsLog.join('\n'));
        fs.writeFileSync('ambiguous_cases.txt', ambiguousCases.join('\n'));
    });

    console.log(`\n============== REFACTOR COMPLETE ==============`);
    console.log(`Total lines modified: ${totalReplacements}`);
    console.log(`Files touched: ${filesModified.size}`);
    console.log(`Check refactor_diff.txt for full diffs.`);
});
