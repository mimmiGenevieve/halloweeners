import { getPreviousYear } from '@/lib/helpers/misc'
import { adminJsonResponse, getAdminApiUser } from '../shared'
import {
    fetchGuestsForAdminForm,
    fetchWinnersByYear,
} from '@/lib/queries/winners'
import { filterInvitedGuests } from '@/lib/queries/guest-filters'

export async function GET() {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const [guests, winners] = await Promise.all([
        fetchGuestsForAdminForm(),
        fetchWinnersByYear(getPreviousYear()),
    ])

    return adminJsonResponse({
        user,
        guests: filterInvitedGuests(guests),
        winners,
    })
}
