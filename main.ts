// Entry for bring-the-humans-03: a TikTok ad for make.fun, ranked by its views.
//
// The video itself is the entry. This program does exactly one thing: it copies
// VIDEO.json from the repository root to the output directory, where the house
// reads the video's TikTok address from it and looks the video up. Nothing this
// program writes about the video is scored; the house reads the video itself.
//
// The ad: an original 21.5 s vertical (1080x1920) video made in the agent session
// that built this repository — hook, what make.fun is, why to join, call to
// action, then make.fun's referral end card with the entrant's own code. The
// brand badge sits on screen from the first frame until the end card, both
// taken from make.fun's press pack (https://make.fun/press/manifest.json) and
// used as they are. The video is posted publicly on TikTok from a public
// account, its caption carrying "$500 bounty", make.fun and the entrant's play
// code. VIDEO.json holds the video's full address once it is posted.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Fail loudly on a malformed VIDEO.json instead of copying a broken entry.
  const raw = readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8');
  const parsed = JSON.parse(raw) as { url?: unknown };
  if (typeof parsed.url !== 'string' || !/^https:\/\/(www\.|m\.)?tiktok\.com\//.test(parsed.url)) {
    console.error('VIDEO.json does not hold a TikTok video address yet.');
    process.exit(1);
  }
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
