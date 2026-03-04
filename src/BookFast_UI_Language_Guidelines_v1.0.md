# BookFast UI Language Guidelines (DE + EN) — v1.0

**UI-Sprachleitfaden (Deutsch + Englisch)**  
**Version:** v1.0  
**Datum:** 2026-01-08  
**Owner:** BookFast product team  
**Scope:** Customer booking widget (B2C) + Partner/Admin dashboard (B2B) + in-app messages (errors, confirmations, empty states)

---

## Contents

1. Quick rules (one page)  
2. Product voice and tone  
3. Audience, pronouns, and form of address (DE)  
4. Writing principles and formatting rules  
5. Terminology and glossary (EN <-> DE)  
6. Microcopy patterns (buttons, forms, empty states, notifications)  
7. Error and success messaging system  
8. Accessibility and inclusive language  
9. Localization rules (DE/EN)  
10. Examples library for BookFast flows  
11. Copy QA checklist  

---

## 1. Quick rules

If you only read one page, read this.

- **Write for the next action:** every screen must guide what to do next.
- **Buttons are verbs:** “Save changes”, “Confirm booking” (no “OK”).
- **One concept, one term:** follow the glossary and avoid synonyms.
- **Keep it calm:** no blame or panic language in warnings/errors.
- **Make fixes obvious:** errors must say how to resolve the issue.
- **Du/Sie is fixed per surface:** widget = Du, dashboard = Sie. *(Note: This was v1.0; later project decisions may override.)*
- **Sentence case:** headings, labels, and buttons (no ALL CAPS).
- **Plain language:** avoid jargon and idioms; short sentences.
- **Localize formats:** date/time/currency follow locale.
- **Accessibility first:** self-describing labels; screenreader-friendly text.

---

## 2. Product voice and tone

**Voice** is stable (who BookFast is). **Tone** adapts to context (what is happening).

### Voice attributes

| Voice attribute | What it means | In practice |
|---|---|---|
| Clear | Users understand what happens next. | Use specific verbs; avoid vague labels like “OK”. |
| Calm | Reduce stress in high-friction moments. | No blame, no panic language in errors. |
| Helpful | Guide users to the next step. | Always offer a fix or a best next action. |
| Confident | Sound professional and trustworthy. | Avoid hedging; state facts and actions. |

### Tone by context

| Context | Tone | Allowed elements | Avoid |
|---|---|---|---|
| Default flows | Neutral, guiding | Short sentences, action verbs | Buzzwords and fluff |
| Success | Positive, short | Optional single exclamation in B2C toasts | Overhype, sarcasm |
| Warning | Firm, respectful | Explain impact + choice | Threatening language |
| Error | Calm, solution-first | Next-step guidance; apology only if BookFast caused it | Blame, internal codes |

---

## 3. Audience, pronouns, and form of address (DE)

BookFast has two distinct audiences. Consistency is required within each surface.

| Surface | Audience | DE form | EN form |
|---|---|---|---|
| Booking widget (public) | Guests / end customers | Du | You |
| Partner dashboard | Spa operators / businesses | Sie | You |
| Admin tools (internal) | BookFast team | Sie (default) or EN-only | You |

**Rule:** Do not mix Du and Sie within the same flow. If a UI surface can be used by both audiences, create two locale variants.  
**Addressing the user:** Use direct second-person language. Avoid “man”. In English, always use “you”.

---

## 4. Writing principles and formatting rules

Use these principles for every UI string:

- **Be specific:** describe the action and the outcome.
- **Be short:** remove filler words; keep one idea per sentence.
- **Be action-oriented:** buttons start with verbs; instructions use imperative.
- **Be consistent:** the same concept uses the same word everywhere.
- **Be accessible:** plain language; avoid jargon and idioms.

### Capitalization and punctuation

- **Sentence case** for headings, labels, and buttons in both languages (avoid ALL CAPS).
- Use periods in full sentences; omit periods in short labels and button text.
- Use exclamation marks sparingly: allowed in B2C success toasts only (max 1). Never in errors.
- Ellipses “...” only for ongoing actions: “Saving...” / “Wird gespeichert...”. Not for decoration.

### Dates, time, and currency

