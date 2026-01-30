import './Button.css';

export function createButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.className = `btn ${className}`;
    button.innerText = text;
    button.addEventListener('click', onClick);
    return button;
}
