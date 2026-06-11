'use server'

import { sql } from '@/lib/neon'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedGuestToken } from '@/lib/guest-auth'

type RsvpFormData = {
    email: string
    bringing_companion: boolean
    companion_name: string
    cipher_answer: string
}

export async function submitRsvp(formData: FormData) {
    const user = await getAuthenticatedGuestToken()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const email = formData.get('email') as string
    const bringingCompanion = formData.get('bringingCompanion') === 'true'
    const companionName = formData.get('companionName') as string
    const cipherAnswer = formData.get('cipherAnswer') as string

    if (!email) {
        throw new Error('Email is required')
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
