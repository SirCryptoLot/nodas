// Pagalbinės funkcijos testams, kurie skaito sukurtą svetainę iš dist/.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIST = fileURLToPath(new URL('../../dist/', import.meta.url));

export function fileFor(path) {
  if (path === '/') return join(DIST, 'index.html');
  return join(DIST, path.replace(/^\//, '') + '.html');
}

export function exists(path) {
  return existsSync(fileFor(path));
}

export function page(path) {
  return readFileSync(fileFor(path), 'utf8');
}

export function readDist(rel) {
  return readFileSync(join(DIST, rel), 'utf8');
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

export function distFiles() {
  return walk(DIST).map((p) => relative(DIST, p).split(sep).join('/'));
}

// Visų sukurtų puslapių keliai, pvz. '/', '/iranga', '/iranga/dgx-spark'.
export function allPages() {
  return distFiles()
    .filter((f) => f.endsWith('.html'))
    .map((f) => (f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, '')));
}

export function jsonld(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

export function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}
