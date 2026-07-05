'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import InvitationShell from '../InvitationShell'
import WinnersRegistry from './winnersRegistry'
import { GuestOption, PrizeOption, WinnerRow } from '@/lib/queries/winners'
import { useSearchParams } from 'next/navigation'
import { useAdminStatusCache } from '@/lib/auth-cache'

type AdminDataResponse = {
    user: { id: string; name: string; is_admin?: boolean } | null
    guests: GuestOption[]
    signedUpGuests: Array<{
        id: string
        name: string
        email: string | null
        bringing_plus_one: boolean
        plus_one_name: string | null
        cipher_answer: string | null
    }>
    prizes: PrizeOption[]
    previousYearWinners: WinnerRow[]
} | null

function AdminPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')
    const [data, setData] = useState<AdminDataResponse>(null)
    const [loading, setLoading] = useState(true)
    const [cachedIsAdmin, updateAdminStatus] = useAdminStatusCache()
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return

        if (token) {
            window.location.href = `/api/token?token=${encodeURIComponent(token)}&next=/admin`
            return
        }

        hasFetched.current = true
        const fetchData = async () => {
            const response = await fetch('/api/admin-data')
            const result = await response.json()
            setData(result)
            setLoading(false)
            if (result?.user?.is_admin !== undefined) {
                updateAdminStatus(result.user.is_admin)
            }
            if (!result?.user) {
                window.location.href = '/'
            } else if (!result.user.is_admin) {
                window.location.href = '/'
            }
        }
        fetchData()
    }, [token])

    if (token) {
        return null
    }

    const isAdmin = data?.user?.is_admin ?? cachedIsAdmin

    const previousYear = new Date().getFullYear() - 1

    return (
        <InvitationShell
            activePage="admin"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            {!loading && data && (
                <>
                    <p
                        className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center"
                        data-testid="admin-heading"
                    >
                        Signed up Guests
                    </p>

                    <p className="text-center mb-8">
                        {data.signedUpGuests.length +
                            data.signedUpGuests.filter(
                                (guest) => guest.bringing_plus_one
                            ).length}{' '}
                        souls (
                        {
                            data.signedUpGuests.filter(
                                (guest) => guest.bringing_plus_one
                            ).length
                        }{' '}
                        plus one
                        {data.signedUpGuests.filter(
                            (guest) => guest.bringing_plus_one
                        ).length > 1
                            ? 's'
                            : ''}
                        ) have pledged to attend the gathering.
                    </p>

                    {data.signedUpGuests.length > 0 ? (
                        <div className="overflow-x-auto rounded">
                            <ul className="space-y-2 list-disc list-inside">
                                {data.signedUpGuests.map((guest) => (
                                    <li key={guest.id}>
                                        <strong>{guest.name}</strong>
                                        {guest.email ? ` (${guest.email})` : ''}

                                        <ul className="pl-5">
                                            {guest.bringing_plus_one && (
                                                <li>
                                                    Bringing:{' '}
                                                    {guest.plus_one_name}
                                                </li>
                                            )}
                                            {guest.cipher_answer && (
                                                <li>
                                                    Cipher answer:{' '}
                                                    {guest.cipher_answer}
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No guests have signed up yet.</p>
                    )}

                    <WinnersRegistry
                        guests={data.guests}
                        prizes={data.prizes}
                        previousYearWinners={data.previousYearWinners}
                        previousYear={previousYear}
                    />
                </>
            )}
        </InvitationShell>
    )
}

export default function AdminPage() {
    return (
        <Suspense fallback={null}>
            <AdminPageContent />
        </Suspense>
    )
}
