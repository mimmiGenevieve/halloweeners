'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import PageLayout from '../PageLayout'
import { RsvpData } from '@/lib/queries/guest-auth'
import RsvpForm from './RsvpForm'
import { useSearchParams } from 'next/navigation'
import { useAdminStatusCache } from '@/lib/auth-cache'
import { PartyInfo } from '@/lib/types/details'

export type RsvpDataResponse = {
    user: { id: string; name: string; is_admin?: boolean } | null
    existingRsvp: RsvpData | null
    prize?: string
    partyDetails: PartyInfo
} | null

function RsvpPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')
    const [data, setData] = useState<RsvpDataResponse>(null)
    const [loading, setLoading] = useState(true)
    const [cachedIsAdmin, updateAdminStatus] = useAdminStatusCache()
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return

        if (token) {
            window.location.href = `/api/token?token=${encodeURIComponent(token)}&next=/rsvp`
            return
        }

        hasFetched.current = true
        const fetchData = async () => {
            const response = await fetch('/api/rsvp-data')
            const result = await response.json()
            setData(result)
            setLoading(false)
            if (result?.user?.is_admin !== undefined) {
                updateAdminStatus(result.user.is_admin)
            }
            if (!result?.user) {
                window.location.href = '/'
            }
        }
        fetchData()
    }, [token])

    if (token) {
        return null
    }

    const isAdmin = data?.user?.is_admin ?? cachedIsAdmin

    return (
        <PageLayout
            activePage="rsvp"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            {!loading && data?.user && (
                <>
                    <p
                        className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center"
                        data-testid="rsvp-heading"
                    >
                        Registration to attend
                    </p>
                    <p
                        className="italic text-center mb-8 whitespace-pre-wrap"
                        data-testid={`${data.existingRsvp ? 'rsvp-returning' : 'rsvp-first-time'}`}
                    >
                        {data.existingRsvp
                            ? 'The spirits already hold your name.\nYou may revise your fate below until October 28th.'
                            : 'The spirits require your answer no later than October 28th.'}
                    </p>

                    <RsvpForm
                        user={{ id: data.user.id, name: data.user.name }}
                        existingRsvp={data.existingRsvp}
                        prize={data.prize}
                        partyDetails={data.partyDetails}
                    />
                </>
            )}
        </PageLayout>
    )
}

export default function RSVPPage() {
    return (
        <Suspense fallback={null}>
            <RsvpPageContent />
        </Suspense>
    )
}
