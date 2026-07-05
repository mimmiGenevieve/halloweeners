import { INVITE_COOKIE_NAME } from '@/lib/constants'
import {
    sanitizeInviteToken,
    normalizeNextPath,
    withAuthError,
} from '@/lib/helpers/misc'

import { isValidGuestToken } from '@/lib/helpers/valid-token'
import { NextRequest, NextResponse } from 'next/server'

const cookieMaxAgeSeconds = 60 * 60 * 24 * 45

export async function GET(request: NextRequest) {
    const token = sanitizeInviteToken(request.nextUrl.searchParams.get('token'))
    const nextPath = normalizeNextPath(
        request.nextUrl.searchParams.get('next'),
        '/'
    )

    const isValid = token ? await isValidGuestToken(token) : null

    if (!isValid) {
        return NextResponse.redirect(
            new URL(withAuthError(nextPath, 'invalid_token'), request.url)
        )
    }

    const response = NextResponse.redirect(new URL(nextPath, request.url))
    response.cookies.set({
        name: INVITE_COOKIE_NAME,
        value: token!,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: cookieMaxAgeSeconds,
    })

    return response
}
