'use cache'
import { sql } from '@/lib/neon'
import { cacheLife, cacheTag } from 'next/cache'
import { getPreviousYear, isMissingRelationError } from '../helpers/misc'

export type GuestOption = {
    id: string
    name: string
    token: string
}

export type SignedUpGuestOption = {
    id: string
    name: string
    email: string | null
    bringing_plus_one: boolean
    plus_one_name: string | null
    cipher_answer: string | null
}

export type PrizeOption = {
    id: string
    name: string
}

export type WinnerRow = {
    prize_id: string
    guest_id: string | null
    guest_name: string
    prize_name: string
    notes: string | null
}

export async function fetchGuestPreviousYearPrizes(
    guestId: string
): Promise<string | undefined> {
    cacheLife('minutes')
    const year = getPreviousYear()
    try {
        const result = await sql`
            SELECT pc.name
            FROM prize_recipients pr
            INNER JOIN prizes p ON p.id = pr.prize_id
            INNER JOIN prize_categories pc ON pc.id = p.category_id
            WHERE pr.guest_id = ${guestId}
              AND p.year = ${year}
            ORDER BY pc.name ASC
            LIMIT 1
        `
        const row = (result as Array<{ name: string }>)[0]
        return row && row.name
    } catch (error) {
        if (isMissingRelationError(error)) {
            return
        }
        throw error
    }
}

export async function fetchWinnersByYear(year: number): Promise<WinnerRow[]> {
    cacheLife('minutes')
    cacheTag('admin-winners')
    try {
        const result = await sql`
            SELECT
                p.id AS prize_id,
                pr.guest_id AS guest_id,
                COALESCE(g.name, pr.guest_name) AS guest_name,
                pc.name AS prize_name,
                p.notes
            FROM prizes p
            INNER JOIN prize_categories pc ON pc.id = p.category_id
            INNER JOIN prize_recipients pr ON pr.prize_id = p.id
            LEFT JOIN guests g ON g.id = pr.guest_id
            WHERE p.year = ${year}
            ORDER BY pc.name ASC, COALESCE(g.name, pr.guest_name) ASC
        `
        return result as WinnerRow[]
    } catch (error) {
        if (isMissingRelationError(error)) {
            return []
        }
        throw error
    }
}

export async function fetchGuestsForAdminForm(): Promise<GuestOption[]> {
    cacheLife('minutes')
    cacheTag('admin-guests')
    const result = await sql`
        SELECT id, name, token
        FROM guests
        ORDER BY name ASC
    `
    return result as GuestOption[]
}

export async function fetchSignedUpGuestsForAdminPage(): Promise<
    SignedUpGuestOption[]
> {
    cacheLife('minutes')
    cacheTag('admin-rsvps')
    const result = await sql`
        SELECT g.*, r.*
        FROM guests g
        INNER JOIN rsvps r ON r.guest_id = g.id
        ORDER BY g.name ASC
    `
    return result as SignedUpGuestOption[]
}

export async function fetchPrizesForAdminForm(): Promise<PrizeOption[]> {
    cacheLife('minutes')
    try {
        const result = await sql`
            SELECT id, name
            FROM prize_categories
            ORDER BY name ASC
        `
        return result as PrizeOption[]
    } catch (error) {
        if (isMissingRelationError(error)) {
            return []
        }
        throw error
    }
}
