'use client'

type RsvpResponse = {
    id: string
    name: string
    email: string | null
    bringing_plus_one: boolean
    plus_one_name: string | null
    cipher_answer: string | null
}[]

export default function AdminPageRSVPs({ guests }: { guests: RsvpResponse }) {
    return (
        <div>
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
                {guests.filter((guest) => guest.bringing_plus_one).length} plus
                one
                {guests.filter((guest) => guest.bringing_plus_one).length > 1
                    ? 's'
                    : ''}
                ) have pledged to attend the gathering.
            </p>

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
                                                    No additional details
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
    )
}
