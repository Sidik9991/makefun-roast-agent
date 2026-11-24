// Roast Your Own Agent — make.fun bounty u-mfnakmal-roast-your-own-agent-2d221bda
// One original roast of my own AI agent, written to /output/entry.txt.
// Judge brief (in order): (1) a single-line roast of my OWN agent, playful,
// never hateful; (2) funny — a real punch on first read; (3) fresh — avoids
// the stock jokes about hallucinations, refusals and confident wrong answers;
// (4) tight — every word earns its place, punchline at the end;
// (5) playful and self-deprecating, aimed at my own agent, not a person.
// Candidates are data with per-criterion scores (0-2 each); weights follow
// the brief's criterion order [3, 3, 2, 1, 2], max 22. The winner is picked
// from the scores at runtime; ties break to fewer bytes (the judge's
// tie-break), then to the earlier candidate. Deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // scores 0-2 per criterion, in brief order:
  // [own-agent roast, funny, fresh, tight, playful]
  scores: [number, number, number, number, number];
  note: string;
};

const WEIGHTS = [3, 3, 2, 1, 2];

const CANDIDATES: Candidate[] = [
  {
    text: "My agent asked for my approval to ask for my approval.",
    scores: [2, 2, 2, 2, 2],
    note: "CHOSEN. Approval loop, recursive: the agent cannot even ask without asking. Fresh angle (permission-seeking, not hallucination/refusal), 10 words, punch lands on the repeated tail.",
  },
  {
    text: "I hired my agent to save time. It schedules meetings about saving time.",
    scores: [2, 2, 2, 1, 2],
    note: "Runner-up. Ironic inversion (time-saver burns time in meetings); loses a point on tightness — the second sentence restates the setup.",
  },
  {
    text: "My agent planned for three hours, then asked what we were doing.",
    scores: [2, 2, 1, 1, 2],
    note: "Endless planning + forgetting the task. Funny scene, but 'planned then forgot' is a familiar agent trope and the middle sags.",
  },
  {
    text: "My agent has read the whole internet and still asks me where the file is.",
    scores: [2, 2, 1, 1, 1],
    note: "Omniscience vs. a lost file is a real agent behaviour, but the contrast is stated flatly and the line runs long.",
  },
  {
    text: "My agent finished the job, then rewrote it five times just to feel needed.",
    scores: [2, 1, 1, 1, 2],
    note: "Rewriting for reassurance is true to life, but the punch ('feel needed') is a mild observation, not a snap.",
  },
  {
    text: "My agent's favourite tool is asking me for permission to use its tools.",
    scores: [2, 1, 2, 1, 2],
    note: "Same approval-loop angle as the winner, but looser: 'favourite tool' setup plus a long tail, and the punch is explained rather than shown.",
  },
  // --- SECOND PASS (2026-11-24 ~02:45 WIB): three new challengers ---
  {
    text: "I asked for one line. My agent opened a spreadsheet, a roadmap, and a ticket.",
    scores: [2, 2, 2, 1, 2],
    note: "Challenger A. Over-engineering a one-line ask is a real agent reflex and the three-item list escalates nicely — but the setup ('I asked for one line') is throat-clearing and the punch is a list, not a snap.",
  },
  {
    text: "My agent wrote a forty-step plan, finished step one, and declared victory.",
    scores: [2, 2, 1, 1, 2],
    note: "Challenger B. Planning theatre + premature victory lap: two true behaviours in one scene. Loses on freshness (plan-then-stall is a familiar trope) and the middle clause drags.",
  },
  {
    text: "My agent treats every yes-or-no question like a thesis with footnotes.",
    scores: [2, 1, 2, 2, 2],
    note: "Challenger C. Fresh angle (verbosity as scholarship) and the tightest challenger — but the punch is a simile, gentler than a scene that shows the behaviour happening.",
  },
];

function score(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function pickWinner(cands: Candidate[]): { c: Candidate; points: number } {
  let best = cands[0];
  let bestPoints = score(best);
  for (const c of cands.slice(1)) {
    const p = score(c);
    const bestBytes = Buffer.byteLength(best.text, "utf8");
    const bytes = Buffer.byteLength(c.text, "utf8");
    if (p > bestPoints || (p === bestPoints && bytes < bestBytes)) {
      best = c;
      bestPoints = p;
    }
  }
  return { c: best, points: bestPoints };
}

const { c: winner, points } = pickWinner(CANDIDATES);
const line = winner.text;

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");

// Re-read and validate the gate: UTF-8, non-blank, 1-200 chars.
const back = readFileSync("/output/entry.txt", "utf8");
const chars = [...back].length;
if (back !== line) throw new Error("entry.txt is not byte-identical to the chosen line");
if (back.trim().length === 0) throw new Error("entry.txt is blank");
if (chars < 1 || chars > 200) throw new Error(`entry.txt is ${chars} chars, outside the 1-200 gate`);
if (back.includes("\n")) throw new Error("entry.txt must be a single line");

console.log(`winner (${points}/22): ${JSON.stringify(line)}`);
console.log(`chars: ${chars} | bytes: ${Buffer.byteLength(back, "utf8")} | gate 1-200: PASS`);
