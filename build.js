const fs = require("fs");
const path = require("path");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");

const srcDir = "src";
const distDir = "dist";

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".mjml"));

files.forEach((file) => {
  const name = path.basename(file, ".mjml");
  const templateStr = fs.readFileSync(path.join(srcDir, file), "utf8");
  const versionsPath = path.join(srcDir, `${name}.versions.json`);
  if (!fs.existsSync(versionsPath)) {
    console.warn(`⚠️ Pas de fichier ${name}.versions.json — ignoré`);
    return;
  }

  const versions = JSON.parse(fs.readFileSync(versionsPath, "utf8"));
  const template = Handlebars.compile(templateStr);
  const outputDir = path.join(distDir, name);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  versions.forEach((entry) => {
    const html = mjml2html(template(entry), { minify: true }).html;
    fs.writeFileSync(path.join(outputDir, entry.filename), html);
    console.log(`✅ ${entry.filename} generated for ${name}`);
  });
});
