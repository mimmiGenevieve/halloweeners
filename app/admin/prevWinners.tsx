import { WinnerRow } from '@/lib/queries/winners'

type LastYearWinnersProps = {
    previousYearWinners: WinnerRow[]
    previousYear: number
}

export default function LastYearWinners({
    previousYearWinners,
    previousYear,
}: LastYearWinnersProps) {
    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="lg:text-7xl text-5xl font-bold moontime mb-5 text-center">
                    Last Years Winners
                </h2>
                <p className="text-center mb-8">
                    Review {previousYear} winners.
                </p>
            </div>

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
                                    <td className="p-3">{winner.guest_name}</td>
                                    <td className="p-3">{winner.prize_name}</td>
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
    )
}
