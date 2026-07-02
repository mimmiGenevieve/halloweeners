import { getAuthenticatedGuestToken } from '@/app/auth/actions'
import { fetchPartyInfoAndEmailDetails } from '@/lib/queries/party-details'
import { fetchGuestPreviousYearPrizes } from '@/lib/queries/winners'

export async function GET() {
    const user = await getAuthenticatedGuestToken()
    if (!user) {
        return new Response(JSON.stringify(null), { status: 200 })
    }

    const [prize, partyDetails] = await Promise.all([
        fetchGuestPreviousYearPrizes(user.id),
        fetchPartyInfoAndEmailDetails(),
    ])

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                is_admin: user.is_admin,
            },
            prize,
            partyDetails: partyDetails?.party_details,
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}
