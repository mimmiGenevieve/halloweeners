'use cache'
import { sql } from '@/lib/neon'
import { isMissingRelationError, sanitizeInviteToken } from '../helpers'
import { cacheLife } from 'next/cache'

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

export async function fetchGuestRsvpData(
    guestId: string | null
): Promise<RsvpData | null> {
    cacheLife('minutes')
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

async function findGuestByToken(token: string): Promise<GuestLookupRow | null> {
    cacheLife('minutes')
    try {
        const result = await sql`
            SELECT id, token, name, is_admin
            FROM guests
            WHERE token = ${token}
            LIMIT 1
        `
        const [row] = result as GuestLookupRow[]
        if (row) {
            return row
        }
        return null
    } catch (error) {
        if (isMissingRelationError(error)) {
            throw new Error(
                'No guest table found. Create one named guests_table, guests, or "guests-table" with a token column.'
            )
        }
        throw error
    }
}
