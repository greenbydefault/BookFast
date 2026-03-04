import { supabase } from './lib/supabaseClient.js'

const form = document.getElementById('updatePasswordForm')
const errorMessage = document.getElementById('errorMessage')
const successMessage = document.getElementById('successMessage')
const submitBtn = document.getElementById('submitBtn')
const passwordInput = document.getElementById('password')
const passwordRequirements = document.getElementById('passwordRequirements')
const passwordRequirementsText = passwordRequirements?.querySelector('.password-requirements__text')

function checkPasswordStrength(pw) {
    const hasLower = /[a-z]/.test(pw)
    const hasUpper = /[A-Z]/.test(pw)
    const hasDigit = /\d/.test(pw)
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"|,.<>/?~`\\]/.test(pw)
    return { hasLower, hasUpper, hasDigit, hasSymbol, allMet: hasLower && hasUpper && hasDigit && hasSymbol }
}

function updatePasswordRequirements() {
    if (!passwordRequirements || !passwordRequirementsText) return
    const pw = passwordInput.value
    if (pw.length === 0) {
        passwordRequirements.classList.add('password-requirements--hidden')
        return
    }
    passwordRequirements.classList.remove('password-requirements--hidden')
    const { hasLower, hasUpper, hasDigit, hasSymbol, allMet } = checkPasswordStrength(pw)
    if (allMet) {
        passwordRequirements.classList.add('password-requirements--valid')
        passwordRequirementsText.textContent = 'Das Passwort erfüllt die vorausgesetzten Kriterien'
    } else {
        passwordRequirements.classList.remove('password-requirements--valid')
        passwordRequirementsText.textContent = ''
        const items = [
            { label: 'Kleinbuchstaben', met: hasLower },
            { label: 'Großbuchstaben', met: hasUpper },
            { label: 'Ziffern', met: hasDigit },
            { label: 'Sonderzeichen', met: hasSymbol }
        ]
        items.forEach((item, i) => {
            const span = document.createElement('span')
            span.className = 'password-requirement' + (item.met ? ' password-requirement--met' : '')
            span.textContent = item.label
            passwordRequirementsText.appendChild(span)
            if (i < items.length - 2) {
                passwordRequirementsText.appendChild(document.createTextNode(', '))
            } else if (i === items.length - 2) {
                passwordRequirementsText.appendChild(document.createTextNode(' und '))
            }
        })
    }
}

function resetPasswordRequirements() {
    if (!passwordRequirements || !passwordRequirementsText) return
    passwordRequirements.classList.add('password-requirements--hidden')
    passwordRequirements.classList.remove('password-requirements--valid')
    passwordRequirementsText.textContent = ''
}

passwordInput?.addEventListener('input', updatePasswordRequirements)
passwordInput?.addEventListener('focus', updatePasswordRequirements)

// Helper: Check if user is actually authenticated (which happens via the magic link fragment)
// Supabase client should handle the hash fragment automatically and set the session.
// However, we might want to wait a tick or check if session exists.

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        // This is the event we expect when clicking the link
        console.log('Password recovery mode')
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    // Basic validation
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Die Passwörter stimmen nicht überein. Bitte gib sie erneut ein.'
        errorMessage.style.display = 'block'
        return
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Das Passwort muss mindestens 6 Zeichen haben'
        errorMessage.style.display = 'block'
        return
    }
    const { allMet } = checkPasswordStrength(password)
    if (!allMet) {
        errorMessage.textContent = 'Kleinbuchstaben, Großbuchstaben, Ziffern und Sonderzeichen werden benötigt'
        errorMessage.style.display = 'block'
        return
    }

    // Reset messages
    errorMessage.style.display = 'none'
    successMessage.style.display = 'none'
    errorMessage.textContent = ''
    successMessage.textContent = ''

    // Disable button
    submitBtn.disabled = true
    submitBtn.textContent = 'Wird gespeichert...'

    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) throw error

        successMessage.textContent = 'Passwort aktualisiert. Du wirst zum Login weitergeleitet.'
        successMessage.style.display = 'block'
        form.reset()
        resetPasswordRequirements()

        setTimeout(() => {
            window.location.href = '/login.html'
        }, 2000)

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Passwort speichern'
    }
})
