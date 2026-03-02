const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lewtc/Downloads/revelti/reveltiMockup/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f));

const configScript = `
    <!-- Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        revelti: {
                            blue: '#213c63',
                            orange: '#f58220',
                        }
                    }
                }
            }
        }
    </script>
`;

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('tailwind.config =')) {
        let result = content.replace(/<script src=\"https:\/\/cdn\.tailwindcss\.com\"><\/script>/g, '<script src=\"https://cdn.tailwindcss.com\"></script>\n' + configScript);
        if (result !== content) {
            fs.writeFileSync(file, result);
            count++;
        }
    }
});
console.log('Applied Tailwind Configs to ' + count + ' files.');
