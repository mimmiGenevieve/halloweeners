import { sql } from '@/lib/neon'
import { cookies } from 'next/headers'

export const INVITE_COOKIE_NAME = 'invite_token'

type GuestLookupRow = { token: string }

type GuestLookupQuery = (token: string) => Promise<GuestLookupRow[]>

const guestLookupQueries: GuestLookupQuery[] = [
    (token) =>
        sql<GuestLookupRow[]>`
            SELECT token
            FROM guests_table
            WHERE token = ${token}
            LIMIT 1
        `,
    (token) =>
        sql<GuestLookupRow[]>`
            SELECT token
            FROM "guests-table"
            WHERE token = ${token}
            LIMIT 1
        `,
    (token) =>
        sql<GuestLookupRow[]>`
            SELECT token
            FROM guests
            WHERE token = ${token}
            LIMIT 1
        `,
]

function normalizeToken(rawToken: string | null | undefined): string {
    return (rawToken ?? '').trim()
}

function isMissingRelationError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false
    }

    return /relation .* does not exist/i.test(error.message)
}

async function findGuestByToken(token: string): Promise<GuestLookupRow | null> {
    let hasMissingRelationError = false

    for (const query of guestLookupQueries) {
        try {
            const [row] = await query(token)
            if (row) {
                return row
            }
            return null
        } catch (error) {
            if (isMissingRelationError(error)) {
                hasMissingRelationError = true
                continue
            }
            throw error
        }
    }

    if (hasMissingRelationError) {
        throw new Error(
            'No guest table found. Create one named guests_table, guests, or "guests-table" with a token column.'
        )
    }

    return null
}

export async function isValidGuestToken(
    rawToken: string | null | undefined
): Promise<boolean> {
    const token = normalizeToken(rawToken)

    if (!token || token.length > 200) {
        return false
    }

    try {
        const guest = await findGuestByToken(token)
        return guest !== null
    } catch (error) {
        console.error('Guest token validation failed:', error)
        return false
    }
}

export async function getAuthenticatedGuestToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = normalizeToken(cookieStore.get(INVITE_COOKIE_NAME)?.value)

    if (!token) {
        return null
    }

    const isValid = await isValidGuestToken(token)
    return isValid ? token : null
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
