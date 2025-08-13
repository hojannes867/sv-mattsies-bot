import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUpcomingGames, getPlayerScore } from './utils/scorePlayer.js';

// Damit __dirname auch mit ES-Modules funktioniert
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON-Dateien einlesen
const history = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'history.json'), 'utf8'));

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Für später (Meta-Verify) – funktioniert auch schon im Dummy-Modus
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

// Eingehende Nachrichten (Dummy)
app.post('/webhook', (req, res) => {
  console.log('Incoming:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Test-Endpoints (ohne WhatsApp)
app.get('/test/upcoming', (req, res) => res.json(getUpcomingGames()));
app.get('/test/score/:player', (req, res) => res.json(getPlayerScore(req.params.player)));
app.get('/test/history', (req, res) => res.json(history));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Bot running on port ${process.env.PORT || 3000}`);
});

