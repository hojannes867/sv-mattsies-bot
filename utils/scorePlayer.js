import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON-Dateien sauber laden (ohne assert)
const games = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/games.json'), 'utf8')
);
const players = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/players.json'), 'utf8')
);

export function getUpcomingGames() {
  const now = new Date();
  return games.filter(g => new Date(g.date) >= now);
}

export function getPlayerScore(name) {
  const p = players.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!p) return { error: 'Spieler nicht gefunden' };

  // einfache Heuristik (0–10)
  const base = (p.form + p.fitness) / 2;
  const impact = p.stats.goals * 1.5 + p.stats.assists;
  const score = Math.max(0, Math.min(10, Math.round((base + impact) / 2)));

  return {
    player: p.name,
    score,
    form: p.form,
    fitness: p.fitness,
    goals: p.stats.goals,
    assists: p.stats.assists,
    note: 'Heuristik (MVP) – später erweitern'
  };
}

