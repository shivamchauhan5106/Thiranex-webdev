import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var root = path.join(__dirname, "..");
var dist = path.join(root, "dist");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(function (entry) {
    var src = path.join(srcDir, entry.name);
    var dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  });
}

async function minifyFile(src, dest) {
  var code = fs.readFileSync(src, "utf8");
  var result = await minifyJs(code, { module: true, format: { comments: false } });
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, result.code);
}

function collectJsFiles(dir, list) {
  list = list || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectJsFiles(full, list);
    else if (entry.name.endsWith(".js")) list.push(full);
  });
  return list;
}

async function build() {
  if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
  ensureDir(dist);

  var cssInput = fs.readFileSync(path.join(root, "css", "styles.css"), "utf8");
  var cssOutput = new CleanCSS({ level: 2 }).minify(cssInput);
  ensureDir(path.join(dist, "css"));
  fs.writeFileSync(path.join(dist, "css", "styles.min.css"), cssOutput.styles);

  var indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
  indexHtml = indexHtml.replace("css/styles.css", "css/styles.min.css");
  fs.writeFileSync(path.join(dist, "index.html"), indexHtml);

  copyDir(path.join(root, "assets"), path.join(dist, "assets"));
  copyFile(path.join(root, "robots.txt"), path.join(dist, "robots.txt"));
  copyFile(path.join(root, "sitemap.xml"), path.join(dist, "sitemap.xml"));
  copyFile(path.join(root, "public", "_redirects"), path.join(dist, "_redirects"));

  var jsFiles = collectJsFiles(path.join(root, "js"));
  for (var i = 0; i < jsFiles.length; i++) {
    var rel = path.relative(path.join(root, "js"), jsFiles[i]);
    await minifyFile(jsFiles[i], path.join(dist, "js", rel));
  }

  var stats = fs.statSync(path.join(dist, "css", "styles.min.css"));
  console.log("Build complete → dist/");
  console.log("  CSS minified:", stats.size, "bytes");
  console.log("  JS files:", jsFiles.length);
}

build().catch(function (err) {
  console.error(err);
  process.exit(1);
});
