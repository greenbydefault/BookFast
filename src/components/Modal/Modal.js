/**
 * Generic Modal Component
 * Renders a modal with header, content, and footer.
 */
import './Modal.css';
import { getIconString } from '../Icons/Icon.js';

export const createModal = ({ title, subtitle, content, footerLeft, footerRight, onClose }) => {
    // Backdrop
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Container
    const container = document.createElement('div');
    container.className = 'modal-container';

    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <div class="modal-title-group">
            <h2>${title}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <button class="modal-close-btn" aria-label="Close">
            ${getIconString('close')}
        </button>
    `;

    // Close handler
    const closeBtn = header.querySelector('.modal-close-btn');
    closeBtn.onclick = () => close();

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'modal-content';
    if (typeof content === 'string') {
        contentDiv.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        contentDiv.appendChild(content);
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const footerLeftDiv = document.createElement('div');
    footerLeftDiv.className = 'modal-footer-left';
    if (footerLeft) {
        if (typeof footerLeft === 'string') footerLeftDiv.innerHTML = footerLeft;
        else footerLeftDiv.appendChild(footerLeft);
    }

    const footerRightDiv = document.createElement('div');
    footerRightDiv.className = 'modal-footer-right';
    if (footerRight) {
        if (typeof footerRight === 'string') footerRightDiv.innerHTML = footerRight;
        else footerRightDiv.appendChild(footerRight);
    }

    footer.appendChild(footerLeftDiv);
    footer.appendChild(footerRightDiv);

    // Assemble
    container.appendChild(header);
    container.appendChild(contentDiv);
    container.appendChild(footer);
    overlay.appendChild(container);

    // Close function (with animation)
    const close = () => {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            if (onClose) onClose();
        }, 200); // Wait for transition
    };

    // Open function
    const open = () => {
        document.body.appendChild(overlay);
        // Trigger reflow to enable transition
        overlay.offsetHeight;
        overlay.classList.add('open');
    };

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) close();
    };

    return {
        element: overlay,
        open,
        close,
        setContent: (newContent) => {
            contentDiv.innerHTML = '';
            if (typeof newContent === 'string') contentDiv.innerHTML = newContent;
            else contentDiv.appendChild(newContent);
        }
    };
};
