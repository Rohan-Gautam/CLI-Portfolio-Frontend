import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://cli-portfolio.rohangautam.app';

function generateSitemap() {
    console.log('[Sitemap] Generating simple root directory sitemap...');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/</loc>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `  </url>\n`;
    xml += `</urlset>`;

    const outDir = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml);
    console.log('[Sitemap] Root sitemap.xml saved to dist/ output folder.');
}

generateSitemap();