import InvitationShell from '../InvitationShell'
import RsvpForm from './RsvpForm'
import {
    getAuthenticatedGuestToken,
    fetchGuestRsvpData,
    isGuestAdmin,
} from '@/lib/guest-auth'
import { redirect } from 'next/navigation'

type RSVPPageProps = {
    searchParams: Promise<{
        token?: string
    }>
}

export default async function RSVPPage({ searchParams }: RSVPPageProps) {
    const { token } = await searchParams

    if (token) {
        redirect(
            '/auth/token?token=' + encodeURIComponent(token) + '&next=/rsvp'
        )
    }

    const authenticatedUser = await getAuthenticatedGuestToken()
    const isAdmin = isGuestAdmin(authenticatedUser)
    const existingRsvp = authenticatedUser
        ? await fetchGuestRsvpData(authenticatedUser.id)
        : null

    if (!authenticatedUser) {
        redirect('/')
    }

    return (
        <InvitationShell
            activePage="rsvp"
            isAuthenticated={!!authenticatedUser}
            isAdmin={isAdmin}
        >
            <p className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center">
                Registration to attend
            </p>
            <p className="italic text-center mb-8 lg:whitespace-pre whitespace-pre-wrap">
                {existingRsvp
                    ? 'The spirits already hold your name.\nYou may revise your fate below until October 28th.'
                    : 'The spirits require your answer no later than October 28th.'}
            </p>

            <RsvpForm user={authenticatedUser} existingRsvp={existingRsvp} />
        </InvitationShell>
    )
}
