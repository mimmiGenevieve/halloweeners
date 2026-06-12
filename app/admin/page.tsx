import { redirect } from 'next/navigation'
import InvitationShell from '../InvitationShell'
import { getAuthenticatedGuestToken, isGuestAdmin } from '@/lib/guest-auth'
import {
    fetchGuestsForAdminForm,
    fetchPrizesForAdminForm,
    fetchSignedUpGuestsForAdminPage,
    fetchWinnersByYear,
    getPreviousYear,
} from '@/lib/winners'
import WinnersRegistry from './winnersRegistry'

type AdminPageProps = {
    searchParams: Promise<{
        token?: string
    }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const { token } = await searchParams

    if (token) {
        redirect(
            '/auth/token?token=' + encodeURIComponent(token) + '&next=/admin'
        )
    }

    const user = await getAuthenticatedGuestToken()
    const isAdmin = isGuestAdmin(user)

    if ((user && !isAdmin) || !user) {
        redirect('/')
    }

    const previousYear = getPreviousYear()

    const [guests, signedUpGuests, prizes, previousYearWinners] =
        await Promise.all([
            fetchGuestsForAdminForm(),
            fetchSignedUpGuestsForAdminPage(),
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
                Signed up Guests
            </p>

            <p className="text-center mb-8">
                {signedUpGuests.length +
                    signedUpGuests.filter((guest) => guest.bringing_plus_one)
                        .length}{' '}
                souls (
                {
                    signedUpGuests.filter((guest) => guest.bringing_plus_one)
                        .length
                }{' '}
                plus one
                {signedUpGuests.filter((guest) => guest.bringing_plus_one)
                    .length > 1
                    ? 's'
                    : ''}
                ) have pledged to attend the gathering.
            </p>

            {signedUpGuests.length > 0 ? (
                <div
                    className="overflow-x-auto 
                 rounded"
                >
                    <ul className="space-y-2 list-disc list-inside">
                        {signedUpGuests.map((guest) => (
                            <li key={guest.id}>
                                <strong>{guest.name}</strong> ({guest.email})
                                <ul className="pl-5">
                                    {guest.bringing_plus_one && (
                                        <li>Bringing: {guest.plus_one_name}</li>
                                    )}
                                    {guest.cipher_answer && (
                                        <li>
                                            Cipher answer: {guest.cipher_answer}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No winners recorded for {previousYear}.</p>
            )}

            <WinnersRegistry
                guests={guests}
                prizes={prizes}
                previousYearWinners={previousYearWinners}
                previousYear={previousYear}
            />
        </InvitationShell>
    )
}
