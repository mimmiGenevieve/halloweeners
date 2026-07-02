import {
    ADMIN_TOKENS_ENV,
    TOKEN_MAX_LENGTH,
    TOKEN_ALLOWED_PATTERN,
    INVITE_COOKIE_NAME,
    INVITE_COOKIE_MAX_AGE_SECONDS,
} from './constants'
import { findGuestByToken, GuestLookupRow } from './queries/guest-auth'

export function isMissingRelationError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false
    }
    return /relation .* does not exist/i.test(error.message)
}

export function getPreviousYear(year = new Date().getFullYear()): number {
    return year - 1
}

function parseAdminTokensFromEnv(raw: string | undefined): Set<string> {
    if (!raw) {
        return new Set()
    }

    return new Set(
        raw
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
    )
}

const adminTokenAllowList = parseAdminTokensFromEnv(
    process.env[ADMIN_TOKENS_ENV]
)

export function normalizeToken(rawToken: string | null | undefined): string {
    return (rawToken ?? '').trim().toLowerCase()
}

export function sanitizeInviteToken(
    rawToken: string | null | undefined
): string | null {
    const token = normalizeToken(rawToken)

    if (!token || token.length > TOKEN_MAX_LENGTH) {
        return null
    }

    if (!TOKEN_ALLOWED_PATTERN.test(token)) {
        return null
    }

    return token
}

export function isGuestAdmin(user: GuestLookupRow | null): boolean {
    if (!user) {
        return false
    }

    if (user.is_admin === true) {
        return true
    }

    return adminTokenAllowList.has(user.token)
}

export function normalizeNextPath(
    rawPath: string | null | undefined,
    fallbackPath: string
): string {
    const candidate = (rawPath ?? '').trim()

    if (
        !candidate ||
        !candidate.startsWith('/') ||
        candidate.startsWith('//')
    ) {
        return fallbackPath
    }

    return candidate
}

export function withAuthError(path: string, errorCode: string): string {
    const separator = path.includes('?') ? '&' : '?'
    return `${path}${separator}authError=${encodeURIComponent(errorCode)}`
}

export async function isValidGuestToken(
    rawToken: string | null | undefined
): Promise<GuestLookupRow | null> {
    const token = sanitizeInviteToken(rawToken)

    if (!token) {
        return null
    }

    try {
        const guest = await findGuestByToken(token)
        return guest
    } catch (error) {
        console.error('Guest token validation failed:', error)
        return null
    }
}

type CookieJar = {
    set: (options: {
        name: string
        value: string
        httpOnly?: boolean
        sameSite?: 'lax' | 'strict' | 'none'
        secure?: boolean
        path?: string
        maxAge?: number
    }) => void
}

export function setInviteTokenCookie(
    cookieJar: CookieJar,
    token: string
): void {
    cookieJar.set({
        name: INVITE_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: INVITE_COOKIE_MAX_AGE_SECONDS,
    })
}
