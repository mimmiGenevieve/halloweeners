import { ADMIN_TOKENS_ENV } from '../constants'
import { findGuestByToken, GuestLookupRow } from '../queries/guest-auth'
import { sanitizeInviteToken } from './misc'

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

export function isGuestAdmin(user: GuestLookupRow | null): boolean {
    if (!user) {
        return false
    }

    if (user.is_admin === true) {
        return true
    }

    return adminTokenAllowList.has(user.token)
}