| Type | EN (default) | DE (default) | Notes |
|---|---|---|---|
| Date | Jan 8, 2026 | 08.01.2026 | Use locale formatting; keep month names short in EN UI. |
| Time | 2:30 PM | 14:30 | Booking UIs should support 24h preference; avoid ambiguous times. |
| Currency | EUR 49.00 | 49,00 EUR | Use ISO codes for multi-currency; keep 2 decimals. |

### UI patterns for clarity

- Prefer **inline validation** (near the field) over generic banners.
- Use **progress indicators** for multi-step booking, e.g., “Step 2 of 4” / “Schritt 2 von 4”.
- For destructive actions, use **explicit verbs**: “Delete service” / “Service löschen”.

---

## 5. Terminology and glossary (EN <-> DE)

Use these terms consistently across the product. If a term differs by surface (widget vs dashboard), it is listed as such.

| EN term | DE term | Notes / meaning |
|---|---|---|
| Workspace | Workspace | Tenant/account area containing locations, services, and settings. |
| Location | Standort | Physical place. Avoid “Venue” in EN. |
| Apartment / Room | Apartment / Raum | Use “Apartment” if it is a branded offer; otherwise “Raum”. |
| Service | Service / Angebot | Dashboard: “Service”. Widget: “Angebot” (more natural for guests). |
| Add-on | Add-on / Zusatzoption | Optional extra (e.g., Champagne, late checkout). |
| Availability | Verfügbarkeit | Key term in booking flow. |
| Time slot | Zeitfenster | Specific start time + duration. |
| Buffer time | Pufferzeit | Time blocked before/after a booking. |
| Booking | Buchung | Confirmed reservation. |
| Booking request | Buchungsanfrage | Use when approval is required. |
| Reschedule | Umbuchen | Change date/time. Use consistently (avoid “verschieben” in B2C). |
| Cancel | Stornieren | Use for confirmed bookings. Use “Abbrechen” for flows/forms. |
| Customer / Guest | Gast | Customer-facing term. Dashboard may use “Kund:innen” where needed. |
| Partner | Partner:in | Business operator account. |
| Admin | Admin | BookFast internal role. |
| Connect calendar | Kalender verbinden | Integration step. |

### Forbidden or discouraged words

- Vague confirmations: **OK**, **Done** without context.
- Blame language: **Invalid** (unless followed by a fix), **You did something wrong**.
- Internal jargon: **webhook**, **cron**, **DB** in user-visible copy.
- Idioms that do not translate well (EN): “hit the ground running”, “no worries”.

---

## 6. Microcopy patterns

Use these standard structures to keep the interface consistent.

### Buttons

Primary buttons start with a verb and describe the outcome. Secondary buttons are short and neutral.

| Pattern | EN examples | DE examples (Widget: Du / Dashboard: Sie) |
|---|---|---|
| Primary action | Check availability; Confirm booking; Save changes | Verfügbarkeit prüfen; Buchung bestätigen; Änderungen speichern |
| Secondary action | Back; Cancel; Close | Zurück; Abbrechen; Schließen |
| Destructive action | Delete service; Remove member | Service löschen; Mitglied entfernen |

### Form validation

- Show validation next to the field (not only at the top).
- Say what is wrong and how to fix it (one sentence).
- Use positive guidance: “Enter an email address” instead of “Email is invalid”.

**Templates**  
- **EN:** Please enter a valid email address.  
- **DE:** Bitte geben Sie eine gültige E-Mail-Adresse ein.

### Empty states

Structure: **What** (state) + **Why** (optional) + **Next action** (button).

- **EN:** No bookings yet. Add a service to start receiving bookings.  
- **DE:** Noch keine Buchungen. Legen Sie einen Service an, um Buchungen zu erhalten.

### Toasts and notifications

- Keep toasts under 90 characters when possible.
- Start with the result: “Saved” / “Änderungen gespeichert”. Add a next step only if needed.
- Do not stack multiple sentences in a toast; use a detail view for longer explanations.

---

## 7. Error and success messaging system

Every message should answer: **What happened?** and **What can the user do now?**

| Message type | Structure | Example (EN) | Example (DE) |
|---|---|---|---|
| System error | Apology (optional) + What + Next step | Something went wrong. Please try again. | Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut. |
| Validation error | Instruction + constraint | Enter a duration between 3 and 48 hours. | Geben Sie eine Dauer zwischen 3 und 48 Stunden ein. |
| Conflict error | What + Why + Fix | That time slot is no longer available. Choose another time. | Dieses Zeitfenster ist nicht mehr verfügbar. Bitte wählen Sie eine andere Zeit. |
| Success | Result + next info | Booking confirmed. We sent a confirmation email. | Buchung bestätigt. Wir haben eine Bestätigung per E-Mail gesendet. |

