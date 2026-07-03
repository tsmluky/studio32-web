const fs = require("fs");
const path = require("path");

const files = [
  "index.html",
  "styles.css",
  "script.js",
];

const backupDir = "_backups";
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

const replacements = [
  ["\u00C2\u00B7", "\u00B7"],
  ["\u00C2\u00A0", " "],
  ["\u00C2\u00BF", "\u00BF"],
  ["\u00C2\u00A1", "\u00A1"],

  ["\u00C3\u00A1", "\u00E1"],
  ["\u00C3\u00A9", "\u00E9"],
  ["\u00C3\u00AD", "\u00ED"],
  ["\u00C3\u00B3", "\u00F3"],
  ["\u00C3\u00BA", "\u00FA"],
  ["\u00C3\u00B1", "\u00F1"],

  ["\u00C3\u0081", "\u00C1"],
  ["\u00C3\u0089", "\u00C9"],
  ["\u00C3\u008D", "\u00CD"],
  ["\u00C3\u0093", "\u00D3"],
  ["\u00C3\u009A", "\u00DA"],
  ["\u00C3\u0091", "\u00D1"],

  ["\u00E2\u20AC\u201C", "\u2013"],
  ["\u00E2\u20AC\u201D", "\u2014"],
  ["\u00E2\u20AC\u0153", "\u201C"],
  ["\u00E2\u20AC\u009D", "\u201D"],
  ["\u00E2\u20AC\u02DC", "\u2018"],
  ["\u00E2\u20AC\u2122", "\u2019"],
  ["\u00E2\u20AC\u00A6", "\u2026"],
];

function fixText(input) {
  let text = input;

  for (let round = 0; round < 5; round++) {
    const before = text;

    for (const [bad, good] of replacements) {
      text = text.split(bad).join(good);
    }

    if (text === before) break;
  }

  return text;
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP ${file}`);
    continue;
  }

  const original = fs.readFileSync(file, "utf8");
  const backupPath = path.join(
    backupDir,
    `${file}.before-node-encoding-fix.${timestamp}`
  );

  fs.writeFileSync(backupPath, original, "utf8");

  const fixed = fixText(original);
  fs.writeFileSync(file, fixed, "utf8");

  const beforeBad = (original.match(/[\u00C2\u00C3]/g) || []).length;
  const afterBad = (fixed.match(/[\u00C2\u00C3]/g) || []).length;

  console.log(`OK ${file}`);
  console.log(`  suspicious before: ${beforeBad}`);
  console.log(`  suspicious after:  ${afterBad}`);
}

console.log("");
console.log("Encoding fix complete.");
