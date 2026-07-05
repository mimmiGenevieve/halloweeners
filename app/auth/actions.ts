'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { INVITE_COOKIE_NAME } from '@/lib/constants'
import { GuestLookupRow } from '@/lib/queries/guest-auth'
import {
    normalizeToken,
    sanitizeInviteToken,
    normalizeNextPath,
    withAuthError,
    setInviteTokenCookie,
} from '@/lib/helpers/misc'
import { isValidGuestToken } from '@/lib/helpers/valid-token'

export async function getAuthenticatedGuestToken(): Promise<GuestLookupRow | null> {
    const cookieStore = await cookies()
    const token = normalizeToken(cookieStore.get(INVITE_COOKIE_NAME)?.value)

    if (!token) {
        return null
    }

    const user = await isValidGuestToken(token)
    return user
}

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
    setInviteTokenCookie(cookieStore, token!)

    redirect(nextPath)
}
