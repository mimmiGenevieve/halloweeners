import InvitationShell from './InvitationShell'
import { getAuthenticatedGuestToken } from '@/lib/guest-auth'
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

    return (
        <InvitationShell
            activePage="details"
            isAuthenticated={!!authenticatedToken}
            authError={authError}
        >
            <p className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-10 text-center">
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
