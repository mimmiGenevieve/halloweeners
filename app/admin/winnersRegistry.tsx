'use client'

import { GuestOption, PrizeOption, WinnerRow } from '@/lib/winners'
import WinnersAdminForm from './WinnersAdminForm'
import { useState } from 'react'

type WinnersRegistryProps = {
    guests: GuestOption[]
    prizes: PrizeOption[]
    previousYearWinners: WinnerRow[]
    previousYear: number
}

export default function WinnersRegistry({
    guests,
    prizes,
    previousYearWinners,
    previousYear,
}: WinnersRegistryProps) {
    const [winnersOpen, setWinnersOpen] = useState(false)
    const [addWinnersOpen, setAddWinnersOpen] = useState(false)

    const currentYear = new Date().getFullYear()

    return (
        <>
            <p className="lg:text-7xl text-5xl mt-20 font-bold moontime mb-5 text-center">
                Winners Registry
            </p>
            <p className="text-center mb-8">
                Review {previousYear} winners and register the chosen souls for{' '}
                {currentYear}.
            </p>

            <h2
                className="text-6xl mb-3 flex flex-row items-center gap-3 cursor-pointer select-none"
                onClick={() => setWinnersOpen(!winnersOpen)}
            >
                <span className="text-base">{winnersOpen ? '▲' : '▼'}</span>{' '}
                Winners of the last gathering{' '}
            </h2>

            <div
                className={`${winnersOpen ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden transition-[max-height] duration-500`}
            >
                {previousYearWinners.length > 0 ? (
                    <div className="overflow-x-auto border border-(--foreground)/20 rounded">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-(--foreground)/20">
                                    <th className="p-3">Guest</th>
                                    <th className="p-3">Prize</th>
                                    <th className="p-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previousYearWinners.map((winner) => (
                                    <tr
                                        key={winner.guest_id}
                                        className="border-b last:border-b-0 border-(--foreground)/10"
                                    >
                                        <td className="p-3">
                                            {winner.guest_name}
                                        </td>
                                        <td className="p-3">
                                            {winner.prize_name}
                                        </td>
                                        <td className="p-3">
                                            {winner.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No winners recorded for {previousYear}.</p>
                )}
            </div>

            <h2
                className="text-6xl mb-3 flex flex-row items-center gap-3 cursor-pointer select-none"
                onClick={() => setAddWinnersOpen(!addWinnersOpen)}
            >
                <span className="text-base">{addWinnersOpen ? '▲' : '▼'}</span>{' '}
                Add this years winners
            </h2>
            <div
                className={`${addWinnersOpen ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden transition-[max-height] duration-500`}
            >
                <WinnersAdminForm
                    guests={guests}
                    prizes={prizes}
                    currentYear={currentYear}
                />
            </div>
        </>
    )
}