### Destructive actions (required pattern)

- Confirm with a modal when the action is irreversible.
- Modal title names the action: “Delete service” / “Service löschen”.
- Body explains impact in plain language (what will be removed).
- Primary button repeats the action verb. Secondary is “Cancel” / “Abbrechen”.

**Modal body examples**  
- **EN:** Deleting a service removes it from your booking page. Existing bookings stay unchanged.  
- **DE:** Wenn Sie einen Service löschen, wird er von Ihrer Buchungsseite entfernt. Bestehende Buchungen bleiben unverändert.

---

## 8. Accessibility and inclusive language

Accessibility is a writing requirement. Use plain language, avoid metaphors, and make links and buttons self-describing.

### Plain language rules

- Prefer short sentences (max ~18 words).
- Prefer common words over jargon (use “connect calendar” not “configure integration”).
- Explain constraints before users hit errors (helper text).

### Inclusive language (DE)

Default strategy: use gender-neutral wording where possible. When role nouns are needed, use the colon form (e.g., Partner:in, Kund:in). Avoid the asterisk form in UI labels due to inconsistent screenreader behavior.

- Prefer neutral nouns: “Team”, “Person”, “Mitglied”.
- Avoid gendered pronouns; rewrite the sentence if needed.
- Test key screens with a screenreader; ensure labels read naturally.

### Screenreader and UI constraints

- Avoid ALL CAPS (screenreaders may spell out abbreviations).
- Avoid decorative punctuation. Use “...” only for ongoing actions.
- Link text must make sense out of context: “View booking details” not “Click here”.

---

## 9. Localization rules (DE/EN)

- Translate meaning, not words. Keep the same intent and UX pattern.
- Do not translate BookFast, Workspace, and feature names unless officially localized.
- Keep variables and placeholders intact: `{date}`, `{time}`, `{amount}`.
- Allow extra space for German strings (often 20–35% longer).
- Avoid idioms and culture-specific jokes in core flows.

### Recommended workflow

- Write in EN first (source), then create DE variants (B2C Du, B2B Sie).
- Review DE copy by surface (widget vs dashboard) to prevent Du/Sie mixing.
- Run a copy QA pass (see checklist) before shipping.

---

## 10. Examples library for BookFast flows

### Booking widget (B2C)

| UI element | EN | DE (Du) |
|---|---|---|
| Step title | Select date and time | Datum und Uhrzeit wählen |
| CTA | Check availability | Verfügbarkeit prüfen |
| CTA | Continue | Weiter |
| CTA | Confirm booking | Buchung bestätigen |
| Inline error | Choose a start time. | Bitte wähle eine Startzeit. |
| Success | Booking confirmed. Check your inbox. | Buchung bestätigt. Schau in dein Postfach. |

### Partner dashboard (B2B)

| UI element | EN | DE (Sie) |
|---|---|---|
| Onboarding title | Connect your calendar | Verbinden Sie Ihren Kalender |
| Helper text | We use your calendar to block already booked times. | Wir nutzen Ihren Kalender, um bereits belegte Zeiten zu blockieren. |
| CTA | Connect calendar | Kalender verbinden |
| CTA | Add service | Service hinzufügen |
| Toast | Changes saved | Änderungen gespeichert |
| Conflict error | This time overlaps with an existing booking. | Diese Zeit überschneidet sich mit einer bestehenden Buchung. |

---

## 11. Copy QA checklist

Use this checklist before shipping any screen or feature.

- Does every screen have a clear primary action?
- Are button labels specific (not “OK” / “Done”)?
- Is Du/Sie consistent for this surface?
- Do terms match the glossary (no new synonyms)?
- Do errors explain what happened and how to fix it?
- Is the tone calm and non-blaming in warnings/errors?
- Are date/time/currency localized correctly?
- Are labels and links self-describing for screenreader users?
- Is the text as short as possible without losing clarity?
- Have DE strings been checked for length and truncation in UI?

---

**Next step:** Build a shared string library (e.g., JSON/CSV or a design system) that stores approved patterns per UI component (buttons, field errors, empty states) and prevents drift over time.
