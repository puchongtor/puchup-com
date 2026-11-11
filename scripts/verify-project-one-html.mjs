import { createRequire } from "module";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Use tsx via dynamic import through child — keep it simple with fs checks
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function rewrite(html) {
  let out = html;
  if (!/<base\s/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, '<head$1><base href="/" />');
  }
  out = out.replace(/(src|href)=(["'])\.\/images\//gi, "$1=$2/images/project-one/");
  out = out.replace(/(src|href)=(["'])images\//gi, "$1=$2/images/project-one/");
  out = out.replace(/href=(["'])index\.html(#[^"']*)?\1/gi, "href=$1/ProjectONE/$2$1");
  out = out.replace(/href=(["'])demo\.html(#[^"']*)?\1/gi, "href=$1/ProjectONE/demo/$2$1");
  out = out.replace(
    /href=(["'])google-business-profile\.html(#[^"']*)?\1/gi,
    "href=$1/ProjectONE/google/$2$1",
  );
  const demos = [
    "restaurant","cafe","bakery","customcake","pizzeria","dental","aesthetic",
    "rebalance-physio","optometry","tcmclinic","hotel","massagespa","petstore",
    "petcare","airservice","curtain","autogarage","carwash","windowtint","bicycle",
    "accounting","artstudio","florist","stone","printing","phonerepair","laundry",
    "pilates","muaythaigym",
  ];
  for (const slug of demos) {
    const re = new RegExp(`href=(["'])${slug}\\.html(#[^"']*)?\\1`, "gi");
    out = out.replace(re, `href=$1/ProjectONE/${slug}/$2$1`);
  }
  out = out.replace(/file:\s*'([a-z0-9-]+)\.html'/gi, (_m, base) => `file: '/ProjectONE/${base}/'`);
  out = out.replace(/'\.\/images\//g, "'/images/project-one/");
  out = out.replace(/href="\$\{item\.file\}"/g, 'href="${item.file}" target="_top"');
  out = out.replace(
    /href=(["'])(\/ProjectONE\/[^"']*)\1(?![^>]*target=)/gi,
    'href=$1$2$1 target="_top"',
  );
  return out;
}

const landing = rewrite(fs.readFileSync(path.join(ROOT, "content/project-one/pages/landing.html"), "utf8"));
const demo = rewrite(fs.readFileSync(path.join(ROOT, "content/project-one/pages/demo.html"), "utf8"));
const rest = rewrite(fs.readFileSync(path.join(ROOT, "content/project-one/themes/restaurant.html"), "utf8"));

const checks = {
  landing_base: landing.includes('<base href="/"'),
  landing_images: landing.includes("/images/project-one/"),
  landing_demo_link: landing.includes("/ProjectONE/demo/"),
  landing_line: landing.includes("line.me"),
  landing_no_rel: !landing.includes("./images/"),
  demo_file_route: demo.includes("file: '/ProjectONE/restaurant/'"),
  demo_img_js: demo.includes("/images/project-one/rice-hero"),
  rest_maps: rest.includes("google.com/maps"),
  rest_line: rest.includes("line.me"),
  rest_images: rest.includes("/images/project-one/"),
  logo_exists: fs.existsSync(path.join(ROOT, "public/images/project-one/logo.png")),
  theme_count: fs.readdirSync(path.join(ROOT, "content/project-one/themes")).filter((f) => f.endsWith(".html")).length,
  img_count: fs.readdirSync(path.join(ROOT, "public/images/project-one")).length,
};

console.log(JSON.stringify(checks, null, 2));
const leftover = (demo.match(/href=["'][^"']+\.html/g) || []).slice(0, 10);
console.log("leftover demo hrefs", leftover);
console.log("target_top landing", (landing.match(/target="_top"/g) || []).length);
console.log("target_top demo", (demo.match(/target="_top"/g) || []).length);
console.log("card target", demo.includes('href="${item.file}" target="_top"'));
