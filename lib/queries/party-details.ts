'use cache'
import { sql } from '@/lib/neon'
import { cacheLife } from 'next/cache'

export type PartyInfo = {
    party_details: {
        date: Date
        start: string
        end: string
        address: string
        address_extra: string | null
    }
    email_details: {
        from: string
        subject: string
    }
    calendar_details: {
        from: string
        to: string
        details: string | null
    }
}

export async function fetchPartyInfoAndEmailDetails(): Promise<PartyInfo | null> {
    cacheLife('minutes')
    try {
        const res = await sql`
            SELECT party_info.date AS d_date, party_info.start_time AS d_start, party_info.end_time AS d_end,
            party_info.address AS d_address, party_info.address_extra_info AS d_address_extra,
            email.from AS e_from, email.subject AS e_subject,
            calendar_info.from_date AS c_from, calendar_info.to_date AS c_to, calendar_info.details AS c_details
            FROM party_info, email, calendar_info 
            LIMIT 1
            `
        const result = res[0]
        if (result) {
            return {
                party_details: {
                    date: result.d_date,
                    start: result.d_start,
                    end: result.d_end,
                    address: result.d_address,
                    address_extra: result.d_address_extra,
                },
                email_details: {
                    from: result.e_from,
                    subject: result.e_subject,
                },
                calendar_details: {
                    from: result.c_from,
                    to: result.c_to,
                    details: result.c_details,
                },
            }
        }
        return null
    } catch (error) {
        throw error
    }
}
