'use server'

import { sql } from '@/lib/neon'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAuthenticatedGuestToken } from '../auth/actions'
import { isGuestAdmin } from '@/lib/helpers/valid-token'
import { generateUniqueGuestToken } from '@/lib/token-generator'

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

    const guestRows = (await sql`
        SELECT id, name
        FROM guests
        WHERE id = ANY (${guestIds})
    `) as Array<{ id: string; name: string }>

    const guestById = new Map(guestRows.map((guest) => [guest.id, guest.name]))

    await sql.transaction(
        guestIds.map((guestId) => {
            const guestName = guestById.get(guestId) ?? ''
            return sql`
                INSERT INTO prize_recipients (prize_id, guest_id, guest_name)
                VALUES (${prizeId}, ${guestId}, ${guestName || null})
            `
        })
    )

    revalidateTag('admin-winners', '')
    revalidatePath('/admin/invited')
    revalidatePath('/admin/winners/previous')

    return {
        success: true,
        insertedCount: guestIds.length,
    }
}

export async function uninviteGuest(guestId: string) {
    const user = await getAuthenticatedGuestToken()
    if (!isGuestAdmin(user)) {
        throw new Error('Unauthorized')
    }

    if (!guestId) {
        throw new Error('Select at least one guest')
    }

    try {
        await sql.transaction([
            sql`DELETE FROM rsvps WHERE guest_id = ${guestId}`,
            sql`UPDATE prize_recipients SET guest_id = NULL WHERE guest_id = ${guestId}`,
            sql`DELETE FROM guests WHERE id = ${guestId}`,
        ])
    } catch (error) {
        console.error('Failed to uninvite guest:', error)
        throw error
    }
    revalidateTag('admin-guests', '')
    revalidateTag('admin-rsvps', '')
    revalidatePath('/admin')
    revalidatePath('/admin/invited')
    revalidatePath('/admin/rsvps')
    revalidatePath('/rsvp')

    return {
        success: true,
        deletedCount: 1,
    }
}

export async function inviteGuest(formData: FormData) {
    const user = await getAuthenticatedGuestToken()
    if (!isGuestAdmin(user)) {
        throw new Error('Unauthorized')
    }

    const nameValue = formData.get('name')
    const name = typeof nameValue === 'string' ? nameValue.trim() : ''
    if (!name) {
        throw new Error('Name is required')
    }

    const token = await generateUniqueGuestToken()

    try {
        await sql`INSERT INTO guests (name, token) VALUES (${name}, ${token})`
    } catch (error) {
        console.error('Failed to invite guest:', error)
        throw error
    }

    revalidateTag('admin-guests', '')
    revalidateTag('admin-rsvps', '')
    revalidatePath('/admin')
    revalidatePath('/admin/invited')
    revalidatePath('/admin/rsvps')
    revalidatePath('/rsvp')

    return { success: true, insertedCount: 1, token }
}
