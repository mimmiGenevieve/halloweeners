'use client'

import PageLayout from '@/app/PageLayout'
import LastYearWinners from './prevWinners'
import { Suspense } from 'react'
import { WinnerRow } from '@/lib/queries/winners'
import { useAdminRouteData } from '../../useAdminRouteData'

type PreviousWinnersDataResponse = {
    previousYearWinners: WinnerRow[]
}

function AdminPagePreviousWinnersContent() {
    const { data, loading, token, isAdmin } =
        useAdminRouteData<PreviousWinnersDataResponse>({
            endpoint: '/api/admin-data/prev-winners',
            nextPath: '/admin/prevWinners',
        })

    if (token) {
        return null
    }

    return (
        <PageLayout
            activePage="prevWinners"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            <div className="relative" data-testid="admin-page-content">
                <LastYearWinners
                    previousYearWinners={data?.previousYearWinners ?? []}
                    previousYear={new Date().getFullYear() - 1}
                />
            </div>
        </PageLayout>
    )
}

export default function AdminPagePreviousWinners() {
    return (
        <Suspense fallback={null}>
            <AdminPagePreviousWinnersContent />
        </Suspense>
    )
}
