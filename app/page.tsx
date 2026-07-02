import { fetchGuestPreviousYearPrizes } from '@/lib/queries/winners'
import InvitationShell from './InvitationShell'
import { redirect } from 'next/navigation'
import { fetchPartyInfoAndEmailDetails } from '@/lib/queries/party-details'
import { BoldText } from '@/lib/bold'
import {
    formatPartyDate,
    getAuthenticatedGuestToken,
    isGuestAdmin,
} from '@/lib/helpers'

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

    const previousYearPrize = authenticatedToken
        ? await fetchGuestPreviousYearPrizes(authenticatedToken.id)
        : null

    const partyDetails = await fetchPartyInfoAndEmailDetails()

    return (
        <InvitationShell
            activePage="details"
            isAuthenticated={!!authenticatedToken}
            isAdmin={isAdmin}
            authError={authError}
        >
            {previousYearPrize && (
                <div className="border border-fuchsia-300/50 bg-fuchsia-300/10 rounded p-4 mb-8 text-left flex flex-col gap-4">
                    <p className="moontime lg:text-7xl text-5xl text-center">
                        Honored champion of last year
                    </p>
                    <p>
                        Your triumph at last year's gathering has not been
                        forgotten. As the reigning master of{' '}
                        <span className="font-bold">{previousYearPrize}</span>,
                        your legacy is secure—but your reign must end, for a new
                        master shall be crowned this year.
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

            {partyDetails?.party_details && (
                <div className="flex flex-col">
                    <span>
                        Date: {formatPartyDate(partyDetails.party_details.date)}
                    </span>
                    <span>
                        Time: {partyDetails.party_details.start}
                        {partyDetails.party_details.end &&
                            ` to ${partyDetails.party_details.end}`}
                    </span>
                    <span>
                        Location: {partyDetails.party_details.address}.{' '}
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partyDetails.party_details.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Directions.
                        </a>
                    </span>
                    {partyDetails.party_details.address_extra && (
                        <i>
                            <BoldText
                                text={partyDetails.party_details.address_extra}
                            />
                        </i>
                    )}
                </div>
            )}

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
