'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import InvitationShell from '../InvitationShell'
import LastYearWinners from './prevWinners'
import { GuestOption, PrizeOption, WinnerRow } from '@/lib/queries/winners'
import { useSearchParams } from 'next/navigation'
import { useAdminStatusCache } from '@/lib/auth-cache'
import WinnersRegistry from './addWinners'
import AdminPageRSVPs from './rsvps'
import InvitedGuests from './invitedGuests'

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
    const [activeTab, setActiveTab] = useState<
        'rsvps' | 'prevWinners' | 'addWinners' | 'invited'
    >('invited')
    const [loading, setLoading] = useState(true)
    const [cachedIsAdmin, updateAdminStatus] = useAdminStatusCache()
    const hasFetched = useRef(false)

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

    useEffect(() => {
        if (hasFetched.current) return

        if (token) {
            window.location.href = `/api/token?token=${encodeURIComponent(token)}&next=/admin`
            return
        }

        hasFetched.current = true

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
            <div
                className="flex flex-wrap lg:justify-center gap-30 relative"
                data-testid="admin-page-content"
            >
                <div className="fmt-10 gap-10 lg:text-2xl text-xl select-none h-20 lg:h-full lg:w-75 lg:absolute lg:left-20">
                    <div
                        className={`cursor-pointer ${activeTab === 'invited' ? 'underline' : ''}`}
                        onClick={() => setActiveTab('invited')}
                    >
                        Invited Guests
                    </div>
                    <div
                        className={`cursor-pointer ${activeTab === 'rsvps' ? 'underline' : ''}`}
                        onClick={() => setActiveTab('rsvps')}
                    >
                        RSVPs
                    </div>
                    <div
                        className={`cursor-pointer ${activeTab === 'addWinners' || activeTab === 'prevWinners' ? 'underline' : ''}`}
                        onClick={() => setActiveTab('prevWinners')}
                    >
                        Winners
                    </div>

                    {(activeTab === 'prevWinners' ||
                        activeTab === 'addWinners') && (
                        <>
                            <div
                                className={`ml-5 cursor-pointer ${activeTab === 'prevWinners' ? 'underline' : ''}`}
                                onClick={() => setActiveTab('prevWinners')}
                            >
                                Previous Winners
                            </div>

                            <div
                                className={`ml-5 cursor-pointer ${activeTab === 'addWinners' ? 'underline' : ''}`}
                                onClick={() => setActiveTab('addWinners')}
                            >
                                Register Winners
                            </div>
                        </>
                    )}
                </div>
                {!loading && data && (
                    <div className="w-full lg:w-200">
                        {activeTab === 'rsvps' && (
                            <AdminPageRSVPs guests={data.signedUpGuests} />
                        )}
                        {activeTab === 'prevWinners' && (
                            <LastYearWinners
                                previousYearWinners={data.previousYearWinners}
                                previousYear={previousYear}
                            />
                        )}
                        {activeTab === 'addWinners' && (
                            <WinnersRegistry
                                guests={data.guests}
                                prizes={data.prizes}
                                previousYearWinners={data.previousYearWinners}
                            />
                        )}
                        {activeTab === 'invited' && (
                            <InvitedGuests
                                guests={data.guests}
                                winners={data.previousYearWinners}
                                refetchCallback={fetchData}
                            />
                        )}
                    </div>
                )}
            </div>
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
