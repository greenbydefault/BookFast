import { supabase } from './lib/supabaseClient.js'

const loginForm = document.getElementById('loginForm')
const errorMessage = document.getElementById('errorMessage')
const submitBtn = document.getElementById('submitBtn')
const googleBtn = document.getElementById('googleBtn')
const passwordInput = document.getElementById('password')
const passwordToggleBtn = document.getElementById('passwordToggleBtn')
const passwordToggleIcon = passwordToggleBtn?.querySelector('.auth-password-toggle-icon')

const SVG_EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
const SVG_EYE_OFF = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'

function updatePasswordToggleUI(isVisible) {
    if (!passwordToggleBtn || !passwordToggleIcon) return
    passwordToggleBtn.setAttribute('aria-pressed', String(isVisible))
    passwordToggleBtn.setAttribute('aria-label', isVisible ? 'Passwort ausblenden' : 'Passwort anzeigen')
    passwordToggleIcon.innerHTML = isVisible ? SVG_EYE_OFF : SVG_EYE
}

passwordToggleBtn?.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text'
    passwordInput.type = isVisible ? 'password' : 'text'
    updatePasswordToggleUI(!isVisible)
})

// Social Login
async function handleSocialLogin(provider) {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: 'https://app.book-fast.de/dashboard/bookings'
            }
        })
        if (error) throw error
    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    }
}

googleBtn.addEventListener('click', () => handleSocialLogin('google'))
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    // Reset messages
    errorMessage.style.display = 'none'
    errorMessage.textContent = ''

    // Disable button
    submitBtn.disabled = true
    submitBtn.textContent = 'Wird angemeldet...'

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // Redirect to home/dashboard on success
        window.location.href = 'https://app.book-fast.de/dashboard/bookings'

    } catch (error) {
        // Supabase liefert "Invalid login credentials" – ersetzen durch Guidelines-konforme DE-Meldung
        const displayMessage = error.message?.toLowerCase().includes('invalid login credentials')
            ? 'E-Mail oder Passwort stimmen nicht. Bitte überprüfe deine Eingabe und versuche es erneut.'
            : error.message
        errorMessage.textContent = displayMessage
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Mit E-Mail anmelden'
    }
})
