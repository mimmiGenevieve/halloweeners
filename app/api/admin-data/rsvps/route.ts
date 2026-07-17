import { adminJsonResponse, getAdminApiUser } from '../shared'
import { fetchSignedUpGuestsForAdminPage } from '@/lib/queries/winners'

export async function GET() {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const signedUpGuests = await fetchSignedUpGuestsForAdminPage()

    return adminJsonResponse({
        user,
        signedUpGuests,
    })
}
