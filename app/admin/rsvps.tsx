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
                <div className="overflow-x-auto rounded">
                    <ul className="space-y-2 list-disc list-inside">
                        {guests.map((guest) => (
                            <li key={guest.id}>
                                <strong>{guest.name}</strong>
                                {guest.email ? ` (${guest.email})` : ''}

                                <ul className="pl-5">
                                    {guest.bringing_plus_one && (
                                        <li>Bringing: {guest.plus_one_name}</li>
                                    )}
                                    {guest.cipher_answer && (
                                        <li>
                                            Cipher answer: {guest.cipher_answer}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No guests have signed up yet.</p>
            )}
        </div>
    )
}
