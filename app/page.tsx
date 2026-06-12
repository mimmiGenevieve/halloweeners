import InvitationShell from './InvitationShell'
import { getAuthenticatedGuestToken, isGuestAdmin } from '@/lib/guest-auth'
import { fetchGuestPreviousYearPrizes, getPreviousYear } from '@/lib/winners'
import { redirect } from 'next/navigation'

type HomePageProps = {
    searchParams: Promise<{
        token?: string
        authError?: string
    }>
}

export default async function Home({ searchParams }: HomePageProps) {
    const { token, authError } = await searchParams

    if (token) {
        redirect(`/auth/token?token=${encodeURIComponent(token)}&next=/`)
    }

    const authenticatedToken = await getAuthenticatedGuestToken()
    const isAdmin = isGuestAdmin(authenticatedToken)

    const previousYear = getPreviousYear()
    const previousYearPrizes = authenticatedToken
        ? await fetchGuestPreviousYearPrizes(
              authenticatedToken.id,
              previousYear
          )
        : []

    return (
        <InvitationShell
            activePage="details"
            isAuthenticated={!!authenticatedToken}
            isAdmin={isAdmin}
            authError={authError}
        >
            {previousYearPrizes.length > 0 && (
                <div className="border border-fuchsia-300/50 bg-fuchsia-300/10 rounded p-4 mb-8 text-left flex flex-col gap-4">
                    <p className="moontime lg:text-7xl text-5xl text-center">
                        Honored champion of last year
                    </p>
                    <p>
                        Your triumph at last year's gathering has not been
                        forgotten. As the reigning master of{' '}
                        <span className="font-bold">
                            {previousYearPrizes.join(', ')}
                        </span>
                        , your legacy is secure—but your reign must end, for a
                        new master shall be crowned this year.
                    </p>

                    <p>
                        Return bearing the prize you once claimed, that it may
                        be transferred with honor during the night's ceremony.
                    </p>
                    <p className="font-bold ">
                        Should the fates conspire against your attendance,
                        arrange for another worthy specter to carry out this
                        sacred duty in your stead.
                    </p>
                </div>
            )}

            <p className="lg:text-7xl text-5xl mt-10 font-bold moontime mb-4 text-center">
                Essential Details for the Night
            </p>

            <div className="flex flex-col">
                <span>Date: October 31st, 2026.</span>
                <span>Time: 6:00 PM to late</span>
                <span>
                    Location: Kungsportsavenyen 1, 411 36 Göteborg.{' '}
                    <a
                        href="https://maps.app.goo.gl/m4Aqvqb6J3yeMaKKA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Directions.
                    </a>
                </span>
                <i>
                    Upon your arrival, call <b>Twoday</b> on the intercom to be
                    granted entry.
                </i>
            </div>
            <p className="mt-7">
                <b>Bring your own elixir of choice</b>, though light snacks will
                be provided.
            </p>
            <p>
                Prizes will be bestowed in the following categories:{' '}
                <b>Best Duo</b>, <b>Best Single</b>, <b>Scariest</b>, and
                <b> Most Creative</b>.
            </p>

            <p>
                The gathering begins promptly.{' '}
                <b>Tardiness is not advised.</b>{' '}
            </p>
            <p className="italic mt-8 text-center">
                The night awaits you; let the shadows guide your way.
            </p>
        </InvitationShell>
    )
}
