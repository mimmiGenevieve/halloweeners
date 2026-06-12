import { redirect } from 'next/navigation'
import InvitationShell from '../InvitationShell'
import { getAuthenticatedGuestToken, isGuestAdmin } from '@/lib/guest-auth'
import {
    fetchGuestsForAdminForm,
    fetchPrizesForAdminForm,
    fetchWinnersByYear,
    getPreviousYear,
} from '@/lib/winners'
import WinnersAdminForm from './WinnersAdminForm'

type AdminPageProps = {
    searchParams: Promise<{
        token?: string
        authError?: string
    }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const { token, authError } = await searchParams

    if (token) {
        redirect(
            '/auth/token?token=' + encodeURIComponent(token) + '&next=/admin'
        )
    }

    const user = await getAuthenticatedGuestToken()
    const isAdmin = isGuestAdmin(user)

    if (user && !isAdmin) {
        redirect('/rsvp')
    }

    if (!user) {
        return (
            <InvitationShell
                activePage="admin"
                isAuthenticated={false}
                authError={authError}
            >
                <p className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center">
                    Winners Registry
                </p>
                <p className="italic text-center mb-8">
                    Enter your token to access the registry.
                </p>
            </InvitationShell>
        )
    }

    const previousYear = getPreviousYear()
    const currentYear = new Date().getFullYear()

    const [guests, prizes, previousYearWinners] = await Promise.all([
        fetchGuestsForAdminForm(),
        fetchPrizesForAdminForm(),
        fetchWinnersByYear(previousYear),
    ])

    return (
        <InvitationShell
            activePage="admin"
            isAuthenticated={true}
            isAdmin={isAdmin}
        >
            <p className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center">
                Winners Registry
            </p>
            <p className="text-center mb-8">
                Review {previousYear} winners and register the chosen souls for{' '}
                {currentYear}.
            </p>

            <h2 className="text-6xl mb-3">Winners of the last gathering</h2>
            {previousYearWinners.length > 0 ? (
                <div className="overflow-x-auto border border-(--foreground)/20 rounded">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-(--foreground)/20">
                                <th className="p-3">Guest</th>
                                <th className="p-3">Prize</th>
                                <th className="p-3">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousYearWinners.map((winner) => (
                                <tr
                                    key={winner.guest_id}
                                    className="border-b last:border-b-0 border-(--foreground)/10"
                                >
                                    <td className="p-3">{winner.guest_name}</td>
                                    <td className="p-3">{winner.prize_name}</td>
                                    <td className="p-3">
                                        {winner.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No winners recorded for {previousYear}.</p>
            )}

            <h2 className="text-6xl mt-15">Add this years winners</h2>

            <WinnersAdminForm
                guests={guests}
                prizes={prizes}
                currentYear={currentYear}
            />
        </InvitationShell>
    )
}
