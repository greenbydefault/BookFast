import { supabase } from './lib/supabaseClient.js'
import { getAppUrl } from './lib/urlHelpers.js'

const form = document.getElementById('forgotPasswordForm')
const errorMessage = document.getElementById('errorMessage')
const successMessage = document.getElementById('successMessage')
const submitBtn = document.getElementById('submitBtn')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value

    // Reset messages
    errorMessage.style.display = 'none'
    successMessage.style.display = 'none'
    errorMessage.textContent = ''
    successMessage.textContent = ''

    // Disable button
    submitBtn.disabled = true
    submitBtn.textContent = 'Wird gesendet...'

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: getAppUrl('/update-password.html'),
        })

        if (error) throw error

        successMessage.textContent = 'Wir haben dir einen Link zum Zurücksetzen geschickt. Schau in dein Postfach.'
        successMessage.style.display = 'block'
        form.reset()

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Reset-Link senden'
    }
})
