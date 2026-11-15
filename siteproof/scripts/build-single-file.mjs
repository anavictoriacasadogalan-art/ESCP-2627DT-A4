import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('dist',{recursive:true});
let html=readFileSync('index.html','utf8');
const css=readFileSync('css/styles.css','utf8');
html=html.replace('<link rel="stylesheet" href="css/styles.css">',`<style>${css}</style>`);
for(const file of ['js/store.js','js/scenes.js','js/seed.js','js/app.js']){
  const source=readFileSync(file,'utf8');
  html=html.replace(`<script src="${file}"></script>`,`<script>${source}</script>`);
}
writeFileSync('dist/siteproof.html',html);
console.log('Built dist/siteproof.html');
