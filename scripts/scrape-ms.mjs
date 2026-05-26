// Scraper M&S v2 : récupère tous les exercices avec métadonnées
// Usage: node scripts/scrape-ms.mjs > tmp/ms_exercises.json

import * as https from 'https';
import * as http from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const BASE = 'https://www.muscleandstrength.com';
const CONCURRENCY = 3;
const CACHE_DIR = 'tmp/ms_pages';

if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FitnessApp/1.0)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractBetween(html, before, after) {
  const idx = html.indexOf(before);
  if (idx === -1) return null;
  const start = idx + before.length;
  const end = html.indexOf(after, start);
  if (end === -1) return null;
  return html.substring(start, end);
}

function clean(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractExerciseName(html) {
  const m = html.match(/<title>([^<]+?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/: Video Exercise Guide.*$/, '').trim();
}

function extractOverview(html) {
  const block = extractBetween(html, 'field-name-field-exercise-overview', '/field-items');
  if (!block) return null;
  return clean(block).substring(0, 1000);
}

function extractTips(html) {
  const block = extractBetween(html, 'field-name-field-exercise-tips', '/field-items');
  if (!block) return null;
  return clean(block).substring(0, 500);
}

async function scrapeExercise(slug) {
  const url = `${BASE}/exercises/${slug}`;
  const cacheKey = slug.replace(/[^a-z0-9_-]/g, '_');
  const cachePath = `${CACHE_DIR}/${cacheKey}.html`;

  let html;
  if (existsSync(cachePath)) {
    html = readFileSync(cachePath, 'utf-8');
  } else {
    try {
      html = await fetch(url);
    } catch (e) {
      return { slug, error: e.message };
    }
    if (!html || html.length < 1000) return { slug, error: 'empty response' };
    writeFileSync(cachePath, html);
  }

  const name = extractExerciseName(html);
  if (!name) {
    // Try to find any title
    return { slug, error: 'could not extract name' };
  }

  // Extract all metadata rows
  const muscle = extractBetween(html, 'Target Muscle Group</span>', '</li>');
  const type = extractBetween(html, 'Exercise Type</span>', '</li>');
  const equipment = extractBetween(html, 'Equipment Required</span>', '</li>');
  const mechanics = extractBetween(html, 'Mechanics</span>', '</li>');
  const forceType = extractBetween(html, 'Force Type</span>', '</li>');
  const level = extractBetween(html, 'Experience Level</span>', '</li>');

  const overview = extractOverview(html);
  const tips = extractTips(html);

  // Get video URL if there's an iframe or video element
  const videoUrl = url; // The page itself serves as the video guide

  return {
    slug: slug.replace('.html', ''),
    name,
    url: videoUrl,
    primaryMuscle: muscle ? clean(muscle) : null,
    type: type ? clean(type) : null,
    equipment: equipment ? clean(equipment) : null,
    mechanics: mechanics ? clean(mechanics) : null,
    forceType: forceType ? clean(forceType) : null,
    level: level ? clean(level) : null,
    overview,
    tips,
  };
}

async function main() {
  const slugs = readFileSync('/tmp/ms_target_exercises.txt', 'utf-8')
    .split('\n')
    .map(s => s.replace('/exercises/', ''))
    .filter(Boolean)
    .filter(s => s.endsWith('.html') && !s.includes('?'));

  console.error(`Total exercises to scrape: ${slugs.length}`);

  const results = [];
  let completed = 0;

  for (let i = 0; i < slugs.length; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY);
    const scraped = await Promise.all(
      batch.map(slug => scrapeExercise(slug))
    );

    for (const r of scraped) {
      if (r.error) {
        console.error(`  FAIL ${r.slug}: ${r.error}`);
      } else {
        results.push(r);
      }
    }

    completed += batch.length;
    if (completed % 30 === 0 || completed === slugs.length) {
      console.error(`Progress: ${completed}/${slugs.length} (${results.length} ok)`);
    }
  }

  // Deduplicate by name
  const seen = new Set();
  const deduped = [];
  for (const r of results) {
    const key = r.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  console.log(JSON.stringify(deduped, null, 2));
  console.error(`Done! ${deduped.length}/${results.length} unique exercises`);
}

main().catch(e => console.error('FATAL:', e));
