import { supabase } from './lib/supabaseClient.js'

const registerForm = document.getElementById('registerForm')
const errorMessage = document.getElementById('errorMessage')
const successMessage = document.getElementById('successMessage')
const submitBtn = document.getElementById('submitBtn')

// Multi-step elements
const step1 = document.getElementById('step1')
const step2 = document.getElementById('step2')
const continueBtn = document.getElementById('continueBtn')
const backBtn = document.getElementById('backBtn')
const googleBtn = document.getElementById('googleBtn')

const emailInput = document.getElementById('email')
const fullNameInput = document.getElementById('fullName')
const passwordInput = document.getElementById('password')
const passwordToggleBtn = document.getElementById('passwordToggleBtn')
const passwordToggleIconUse = document.getElementById('passwordToggleIconUse')
const passwordRequirements = document.getElementById('passwordRequirements')
const passwordRequirementsText = passwordRequirements?.querySelector('.password-requirements__text')

// Password strength check (Supabase recommended: lower, upper, digit, symbol)
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
    const { allMet } = checkPasswordStrength(pw)
    if (allMet) {
        passwordRequirements.classList.add('password-requirements--valid')
        passwordRequirementsText.textContent = 'Das Passwort erfüllt die vorausgesetzten Kriterien'
    } else {
        passwordRequirements.classList.remove('password-requirements--valid')
        passwordRequirementsText.textContent = 'Kleinbuchstaben, Großbuchstaben, Ziffern und Sonderzeichen (empfohlen)'
    }
}

function resetPasswordRequirements() {
    if (!passwordRequirements || !passwordRequirementsText) return
    passwordRequirements.classList.add('password-requirements--hidden')
    passwordRequirements.classList.remove('password-requirements--valid')
    passwordRequirementsText.textContent = ''
}

function updatePasswordToggleUI(isVisible) {
    if (!passwordToggleBtn || !passwordToggleIconUse) return
    passwordToggleBtn.setAttribute('aria-pressed', String(isVisible))
    passwordToggleBtn.setAttribute('aria-label', isVisible ? 'Passwort ausblenden' : 'Passwort anzeigen')
    passwordToggleIconUse.setAttribute('href', isVisible ? '#icon-eye' : '#icon-eye-closed')
}

function resetPasswordVisibility() {
    if (!passwordInput) return
    passwordInput.type = 'password'
    updatePasswordToggleUI(false)
}

async function isRegistrationEmailTaken(email) {
    const normalizedEmail = (email || '').trim().toLowerCase()
    const { data, error } = await supabase.rpc('check_registration_email_exists', {
        p_email: normalizedEmail
    })
    if (error) throw error
    return Boolean(data)
}

// Step Navigation
continueBtn.addEventListener('click', async () => {
    // Basic validation for Step 1
    const email = (emailInput.value || '').trim()
    if (!email || !email.includes('@')) {
        showError('Please enter a valid email address')
        return
    }

    const originalContinueText = continueBtn.textContent
    continueBtn.disabled = true
    continueBtn.textContent = 'Prüfe E-Mail...'

    try {
        const emailTaken = await isRegistrationEmailTaken(email)
        if (emailTaken) {
            showError('Diese E-Mail ist bereits registriert. Bitte logge dich ein oder nutze Passwort vergessen.')
            return
        }

        hideError()
        step1.classList.remove('step-visible')
        step1.classList.add('step-hidden')

        step2.classList.remove('step-hidden')
        step2.classList.add('step-visible')
    } catch (error) {
        showError('E-Mail-Prüfung fehlgeschlagen. Bitte versuche es erneut.')
    } finally {
        continueBtn.disabled = false
        continueBtn.textContent = originalContinueText
    }
})

backBtn.addEventListener('click', () => {
    hideError()
    resetPasswordRequirements()
    resetPasswordVisibility()
    step2.classList.remove('step-visible')
    step2.classList.add('step-hidden')

    step1.classList.remove('step-hidden')
    step1.classList.add('step-visible')
})

passwordInput.addEventListener('input', updatePasswordRequirements)
passwordInput.addEventListener('focus', updatePasswordRequirements)
passwordToggleBtn?.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text'
    passwordInput.type = isVisible ? 'password' : 'text'
    updatePasswordToggleUI(!isVisible)
})
updatePasswordToggleUI(false)

// Social Login
async function handleSocialLogin(provider) {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin + '/dashboard/bookings'
            }
        })
        if (error) throw error
    } catch (error) {
        showError(error.message)
    }
}

googleBtn.addEventListener('click', () => handleSocialLogin('google'))

// Form Submission (Step 2)
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const fullName = fullNameInput.value
    const email = emailInput.value
    const password = passwordInput.value

    // Basic validation for Step 2
    if (!fullName) {
        showError('Please enter your full name')
        return
    }
    if (!password || password.length < 6) {
        showError('Das Passwort muss mindestens 6 Zeichen haben')
        return
    }
    const { allMet } = checkPasswordStrength(password)
    if (!allMet) {
        showError('Kleinbuchstaben, Großbuchstaben, Ziffern und Sonderzeichen (empfohlen) werden benötigt')
        return
    }

    // Reset messages
    hideError()
    successMessage.style.display = 'none'
    successMessage.textContent = ''

    // Disable button
    submitBtn.disabled = true
    submitBtn.textContent = 'Creating Account...'

    try {
        // 1. Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName // This is metadata, but we also want to put it in our profiles table for better control
                }
            }
        })

        if (authError) throw authError

        if (authData.user) {
            // Profile creation is now handled by a database trigger (on_auth_user_created).

            successMessage.textContent = 'Registration successful! Please check your email to verify your account.'
            successMessage.style.display = 'block'
            registerForm.reset()
            resetPasswordRequirements()
            resetPasswordVisibility()

            // Return to step 1 after success? Or just leave success message.
            // keeping success message visible is better.
        }
    } catch (error) {
        showError(error.message)
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Sign Up'
    }
})

function showError(msg) {
    errorMessage.textContent = msg
    errorMessage.style.display = 'block'
}

function hideError() {
    errorMessage.style.display = 'none'
    errorMessage.textContent = ''
}
