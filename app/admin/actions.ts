'use server'

import { getAuthenticatedGuestToken, isGuestAdmin } from '@/lib/guest-auth'
import { sql } from '@/lib/neon'
import { revalidatePath } from 'next/cache'

const NOTES_MAX_LENGTH = 250
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function parseGuestIds(formData: FormData): string[] {
    return Array.from(
        new Set(
            formData
                .getAll('guestIds')
                .map((value) => (typeof value === 'string' ? value : ''))
                .filter((value) => UUID_REGEX.test(value))
        )
    )
}

export async function addCurrentYearWinners(formData: FormData) {
    const user = await getAuthenticatedGuestToken()
    if (!isGuestAdmin(user)) {
        throw new Error('Unauthorized')
    }

    const guestIds = parseGuestIds(formData)

    const categoryIdRaw = formData.get('prizeId')
    const categoryId =
        typeof categoryIdRaw === 'string' && UUID_REGEX.test(categoryIdRaw)
            ? categoryIdRaw
            : null

    const notesRaw = formData.get('notes')
    const notes =
        typeof notesRaw === 'string'
            ? notesRaw.trim().slice(0, NOTES_MAX_LENGTH)
            : ''

    if (guestIds.length === 0) {
        throw new Error('Select at least one guest')
    }
    if (!categoryId) {
        throw new Error('Select a prize')
    }

    const currentYear = new Date().getFullYear()

    const [prizeRow] = (await sql`
        INSERT INTO prizes (category_id, year, notes)
        VALUES (${categoryId}, ${currentYear}, ${notes || null})
        RETURNING id
    `) as Array<{ id: string }>

    const prizeId = prizeRow.id

    await sql.transaction(
        guestIds.map(
            (guestId) =>
                sql`
                INSERT INTO prize_recipients (prize_id, guest_id)
                VALUES (${prizeId}, ${guestId})
            `
        )
    )

    revalidatePath('/admin')
    revalidatePath('/rsvp')

    return {
        success: true,
        insertedCount: guestIds.length,
    }
}
