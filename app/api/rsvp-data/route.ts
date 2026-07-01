import {
    getAuthenticatedGuestToken,
    fetchGuestRsvpData,
} from '@/lib/guest-auth'
import { fetchPartyInfoAndEmailDetails } from '@/lib/party-details'
import { fetchGuestPreviousYearPrizes, getPreviousYear } from '@/lib/winners'

export async function GET() {
    const user = await getAuthenticatedGuestToken()
    if (!user) {
        return new Response(JSON.stringify(null), { status: 200 })
    }

    const [existingRsvp, prize, partyDetails] = await Promise.all([
        fetchGuestRsvpData(user.id),
        fetchGuestPreviousYearPrizes(user.id, getPreviousYear()),
        fetchPartyInfoAndEmailDetails(),
    ])

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                name: user.name,
                is_admin: user.is_admin,
            },
            existingRsvp,
            prize,
            partyDetails,
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}
