'use client'

import PageLayout from '@/app/PageLayout'
import LastYearWinners from './prevWinners'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { WinnerRow } from '@/lib/queries/winners'
import { useAdminRouteData } from '../../useAdminRouteData'
import { getWinnerYearOptions } from '@/lib/helpers/misc'

type PreviousWinnersDataResponse = {
    selectedYearWinners: WinnerRow[]
    availableYears: number[]
    selectedYear: number
}

function AdminPagePreviousWinnersContent() {
    const { data, loading, token, isAdmin } =
        useAdminRouteData<PreviousWinnersDataResponse>({
            endpoint: '/api/admin-data/prev-winners',
            nextPath: '/admin/prevWinners',
        })
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [yearWinners, setYearWinners] = useState<WinnerRow[]>([])
    const [yearLoading, setYearLoading] = useState(false)

    const availableYears = useMemo(
        () => data?.availableYears ?? getWinnerYearOptions(),
        [data?.availableYears]
    )

    const resolvedYear =
        selectedYear ?? data?.selectedYear ?? new Date().getFullYear()

    useEffect(() => {
        if (!data) {
            return
        }

        if (selectedYear === null && data.selectedYear === resolvedYear) {
            setYearWinners(data.selectedYearWinners ?? [])
            return
        }

        let isActive = true
        setYearLoading(true)

        void fetch(`/api/admin-data/prev-winners?year=${resolvedYear}`)
            .then((response) => response.json())
            .then((result) => {
                if (!isActive) {
                    return
                }

                setYearWinners(result?.selectedYearWinners ?? [])
            })
            .finally(() => {
                if (isActive) {
                    setYearLoading(false)
                }
            })

        return () => {
            isActive = false
        }
    }, [data, resolvedYear, selectedYear])

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
            <div
                className="relative flex flex-col"
                data-testid="admin-page-content"
            >
                <div className="bg-(--background)/60 lg:p-[50px] p-[25px] lg:pb-0 pb-0">
                    <h2 className="lg:text-7xl text-5xl font-bold moontime mb-5 text-center">
                        Winners by Year
                    </h2>
                    <p className="text-center mb-8">
                        Choose a year to review the winners for that event.
                    </p>
                    <div className="flex justify-end">
                        <label className="flex flex-col gap-2 text-sm font-semibold">
                            <select
                                value={resolvedYear}
                                onChange={(event) =>
                                    setSelectedYear(Number(event.target.value))
                                }
                                className="border-(--foreground)/20 border-b-0 border-2 py-2 px-4 rounded min-w-20"
                            >
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <LastYearWinners
                    previousYearWinners={yearWinners}
                    previousYear={resolvedYear}
                    isLoading={yearLoading}
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
