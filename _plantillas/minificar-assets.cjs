// Herramienta de mantenimiento; no añade dependencias ni build al despliegue.
// node _plantillas/minificar-assets.cjs --tools <carpeta de herramientas externa>
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');
const tools = process.argv.indexOf('--tools');
const lookup = tools >= 0 ? [path.resolve(process.argv[tools + 1])] : [root];
const terser = require(require.resolve('terser', { paths: lookup }));
const CleanCSS = require(require.resolve('clean-css', { paths: lookup }));
const version = '20261004-min-1';
const names = ['home-bundle.css', 'script.js', 'measurement-consent.css', 'measurement-consent.js', 'discovery.css', 'discovery-events.js', 'vertical.css'];
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
async function main() {
    const assets = [];
    for (const name of names) {
        const source = fs.readFileSync(path.join(site, name), 'utf8').replace(/\r\n/g, '\n');
        let output;
        if (name.endsWith('.js')) {
            // Sin compresión lógica ni renombrado: conservar nombres/código de la demo.
            output = (await terser.minify(source, { compress: false, mangle: false, format: { comments: /^!|@license|@preserve/i } })).code;
        } else {
            const result = new CleanCSS({ level: 1, rebase: false }).minify(source);
            if (result.errors.length) throw Error(result.errors.join('\n'));
            output = result.styles;
        }
        output += '\n';
        const target = name.replace(/\.(css|js)$/, '.min.$1');
        fs.writeFileSync(path.join(site, target), output);
        assets.push({ source: name, target, source_sha256_lf: hash(source), target_sha256_lf: hash(output), bytes_before: Buffer.byteLength(source), bytes_after: Buffer.byteLength(output), gzip_before: zlib.gzipSync(source).length, gzip_after: zlib.gzipSync(output).length });
    }
    function visit(folder) {
        for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
            const file = path.join(folder, entry.name);
            if (entry.isDirectory()) visit(file);
            else if (entry.name.endsWith('.html')) {
                let text = fs.readFileSync(file, 'utf8');
                text = text.replace(/\b(src|href)=(['"])([^'"]+)\2/g, (original, attr, quote, href) => {
                    if (/^(?:[a-z]+:|\/\/)/i.test(href)) return original;
                    const bare = href.split('?')[0];
                    for (const asset of assets) {
                        const sourcePath = bare.endsWith(asset.target) ? bare.slice(0, -asset.target.length) + asset.source : bare;
                        const resolved = path.resolve(bare.startsWith('/') ? site : path.dirname(file), sourcePath.replace(/^\//, ''));
                        if (resolved === path.join(site, asset.source)) {
                            const targetPath = sourcePath.slice(0, -asset.source.length) + asset.target;
                            return attr + '=' + quote + targetPath + '?v=' + version + quote;
                        }
                        // Mantener scripts de cada demo separados del script de portada.
                        if (bare.endsWith(asset.target) && fs.existsSync(resolved)) {
                            return attr + '=' + quote + sourcePath + quote;
                        }
                    }
                    return original;
                });
                fs.writeFileSync(file, text);
            }
        }
    }
    visit(site);
    fs.writeFileSync(path.join(root, 'docs/seo/MINIFIED_ASSETS.json'), JSON.stringify({ version, tools: { terser: '5.51.2', clean_css: '5.3.3' }, assets }, null, 2) + '\n');
    console.log(JSON.stringify(assets.map(({ source, bytes_before, bytes_after, gzip_before, gzip_after }) => ({ source, bytes_before, bytes_after, gzip_before, gzip_after })), null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
