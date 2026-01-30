import { supabase } from './lib/supabaseClient.js'

const registerForm = document.getElementById('registerForm')
const errorMessage = document.getElementById('errorMessage')
const successMessage = document.getElementById('successMessage')
const submitBtn = document.getElementById('submitBtn')

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const fullName = document.getElementById('fullName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    // Reset messages
    errorMessage.style.display = 'none'
    successMessage.style.display = 'none'
    errorMessage.textContent = ''
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
        }
    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Sign Up'
    }
})
