import { adminJsonResponse, getAdminApiUser } from '../shared'
import {
    fetchGuestsForAdminForm,
    fetchPrizesForAdminForm,
} from '@/lib/queries/winners'

export async function GET() {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const [guests, prizes] = await Promise.all([
        fetchGuestsForAdminForm(),
        fetchPrizesForAdminForm(),
    ])

    return adminJsonResponse({
        user,
        guests,
        prizes,
    })
}