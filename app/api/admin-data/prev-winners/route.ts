import { getWinnerYearOptions } from '@/lib/helpers/misc'
import { adminJsonResponse, getAdminApiUser } from '../shared'
import { fetchWinnersByYear } from '@/lib/queries/winners'

export async function GET(request: Request) {
    const user = await getAdminApiUser()
    if (!user) {
        return adminJsonResponse(null)
    }

    const { searchParams } = new URL(request.url)
    const requestedYear = Number(searchParams.get('year'))
    const currentYear = new Date().getFullYear()
    const winningYears = getWinnerYearOptions(currentYear)
    const year =
        Number.isInteger(requestedYear) && winningYears.includes(requestedYear)
            ? requestedYear
            : currentYear

    const selectedYearWinners = await fetchWinnersByYear(year)

    return adminJsonResponse({
        user,
        winnersByYear: Object.fromEntries(
            winningYears.map((winningYear) => [String(winningYear), []])
        ),
        selectedYearWinners,
        availableYears: winningYears,
        selectedYear: year,
    })
}
