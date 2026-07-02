import { getAuthenticatedGuestToken } from '@/lib/helpers'
import { fetchGuestRsvpData } from '@/lib/queries/guest-auth'
import { fetchPartyInfoAndEmailDetails } from '@/lib/queries/party-details'
import { fetchGuestPreviousYearPrizes } from '@/lib/queries/winners'

export async function GET() {
    const user = await getAuthenticatedGuestToken()
    if (!user) {
        return new Response(JSON.stringify(null), { status: 200 })
    }

    const [existingRsvp, prize, partyDetails] = await Promise.all([
        fetchGuestRsvpData(user.id),
        fetchGuestPreviousYearPrizes(user.id),
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
