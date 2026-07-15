'use client'

import PageLayout from '@/app/PageLayout'
import { Suspense } from 'react'
import { SignedUpGuestOption } from '@/lib/queries/winners'
import { useAdminRouteData } from '../useAdminRouteData'

type RsvpDataResponse = {
    signedUpGuests: SignedUpGuestOption[]
}

function AdminPageRSVPsContent() {
    const { data, loading, token, isAdmin } =
        useAdminRouteData<RsvpDataResponse>({
            endpoint: '/api/admin-data/rsvps',
            nextPath: '/admin/rsvps',
        })

    const guests = data?.signedUpGuests ?? []

    if (token) {
        return null
    }

    return (
        <PageLayout
            activePage="rsvps"
            isAuthenticated={true}
            isLoading={loading}
            isAdmin={isAdmin}
        >
            <div
                className="flex flex-col relative"
                data-testid="admin-page-content"
            >
                <div className="bg-(--background)/60 lg:p-[50px] p-[25px] lg:pb-0 pb-0">
                    <p
                        className="lg:text-7xl text-5xl mt-4 font-bold moontime mb-5 text-center"
                        data-testid="admin-heading"
                    >
                        Signed up Guests
                    </p>

                    <p className="text-center mb-8">
                        {guests.length +
                            guests.filter((guest) => guest.bringing_plus_one)
                                .length}{' '}
                        souls (
                        {
                            guests.filter((guest) => guest.bringing_plus_one)
                                .length
                        }{' '}
                        plus one
                        {guests.filter((guest) => guest.bringing_plus_one)
                            .length > 1
                            ? 's'
                            : ''}
                        ) have pledged to attend the gathering.
                    </p>
                </div>

                <div className="bg-(--background)/60 lg:p-[50px] p-[25px] pt-0 lg:pt-0">
                    {guests.length > 0 ? (
                        <div className="space-y-4">
                            {guests.map((guest) => (
                                <div
                                    key={guest.id}
                                    className="overflow-x-auto border border-(--foreground)/20 rounded"
                                >
                                    <table className="w-full text-left border-collapse ">
                                        <thead>
                                            <tr className="border-b border-(--foreground)/20 bg-(--foreground)/5">
                                                <th className="p-3" colSpan={2}>
                                                    {guest.name}
                                                    {guest.email && (
                                                        <span className="font-normal text-sm opacity-70">
                                                            {' '}
                                                            ({guest.email})
                                                        </span>
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guest.bringing_plus_one && (
                                                <tr className="border-b last:border-b-0 border-(--foreground)/10">
                                                    <td className="p-3 w-10 opacity-70">
                                                        Bringing
                                                    </td>
                                                    <td className="p-3">
                                                        {guest.plus_one_name}
                                                    </td>
                                                </tr>
                                            )}
                                            {guest.cipher_answer && (
                                                <tr className="border-b last:border-b-0 border-(--foreground)/10">
                                                    <td className="p-3 opacity-70">
                                                        Cipher answer
                                                    </td>
                                                    <td className="p-3">
                                                        {guest.cipher_answer}
                                                    </td>
                                                </tr>
                                            )}
                                            {!guest.bringing_plus_one &&
                                                !guest.cipher_answer && (
                                                    <tr>
                                                        <td
                                                            className="p-3 opacity-50 italic"
                                                            colSpan={2}
                                                        >
                                                            No additional
                                                            details
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No guests have signed up yet.</p>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}

export default function AdminPageRSVPs() {
    return (
        <Suspense fallback={null}>
            <AdminPageRSVPsContent />
        </Suspense>
    )
}
