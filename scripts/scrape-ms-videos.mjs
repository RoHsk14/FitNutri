// Extrait les vidéos YouTube et descriptions depuis les pages M&S
// Usage: node scripts/scrape-ms-videos.mjs > supabase/migrations/00011_ms_videos.sql

import * as https from 'https';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const CONCURRENCY = 3;
const CACHE_DIR = 'tmp/ms_video_pages';
if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractYouTubeId(html) {
  // Try JSON-LD embedUrl first
  const jm = html.match(/"embedUrl":"([^"]+)"/);
  if (jm) {
    const m = jm[1].match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  // Try iframe src
  const im = html.match(/<iframe[^>]*src="[^"]*youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (im) return im[1];
  return null;
}

function extractImageUrl(html) {
  const m = html.match(/og:image"[^>]*content="([^"]+)"/);
  return m ? m[1] : null;
}

function extractDescription(html) {
  // Extract exercise overview text
  const block = html.match(/field-name-field-exercise-overview[\s\S]*?field-items[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!block) return null;
  const text = block[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.substring(0, 500);
}

// Get all exercise slugs from our JSON
const data = JSON.parse(readFileSync('tmp/ms_exercises_db_v2.json', 'utf-8'));
const exercises = data.exercises || data;

console.error(`Total exercises: ${exercises.length}`);

const results = [];
let completed = 0;

for (let i = 0; i < exercises.length; i += CONCURRENCY) {
  const batch = exercises.slice(i, i + CONCURRENCY);
  const scraped = await Promise.all(batch.map(async (ex) => {
    const slug = ex.slug;
    const url = `https://www.muscleandstrength.com/exercises/${slug}.html`;
    const cacheKey = slug.replace(/[^a-z0-9_-]/g, '_');
    const cachePath = `${CACHE_DIR}/${cacheKey}.html`;

    let html;
    if (existsSync(cachePath)) {
      html = readFileSync(cachePath, 'utf-8');
    } else {
      try {
        html = await fetch(url);
      } catch { return { slug, error: 'fetch failed' }; }
      if (!html || html.length < 1000) return { slug, error: 'empty' };
      writeFileSync(cachePath, html);
    }

    const youtubeId = extractYouTubeId(html);
    const imageUrl = extractImageUrl(html);
    const desc = extractDescription(html);

    return {
      slug,
      name: ex.name,
      nameFrench: ex.nameFrench,
      youtubeId,
      videoUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null,
      embedUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}?rel=0` : null,
      imageUrl,
      description: desc,
    };
  }));

  for (const r of scraped) {
    if (r.error) {
      console.error(`  FAIL ${r.slug}: ${r.error}`);
    } else {
      results.push(r);
    }
  }

  completed += batch.length;
  if (completed % 50 === 0 || completed === exercises.length) {
    const withVideo = results.filter(r => r.youtubeId).length;
    console.error(`Progress: ${completed}/${exercises.length} (${withVideo} with video)`);
  }
}

// Generate SQL
let sql = `-- Migration 00011: Vidéos YouTube et descriptions depuis Muscle & Strength
-- Généré le ${new Date().toISOString().split('T')[0]}

`;

const withVideo = results.filter(r => r.youtubeId);
const withDesc = results.filter(r => r.description);
const withImg = results.filter(r => r.imageUrl);

console.error(`\nResults: ${results.length} total, ${withVideo.length} with video, ${withDesc.length} with description, ${withImg.length} with image`);

// UPDATE for video_url
for (const r of results) {
  if (r.embedUrl || r.description || r.imageUrl) {
    const name = r.nameFrench || r.name;
    const sets = [];
    if (r.embedUrl) sets.push(`video_url = '${r.embedUrl}'`);
    if (r.description) sets.push(`description = '${r.description.replace(/'/g, "''")}'`);
    if (r.imageUrl) sets.push(`image_url = '${r.imageUrl}'`);
    if (sets.length > 0) {
      sql += `update fit_exercises set ${sets.join(', ')} where name = '${name.replace(/'/g, "''")}';\n`;
    }
  }
}

sql += `\n-- Vérification\nselect name, video_url is not null as has_video, description is not null as has_desc from fit_exercises order by name;\n`;

writeFileSync('supabase/migrations/00011_ms_videos.sql', sql);
console.error(`\nWrote supabase/migrations/00011_ms_videos.sql (${(sql.length / 1024).toFixed(0)} KB)`);
