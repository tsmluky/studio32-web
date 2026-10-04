const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const manifest = JSON.parse(fs.readFileSync('docs/seo/MINIFIED_ASSETS.json', 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
for (const asset of manifest.assets) {
    assert.equal(hash('site/' + asset.source), asset.source_sha256_lf, 'regenerar minificado: ' + asset.source);
    assert.equal(hash('site/' + asset.target), asset.target_sha256_lf, 'minificado no corresponde al manifiesto: ' + asset.target);
    if (asset.target.endsWith('.js')) assert.equal(spawnSync(process.execPath, ['--check', 'site/' + asset.target]).status, 0);
}
const test = spawnSync(process.execPath, ['_plantillas/test-measurement.cjs'], { env: { ...process.env, MEASUREMENT_SOURCE: 'site/measurement-consent.min.js' }, stdio: 'inherit' });
assert.equal(test.status, 0, 'consentimiento minificado conserva privacidad');
console.log('Fuentes/minificados, hashes y privacidad de la versión publicada verificados.');
