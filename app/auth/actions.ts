'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
    INVITE_COOKIE_NAME,
    isValidGuestToken,
    normalizeNextPath,
    withAuthError,
} from '@/lib/guest-auth'

const cookieMaxAgeSeconds = 60 * 60 * 24 * 45

export async function authenticateGuestToken(formData: FormData) {
    const tokenValue = formData.get('token')
    const nextPathValue = formData.get('nextPath')

    const token = typeof tokenValue === 'string' ? tokenValue : ''
    const nextPath = normalizeNextPath(
        typeof nextPathValue === 'string' ? nextPathValue : '',
        '/'
    )

    const isValid = await isValidGuestToken(token)

    if (!isValid) {
        redirect(withAuthError(nextPath, 'invalid_token'))
    }

    const cookieStore = await cookies()
    cookieStore.set({
        name: INVITE_COOKIE_NAME,
        value: token.trim(),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: cookieMaxAgeSeconds,
    })

    redirect(nextPath)
}
