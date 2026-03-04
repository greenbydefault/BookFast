import { supabase } from './lib/supabaseClient.js'

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
    submitBtn.textContent = 'Sending...'

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://app.book-fast.de/update-password.html',
        })

        if (error) throw error

        successMessage.textContent = 'Check your email for the password reset link.'
        successMessage.style.display = 'block'
        form.reset()

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Send Reset Link'
    }
})
