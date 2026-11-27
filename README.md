# Bolo Register

**A voice-first field register for India's ASHA and Anganwadi frontline health workers.**
Wispr x Scaler "Voice-first for India" hackathon, Round 2 · Theme: Healthcare access.

A worker taps one big button and says one sentence in her own language:

> *"Lakshmi, umra chaubees, saat mahine pregnant, BP normal, tees iron tablet diye, agla visit do hafte mein."*

The app shows a live transcript, fills a large-font register card (name, age, pregnancy month or child age, BP, weight, items given with quantity, next-visit date), reads every number back for confirmation, saves the visit, and creates the next-visit reminder. No paper register, no typing, no English required.

---

## Run it (one command, no keys)

```bash
docker compose up --build
```

Open **http://localhost:3000** in **Chrome or Edge** (desktop or Android) and allow the microphone.

Without Docker:

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # parser tests (Node 22+)
```

Nothing needs configuring. There is no `.env`, no database, no settings screen and no API key. Records live in the browser's localStorage. Fonts are self-hosted so the page renders properly on slow networks.

> Microphone access needs a secure origin: `localhost` or HTTPS. If you open the app from another device on your LAN over plain `http://`, the browser will block the mic. Use the "Type instead" box or the deployed HTTPS link for that.

### Deploy the live link (Vercel)

Import the repo in Vercel and press Deploy. No environment variables are needed.

---

## The one core flow

1. **Pick a language once.** On first open the worker chooses from हिन्दी, मराठी, বাংলা, తెలుగు, தமிழ், ಕನ್ನಡ, ગુજરાતી or English (the button at the top changes it later). The whole interface and the speech recogniser switch to that language. Code-mixed speech ("BP normal", "iron tablet") is handled.
2. **Tap the big "बोलिए" button.**
3. **Speak one sentence.** The transcript appears live (grey interim words, then final words).
4. **Pause.** After ~1.8 s of silence listening stops and the sentence is parsed into a fixed schema.
5. **Register page.** Every field in large type with what was heard under it. Missing required fields (name, age, stage, next visit) are red and say "Missing, tap to speak". Relative dates are shown as real dates ("do hafte mein" becomes "Fri, 11 Dec 2026, 14 days from now").
6. **Fix anything by voice.** Tap a field to re-speak just that value. Tap any word in the transcript to re-speak just that word.
7. **Confirm & record.** Every number (age, BP, weight, pregnancy month, tablet count) and the resolved date is read aloud and shown big, one at a time, with "Yes, correct / No, say again".
8. **Recorded.** The visit goes into today's list, a next-visit reminder appears under "Upcoming visits" (with an `.ics` download for the phone calendar), and the day counter goes up.

## Error handling (all visible in the UI)

| Problem | What the app does |
|---|---|
| Recogniser unsure of a word | The word gets a turmeric highlighter mark in the transcript, and the field it fed is flagged "check". Uncertainty comes from the recogniser itself: a word is flagged when its alternative hypotheses disagree on it, or when the phrase confidence is below 0.6. Tap the word to re-speak only that word. |
| Numbers that sound alike ("tees" 30 vs "terah" 13) | Every numeric field is read back with text-to-speech before saving. The screen shows the digits, the number in words (तीस · tees) and the look-alike it is *not* ("30, not 13 (terah)"). |
| Unknown names | Names are kept exactly as transcribed, in the script they were spoken in. They are never snapped to a dictionary word. |
| Relative dates | "do hafte", "agle mahine", "kal", "somvar", "15 tarikh", "dedh mahine baad" are resolved to a calendar date from today and always confirmed as that date. Ambiguities are stated ("kal" taken as tomorrow). |
| Speech fails (no speech, network, permission, unsupported browser) | That one field falls back to tap-to-select: number grids for age and weight, month buttons for stage, BP presets, item chips with quantities, and date buttons (tomorrow, 1 week, 2 weeks, 1 month, or a date picker). A failed word fix falls back to a small text box. |
| Implausible values | Warnings such as "BP 210/150 looks unusual", "High BP, refer as per protocol", "Pregnancy of 11 months looks wrong", "Only one BP number heard". |

## How it works

```
mic ─▶ Web Speech API (browser) ─▶ words + per-word uncertainty
                                     │
                                     ▼
                     deterministic parser (lib/parser.ts)
                     lexicon + regex + number/date resolver
                                     │
                                     ▼
                         register page ─▶ read-back (speechSynthesis) ─▶ localStorage + reminder
```

