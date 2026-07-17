'use client'

import PageLayout from '@/app/PageLayout'
import InvitedGuests from './invitedGuests'
import { Suspense } from 'react'
import { GuestOption, WinnerRow } from '@/lib/queries/winners'
import { useAdminRouteData } from '../useAdminRouteData'

type InvitedDataResponse = {
    guests: GuestOption[]
    winners: WinnerRow[]
}

function AdminPageInvitedContent() {
    const { data, loading, token, isAdmin, refetch } =
        useAdminRouteData<InvitedDataResponse>({
            endpoint: '/api/admin-data/invited',
            nextPath: '/admin/invited',
        })

    if (token) {
        return null
    }

    return (
        <PageLayout
            activePage="invited"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            <div className="relative" data-testid="admin-page-content">
                <InvitedGuests
                    guests={data?.guests ?? []}
                    winners={data?.winners ?? []}
                    refetchCallback={() => {
                        void refetch()
                    }}
                />
            </div>
        </PageLayout>
    )
}

export default function AdminPageInvited() {
    return (
        <Suspense fallback={null}>
            <AdminPageInvitedContent />
        </Suspense>
    )
}
