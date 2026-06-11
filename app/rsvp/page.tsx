import InvitationShell from '../InvitationShell'
import TokenAccessForm from '../TokenAccessForm'
import RsvpForm from './RsvpForm'
import { getAuthenticatedGuestToken } from '@/lib/guest-auth'
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

    const authenticatedToken = await getAuthenticatedGuestToken()

    return (
        <InvitationShell
            activePage="rsvp"
            authError={authError}
            isAuthenticated={!!authenticatedToken}
        >
            <p className="text-7xl mt-4 font-bold moontime mb-5 text-center">
                Registration to attend
            </p>
            <p className="italic text-center mb-8">
                The spirits require your answer no later than October 28th.
            </p>
            <RsvpForm />
        </InvitationShell>
    )
}
