import { cookies } from 'next/headers'
import {
    ADMIN_TOKENS_ENV,
    TOKEN_MAX_LENGTH,
    TOKEN_ALLOWED_PATTERN,
    INVITE_COOKIE_NAME,
} from './constants'
import { GuestLookupRow, isValidGuestToken } from './queries/guest-auth'

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
    return (rawToken ?? '').trim()
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

export function formatPartyDate(date: Date): string {
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
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    const suffix = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return s[(v - 20) % 10] || s[v] || s[0]
    }

    return `${month} ${day}${suffix(day)}, ${year}.`
}

export async function getAuthenticatedGuestToken(): Promise<GuestLookupRow | null> {
    const cookieStore = await cookies()
    const token = normalizeToken(cookieStore.get(INVITE_COOKIE_NAME)?.value)

    if (!token) {
        return null
    }

    const user = await isValidGuestToken(token)
    return user
}
