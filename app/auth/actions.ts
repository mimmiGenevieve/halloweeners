'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isValidGuestToken } from '@/lib/queries/guest-auth'
import { INVITE_COOKIE_NAME } from '@/lib/constants'
import {
    sanitizeInviteToken,
    normalizeNextPath,
    withAuthError,
} from '@/lib/helpers'

const cookieMaxAgeSeconds = 60 * 60 * 24 * 45

export async function authenticateGuestToken(formData: FormData) {
    const tokenValue = formData.get('token')
    const nextPathValue = formData.get('nextPath')

    const token = sanitizeInviteToken(
        typeof tokenValue === 'string' ? tokenValue : ''
    )
    const nextPath = normalizeNextPath(
        typeof nextPathValue === 'string' ? nextPathValue : '',
        '/'
    )

    const isValid = token ? await isValidGuestToken(token) : null

    if (!isValid) {
        redirect(withAuthError(nextPath, 'invalid_token'))
    }

    const cookieStore = await cookies()
    cookieStore.set({
        name: INVITE_COOKIE_NAME,
        value: token!,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: cookieMaxAgeSeconds,
    })

    redirect(nextPath)
}
