/**
 * Contact Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta } from '../../lib/seoHelper.js';

export const renderContactPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Kontakt', 'Kontaktiere das BookFast-Team – wir sind für dich da.');

  content.innerHTML = `
    ${createHero({
      headline: 'Fragen? Wir antworten innerhalb von 24 Stunden.',
      subheadline: 'Technischer Support, Enterprise-Anfragen oder Feedback – schreib uns direkt. Oder nutze den Live-Chat im Dashboard.',
      primaryCTA: '',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-grid landing-grid-2" style="gap: 4rem; max-width: 960px; margin: 0 auto;">
          <!-- Contact Options -->
          <div>
            <h2 class="landing-h2" style="font-size: 1.5rem;">Kontakt-Optionen</h2>
            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
              <div style="padding: 1.25rem; background: var(--color-stone-50); border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${iconImg('Mails.svg')} E-Mail</div>
                <p class="landing-text-sm" style="margin: 0;">hello@book-fast.de</p>
              </div>
              <div style="padding: 1.25rem; background: var(--color-stone-50); border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${iconImg('chat.svg')} Live-Chat</div>
                <p class="landing-text-sm" style="margin: 0;">Im Dashboard unten rechts verfügbar.</p>
              </div>
              <div style="padding: 1.25rem; background: var(--color-stone-50); border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">⏰ Antwortzeiten</div>
                <p class="landing-text-sm" style="margin: 0;">Wir antworten in der Regel innerhalb von 24 Stunden.</p>
              </div>
            </div>
            <div style="margin-top: 2rem;">
              <p class="landing-text-sm">Wenn es dringend ist, nutze den Live-Chat im Dashboard oder schreibe uns direkt an hello@book-fast.de.</p>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <h2 class="landing-h2" style="font-size: 1.5rem;">Nachricht senden</h2>
            <form id="contact-form" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--color-stone-700); margin-bottom: 0.4rem;">Name</label>
                <input type="text" name="name" required placeholder="Dein Name" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-stone-200); border-radius: 8px; font-size: 1rem; font-family: inherit;">
              </div>
              <div>
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--color-stone-700); margin-bottom: 0.4rem;">E-Mail</label>
                <input type="email" name="email" required placeholder="deine@email.de" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-stone-200); border-radius: 8px; font-size: 1rem; font-family: inherit;">
                <p class="landing-text-sm" style="margin: 0.35rem 0 0; color: var(--color-stone-500);">Wir antworten an diese Adresse.</p>
              </div>
              <div>
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--color-stone-700); margin-bottom: 0.4rem;">Betreff</label>
                <select name="subject" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-stone-200); border-radius: 8px; font-size: 1rem; font-family: inherit; background: white;">
                  <option>Allgemeine Frage</option>
                  <option>Technischer Support</option>
                  <option>Enterprise-Anfrage</option>
                  <option>Partnerschaft</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--color-stone-700); margin-bottom: 0.4rem;">Nachricht</label>
                <textarea name="message" rows="5" required placeholder="Beschreibe kurz dein Anliegen …" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-stone-200); border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical;"></textarea>
              </div>
              <div>
                <button type="submit" class="landing-btn landing-btn-primary">Nachricht senden</button>
                <p class="landing-text-sm" style="margin: 0.5rem 0 0; color: var(--color-stone-500);">Wir melden uns in der Regel innerhalb von 24 Stunden.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  // Simple form handler
  const form = content.querySelector('#contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${iconImg('check.svg')}</div>
        <h3 class="landing-h3">Nachricht gesendet!</h3>
        <p class="landing-text-sm">Wir melden uns innerhalb von 24 Stunden bei dir.</p>
      </div>`;
  });
};
