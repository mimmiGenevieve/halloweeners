'use client'
import PageLayout from './PageLayout'
import { useSearchParams } from 'next/navigation'
import { BoldText } from '@/lib/bold'
import { useAdminStatusCache } from '@/lib/auth-cache'
import { useState, useEffect, Suspense } from 'react'
import { PartyDetailsRow } from '@/lib/types/details'
import { formatPartyDate } from '@/lib/helpers/misc'

export type DetailsDataResponse = {
    user: { id: string; is_admin?: boolean } | null
    prize?: string
    partyDetails: PartyDetailsRow
} | null

function DetailsPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')
    const authError = searchParams?.get('authError')
    const [data, setData] = useState<DetailsDataResponse>(null)
    const [loading, setLoading] = useState(true)
    const [cachedIsAdmin, updateAdminStatus] = useAdminStatusCache()

    useEffect(() => {
        if (token) {
            window.location.href = `/api/token?token=${encodeURIComponent(token)}&next=/`
            return
        }

        let cancelled = false

        const fetchData = async () => {
            try {
                const response = await fetch('/api/details-data')
                if (!response.ok) {
                    throw new Error(`details-data returned ${response.status}`)
                }
                const result = await response.json()
                if (cancelled) return
                setData(result)
                if (result?.user?.is_admin !== undefined) {
                    updateAdminStatus(result.user.is_admin)
                }
            } catch (error) {
                console.error('Failed to load party details:', error)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchData()

        return () => {
            cancelled = true
        }
    }, [token])

    if (token) {
        return null
    }

    const isAuthenticated = !!data?.user?.id
    const isAdmin = data?.user?.is_admin ?? cachedIsAdmin

    return (
        <PageLayout
            activePage="details"
            isAuthenticated={isAuthenticated}
            isLoading={loading}
            isAdmin={isAdmin}
            authError={authError ?? undefined}
        >
            {isAuthenticated && (
                <>
                    {data?.prize && (
                        <div
                            data-testid="prev-winner-info"
                            className="border border-fuchsia-300/50 bg-fuchsia-300/10 rounded p-4 mb-8 text-left flex flex-col gap-4"
                        >
                            <p className="moontime lg:text-7xl text-5xl text-center">
                                Honored champion of last year
                            </p>
                            <p>
                                Your triumph at last year's gathering has not
                                been forgotten. As the reigning master of{' '}
                                <span className="font-bold">{data.prize}</span>,
                                your legacy is secure—but your reign must end,
                                for a new master shall be crowned this year.
                            </p>
                            <p>
                                Return bearing the prize you once claimed, that
                                it may be transferred with honor during the
                                night's ceremony.
                            </p>
                            <p className="font-bold ">
                                Should the fates conspire against your
                                attendance, arrange for another worthy specter
                                to carry out this sacred duty in your stead.
                            </p>
                        </div>
                    )}
                    <p className="lg:text-7xl text-5xl mt-10 font-bold moontime mb-4 text-center">
                        Essential Details for the Night
                    </p>
                    {data?.partyDetails && (
                        <div className="flex flex-col">
                            <span>
                                Date: {formatPartyDate(data.partyDetails.date)}
                            </span>
                            <span>
                                Time: {data.partyDetails.start}
                                {data.partyDetails.end &&
                                    ` to ${data.partyDetails.end}`}
                            </span>
                            <span>
                                Location: {data.partyDetails.address}.{' '}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.partyDetails.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    Directions.
                                </a>
                            </span>
                            {data.partyDetails.address_extra && (
                                <i>
                                    <BoldText
                                        text={data.partyDetails.address_extra}
                                    />
                                </i>
                            )}
                        </div>
                    )}
                    <p className="mt-7">
                        <b>Bring your own elixir of choice</b>, though light
                        snacks will be provided.
                    </p>
                    <p>
                        Prizes will be bestowed in the following categories:{' '}
                        <b>Best Duo</b>, <b>Best Single</b>, <b>Scariest</b>,
                        and
                        <b> Most Creative</b>.
                    </p>
                    <p>
                        The gathering begins promptly.{' '}
                        <b>Tardiness is not advised.</b>{' '}
                    </p>
                    <p className="italic mt-8 text-center">
                        The night awaits you; let the shadows guide your way.
                    </p>
                </>
            )}
        </PageLayout>
    )
}

export default function DetailsPage() {
    return (
        <Suspense fallback={null}>
            <DetailsPageContent />
        </Suspense>
    )
}
