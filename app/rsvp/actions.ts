'use server'

import { sql } from '@/lib/neon'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedGuestToken } from '@/lib/guest-auth'

const EMAIL_MAX_LENGTH = 320
const NAME_MAX_LENGTH = 120
const CIPHER_MAX_LENGTH = 250

function readTextField(
    formData: FormData,
    key: string,
    maxLength: number
): string {
    const value = formData.get(key)
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim().slice(0, maxLength)
}

function readBooleanField(formData: FormData, key: string): boolean {
    const value = formData.get(key)
    return value === 'true'
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function submitRsvp(formData: FormData) {
    const user = await getAuthenticatedGuestToken()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const email = readTextField(formData, 'email', EMAIL_MAX_LENGTH)
    const bringingCompanion = readBooleanField(formData, 'bringingCompanion')
    const companionName = readTextField(
        formData,
        'companionName',
        NAME_MAX_LENGTH
    )
    const cipherAnswer = readTextField(
        formData,
        'cipherAnswer',
        CIPHER_MAX_LENGTH
    )

    if (!email) {
        throw new Error('Email is required')
    }

    if (!isValidEmail(email)) {
        throw new Error('Invalid email format')
    }

    try {
        const result = await sql`
            SELECT id FROM rsvps WHERE guest_id = ${user.id} LIMIT 1
        `
        const [existing] = result as any[]

        if (existing) {
            await sql`
                UPDATE rsvps
                SET email = ${email},
                    bringing_plus_one = ${bringingCompanion},
                    plus_one_name = ${companionName || null},
                    cipher_answer = ${cipherAnswer || null},
                    updated_at = NOW()
                WHERE guest_id = ${user.id}
            `
        } else {
            await sql`
                INSERT INTO rsvps (guest_id, email, bringing_plus_one, plus_one_name, cipher_answer)
                VALUES (${user.id}, ${email}, ${bringingCompanion}, ${companionName || null}, ${cipherAnswer || null})
            `
        }

        revalidatePath('/rsvp')
        return { success: true }
    } catch (error) {
        console.error('Failed to submit RSVP:', error)
        throw error
    }
}
