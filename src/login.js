import { supabase } from './lib/supabaseClient.js'

const loginForm = document.getElementById('loginForm')
const errorMessage = document.getElementById('errorMessage')
const submitBtn = document.getElementById('submitBtn')
const googleBtn = document.getElementById('googleBtn')

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
    submitBtn.textContent = 'Logging In...'

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // Redirect to home/dashboard on success
        window.location.href = 'https://app.book-fast.de/dashboard/bookings'

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Log In'
    }
})
