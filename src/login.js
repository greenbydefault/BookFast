import { supabase } from './lib/supabaseClient.js'

const loginForm = document.getElementById('loginForm')
const errorMessage = document.getElementById('errorMessage')
const submitBtn = document.getElementById('submitBtn')

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
        window.location.href = '/'

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Log In'
    }
})
