import {
    TOKEN_MAX_LENGTH,
    TOKEN_ALLOWED_PATTERN,
    INVITE_COOKIE_NAME,
    INVITE_COOKIE_MAX_AGE_SECONDS,
} from '../constants'

export function formatPartyDate(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date)
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()

    const suffix = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return s[(v - 20) % 10] || s[v] || s[0]
    }

    return `${month} ${day}${suffix(day)}, ${year}.`
}

export function isMissingRelationError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false
    }
    return /relation .* does not exist/i.test(error.message)
}

export function getPreviousYear(year = new Date().getFullYear()): number {
    return year - 1
}

export function getWinnerYearOptions(currentYear = new Date().getFullYear()) {
    const firstYear = 2025
    return Array.from(
        { length: Math.max(1, currentYear - firstYear + 1) },
        (_, index) => firstYear + index
    )
}

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
