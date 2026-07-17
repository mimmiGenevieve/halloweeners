'use client'

import PageLayout from '@/app/PageLayout'
import WinnersRegistry from './addWinners'
import { Suspense } from 'react'
import { GuestOption, PrizeOption } from '@/lib/queries/winners'
import { useAdminRouteData } from '../../useAdminRouteData'

type AddWinnersDataResponse = {
    guests: GuestOption[]
    prizes: PrizeOption[]
}

function AdminPageAddWinnersContent() {
    const { data, loading, token, isAdmin } =
        useAdminRouteData<AddWinnersDataResponse>({
            endpoint: '/api/admin-data/add-winners',
            nextPath: '/admin/addWinners',
        })

    if (token) {
        return null
    }

    return (
        <PageLayout
            activePage="addWinners"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            <div className="relative" data-testid="admin-page-content">
                <WinnersRegistry
                    guests={data?.guests ?? []}
                    prizes={data?.prizes ?? []}
                    previousYearWinners={[]}
                />
            </div>
        </PageLayout>
    )
}

export default function AdminPageAddWinners() {
    return (
        <Suspense fallback={null}>
            <AdminPageAddWinnersContent />
        </Suspense>
    )
}
