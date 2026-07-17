import { WinnerRow } from '@/lib/queries/winners'

type LastYearWinnersProps = {
    previousYearWinners: WinnerRow[]
    previousYear: number
    isLoading: boolean
}

export default function LastYearWinners({
    previousYearWinners,
    previousYear,
    isLoading,
}: LastYearWinnersProps) {
    const loadingRow = (
        <tr className="border-b last:border-b-0 border-(--foreground)/10">
            <td className="p-3">
                <div className="h-6 bg-(--foreground)/10 rounded animate-pulse" />
            </td>
            <td className="p-3">
                <div className="h-6 bg-(--foreground)/10 rounded animate-pulse" />
            </td>
            <td className="p-3">
                <div className="h-6 bg-(--foreground)/10 rounded animate-pulse" />
            </td>
        </tr>
    )

    return (
        <div className="bg-(--background)/60 lg:p-[50px] p-[25px] pt-0 lg:pt-0">
            {isLoading ? (
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
                            {loadingRow}
                            {loadingRow}
                            {loadingRow}
                            {loadingRow}
                        </tbody>
                    </table>
                </div>
            ) : previousYearWinners.length > 0 ? (
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