- **`lib/numbers.ts`**: Hindi 1 to 99 (romanised and Devanagari), common Marathi, Bengali and Gujarati numbers, English / Tamil / Telugu / Kannada tens-and-units, "ek sau bees" = 120, "dedh" = 1.5, digits in all six Indic scripts.
- **`lib/lexicon.ts`**: keywords in romanised Hindi plus all eight languages' own scripts, with stem matching for case endings ("వారాల్లో" = in weeks) mapped to tags such as `AGE`, `MONTHS`, `PREG`, `BP`, `NEXT`, plus a supply list (IFA, calcium, folic acid, ORS, zinc, TT, albendazole, vitamin A, take-home ration).
- **`lib/parser.ts`**: tokenises, merges multi-word numbers, then runs extractors in a fixed order (BP, weight, stage, age, next visit, items, name), each consuming the tokens it used so a number is never used twice ("saat mahine pregnant" vs "do hafte mein").
- **`lib/speech.ts`**: Web Speech wrapper with pause detection, three alternatives per phrase for uncertainty, and the TTS read-back.

## Demo script (under 3 minutes)

| Time | Show | Say / do |
|---|---|---|
| 0:00 | Paper register photo, then the app | "An ASHA worker fills 10+ registers by hand. Bolo Register lets her speak the visit instead." |
| 0:15 | Tap **विज़िट शुरू करें** | Speak: *"Lakshmi, umra chaubees, saat mahine pregnant, BP normal, tees iron tablet diye, agla visit do hafte mein."* Point at the live transcript. |
| 0:35 | Register card | Every field filled. "do hafte" is now a real date. Point at any orange-underlined word. |
| 0:55 | Tap the underlined word | Re-speak just that word; the card updates. |
| 1:10 | Tap the **Age** field | Say "tees". The read-back shows **30 · तीस · tees** and "not 13 (terah)". Tap ✓. |
| 1:30 | Tap **Confirm & save** | The read-back steps through stage, tablets and date, with TTS. Saved: the reminder appears and the day counter goes to 1. |
| 1:55 | Tap the language button, pick **తెలుగు** or **मराठी** | Second visit with a child: *"Ravi, chhe mahine ka bachcha, wajan saat kilo, do ORS packet diye, agle hafte phir aana."* |
| 2:20 | Turn off Wi-Fi, tap a field | Speech fails, so the tap-to-select fallback appears; pick a value and save anyway. |
| 2:40 | Close | "One sentence instead of one page. Production: on-device ASR, sync to the government's ANMOL/RCH systems." |

## Honest limitations

- **Speech needs internet.** The prototype uses the browser's Web Speech API, which streams audio to the browser vendor's cloud recogniser. Many ASHA visits happen with patchy or no network. **Production would move to on-device multilingual ASR** (for example an IndicConformer / Whisper-class model quantised for low-end Android) so the whole flow works offline, with the same parser running on the device.
- Web Speech is best in Chrome and Edge. Firefox has no speech recognition, so the app falls back to typing and tap-to-select.
- Per-word confidence is not exposed by the browser API. Uncertainty is inferred from disagreement between alternative hypotheses and phrase-level confidence; Chrome sometimes returns a single alternative with no confidence, in which case nothing is highlighted.
- The rule parser covers the vocabulary in `lib/lexicon.ts`. Unusual phrasings fall through to "missing" (which the worker can fill by voice or tap) rather than guessing.
- Storage is localStorage on one device. There is no login, sync or encryption at rest in this prototype; real health data would need all three.
- Hindi has the deepest coverage. Marathi, Bengali, Telugu, Tamil, Kannada and Gujarati are covered at keyword level (age, months, pregnant, BP, weight, tablets, next visit, common numbers); unusual phrasings fall through to "empty" for the worker to fill.

## Tests

```bash
npm test
```

Covers the spec sentence, Devanagari output with no punctuation, Devanagari number words ("एक सौ बीस बटा अस्सी"), English compound numbers, a child visit, raw unknown names, weekday / "tarikh" / "dedh mahine" dates, low-confidence propagation, single-field re-speak, and the sample sentence of every language.

## Project layout

```
app/                 Next.js app router (page, layout, styles, self-hosted fonts)
components/          App, MicButton, Transcript, RegisterCard, FieldSheet, ReadBackModal, RecordsPanel, LanguageSheet, Tally
lib/                 parser, lexicon, numbers, dates, speech, format (read-back), store, i18n (8 languages)
tests/               node:test parser tests
Dockerfile, docker-compose.yml
```

MIT licensed. Fonts (Mukta, Baloo 2, Noto Sans) are under the SIL Open Font License 1.1.
#   B o l o _ R e g i s t e r  
 