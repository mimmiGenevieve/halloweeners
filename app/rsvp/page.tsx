import InvitationShell from '../InvitationShell'
import RsvpForm from './RsvpForm'
import {
    getAuthenticatedGuestToken,
    fetchGuestRsvpData,
} from '@/lib/guest-auth'
import { redirect } from 'next/navigation'

type RSVPPageProps = {
    searchParams: Promise<{
        token?: string
        authError?: string
    }>
}

export default async function RSVPPage({ searchParams }: RSVPPageProps) {
    const { token, authError } = await searchParams

    if (token) {
        redirect(
            '/auth/token?token=' + encodeURIComponent(token) + '&next=/rsvp'
        )
    }

    const authenticatedUser = await getAuthenticatedGuestToken()
    const existingRsvp = authenticatedUser
        ? await fetchGuestRsvpData(authenticatedUser.id)
        : null

    return (
        <InvitationShell
            activePage="rsvp"
            authError={authError}
            isAuthenticated={!!authenticatedUser}
        >
            <p className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center">
                Registration to attend
            </p>
            <p className="italic text-center mb-8 whitespace-pre">
                {existingRsvp
                    ? 'The spirits already hold your name.\nYou may revise your fate below until October 28th.'
                    : 'The spirits require your answer no later than October 28th.'}
            </p>
            <RsvpForm user={authenticatedUser} existingRsvp={existingRsvp} />
        </InvitationShell>
    )
}
