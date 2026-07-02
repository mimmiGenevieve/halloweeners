import { getAuthenticatedGuestToken } from '@/app/auth/actions'
import {
    fetchGuestsForAdminForm,
    fetchPrizesForAdminForm,
    fetchSignedUpGuestsForAdminPage,
    fetchWinnersByYear,
} from '@/lib/queries/winners'

export async function GET() {
    const user = await getAuthenticatedGuestToken()
    if (!user) {
        return new Response(JSON.stringify(null), { status: 200 })
    }

    const [guests, signedUpGuests, prizes, previousYearWinners] =
        await Promise.all([
            fetchGuestsForAdminForm(),
            fetchSignedUpGuestsForAdminPage(),
            fetchPrizesForAdminForm(),
            fetchWinnersByYear(),
        ])

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                name: user.name,
                is_admin: user.is_admin,
            },
            guests,
            signedUpGuests,
            prizes,
            previousYearWinners,
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}
