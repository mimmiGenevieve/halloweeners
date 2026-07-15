import { adminJsonResponse, getAdminApiUser } from '../shared'
import { fetchWinnersByYear } from '@/lib/queries/winners'

export async function GET() {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const previousYearWinners = await fetchWinnersByYear()

    return adminJsonResponse({
        user,
        previousYearWinners,
    })
}
