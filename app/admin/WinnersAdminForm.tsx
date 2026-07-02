'use client'

import { useState } from 'react'
import { addCurrentYearWinners } from './actions'
import type { GuestOption, PrizeOption } from '@/lib/queries/winners'

type WinnersAdminFormProps = {
    guests: GuestOption[]
    prizes: PrizeOption[]
    currentYear: number
}

export default function WinnersAdminForm({
    guests,
    prizes,
    currentYear,
}: WinnersAdminFormProps) {
    const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([])
    const [prizeId, setPrizeId] = useState('')
    const [notes, setNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const handleGuestSelection = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const values = Array.from(event.target.selectedOptions).map(
            (option) => option.value
        )

        setSelectedGuestIds(values)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setMessage('')

        try {
            const payload = new FormData()
            selectedGuestIds.forEach((guestId) => {
                payload.append('guestIds', guestId)
            })
            payload.append('prizeId', prizeId)
            payload.append('notes', notes)

            const result = await addCurrentYearWinners(payload)
            setMessage(
                `Saved ${result.insertedCount} winner${result.insertedCount === 1 ? '' : 's'} for ${currentYear}.`
            )
            setSelectedGuestIds([])
            setPrizeId('')
            setNotes('')
        } catch (error) {
            console.error('Failed to save winners:', error)
            setMessage(
                'Could not save winners. Please verify selections and try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <label className="flex flex-col gap-2">
                Guests (multi-select)
                <select
                    multiple
                    size={Math.min(12, Math.max(4, guests.length))}
                    value={selectedGuestIds}
                    onChange={handleGuestSelection}
                    className="border-(--foreground) border-2 py-2 px-4 rounded min-h-36"
                    required
                >
                    {guests.map((guest) => (
                        <option
                            key={guest.id}
                            value={guest.id}
                            className={
                                selectedGuestIds.includes(guest.id)
                                    ? 'bg-(--foreground) text-(--background)'
                                    : ''
                            }
                        >
                            {guest.name}
                        </option>
                    ))}
                </select>
                <span className="text-xs italic opacity-70">
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple guests.
                </span>
            </label>

            <label className="flex flex-col gap-2">
                Prize
                <select
                    value={prizeId}
                    onChange={(event) => setPrizeId(event.target.value)}
                    className="border-(--foreground) border-2 py-2 px-4 rounded"
                    required
                >
                    <option value="">Select a prize</option>
                    {prizes.map((prize) => (
                        <option key={prize.id} value={prize.id}>
                            {prize.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-2">
                Notes
                <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={250}
                    className="border-(--foreground) border-2 py-2 px-4 rounded min-h-24"
                    placeholder="Short note about their costume"
                />
            </label>

            {message && <p className="text-sm">{message}</p>}

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    selectedGuestIds.length === 0 ||
                    !prizeId ||
                    prizes.length === 0
                }
                className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-2 w-max disabled:opacity-50 max-w-full"
            >
                {isSubmitting
                    ? 'Saving...'
                    : `Add the ${currentYear} winner${selectedGuestIds.length > 1 ? 's' : ''}${prizeId ? ' of ' + (prizes.find((p) => p.id === prizeId)?.name || '') : ''}`}
            </button>
        </form>
    )
}
