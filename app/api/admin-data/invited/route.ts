import { adminJsonResponse, getAdminApiUser } from '../shared'
import {
    fetchGuestsForAdminForm,
    fetchWinnersByYear,
} from '@/lib/queries/winners'

export async function GET() {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const [guests, winners] = await Promise.all([
        fetchGuestsForAdminForm(),
        fetchWinnersByYear(),
    ])

    return adminJsonResponse({
        user,
        guests,
        winners,
    })
}
