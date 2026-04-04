/**
 * StaffPreviewCard – Landing-only wrapper around the shared StaffFormFields.
 * Provides a demo-mode experience: no API calls, pre-filled demo services,
 * plus landing-specific chrome (hint text).
 */
import { createStaffFormFields } from '../../forms/StaffFormFields.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    services: [
      { value: 'demo-1', label: 'Haarschnitt Damen' },
      { value: 'demo-2', label: 'Haarschnitt Herren' },
      { value: 'demo-3', label: 'Bartpflege' },
      { value: 'demo-4', label: 'Färben & Strähnchen' },
      { value: 'demo-5', label: 'Kopfmassage' },
    ],
    formCopy: {},
  },
};

/**
 * Returns the static HTML shell.  Call `initStaffPreviewCard(container)`
 * after inserting into the DOM to mount the interactive form.
 */
export const createStaffPreviewCard = () => `
  <div class="feature-demo-card" id="staff-preview-card">
    <div class="feature-demo-card__body" id="staff-preview-body"></div>
  </div>
`;

/**
 * Mounts StaffFormFields into the card shell.
 * @param {HTMLElement} heroContainer – the element containing the hero HTML
 */
export const initStaffPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#staff-preview-body');
  if (!body) return;
  const card = content.card || DEFAULT_CONTENT.card;

  const form = createStaffFormFields({
    state: {
      name: '',
      description: '',
      bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
      serviceIds: ['demo-1'],
      timeFrom: '10:00',
      timeTo: '18:00',
    },
    options: {
      services: card.services || DEFAULT_CONTENT.card.services,
      showImage: false,
      showDescription: true,
      showTimeWindows: true,
    },
    copy: card.formCopy || DEFAULT_CONTENT.card.formCopy,
  });

  body.appendChild(form.element);
};
