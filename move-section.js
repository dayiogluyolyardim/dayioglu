const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /\s*<!-- Stats "Neden Biz\?" Section -->[\s\S]*?<\/section>/;
const match = html.match(regex);
if (match) {
    html = html.replace(match[0], '');
    html = html.replace('    <!-- District Selection Section -->', match[0].trimStart() + '\n\n    <!-- District Selection Section -->');
    fs.writeFileSync('index.html', html);
    console.log('Successfully moved the section');
} else {
    console.log('Section not found');
}
