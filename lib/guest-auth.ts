import { sql } from '@/lib/neon'
import { cookies } from 'next/headers'

export const INVITE_COOKIE_NAME = 'invite_token'

export type GuestLookupRow = {
    id: string
    token: string
    name: string
    is_admin?: boolean | null
}

export type RsvpData = {
    email?: string
    bringing_plus_one?: boolean
    plus_one_name?: string | null
    cipher_answer?: string | null
}

const TOKEN_MAX_LENGTH = 200
const TOKEN_ALLOWED_PATTERN = /^[a-zA-Z-]+$/
const ADMIN_TOKENS_ENV = 'ADMIN_GUEST_TOKENS'

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

const guestLookupQueries = [
    (token: string) =>
        sql`
            SELECT id, token, name, is_admin
            FROM guests
            WHERE token = ${token}
            LIMIT 1
        `,
]

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
            const result = await query(token)
            const [row] = result as GuestLookupRow[]
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

export async function getAuthenticatedGuestToken(): Promise<GuestLookupRow | null> {
    const cookieStore = await cookies()
    const token = normalizeToken(cookieStore.get(INVITE_COOKIE_NAME)?.value)

    if (!token) {
        return null
    }

    const user = await isValidGuestToken(token)
    return user
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

export async function fetchGuestRsvpData(
    guestId: string | null
): Promise<RsvpData | null> {
    if (!guestId) {
        return null
    }

    try {
        const result = await sql`
            SELECT email, bringing_plus_one, plus_one_name, cipher_answer
            FROM rsvps
            WHERE guest_id = ${guestId}
            LIMIT 1
        `
        const [row] = result as RsvpData[]
        return row || null
    } catch (error) {
        console.error('Failed to fetch RSVP data:', error)
        return null
    }
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
