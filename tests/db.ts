import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function resetRsvpForToken(token: string) {
    await sql`
        DELETE FROM rsvps
        WHERE guest_id = (SELECT id FROM guests WHERE token = ${token})
    `
}
