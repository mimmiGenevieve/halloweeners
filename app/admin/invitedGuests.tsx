'use client'
import { GuestOption, WinnerRow } from '@/lib/queries/winners'
import { inviteGuest, uninviteGuest } from './actions'
import { useEffect, useState } from 'react'

type InvitedGuestsProps = {
    guests: GuestOption[]
    winners: WinnerRow[]
    refetchCallback: () => void
}

type FormDataType = {
    token: string
    name: string
}

export default function InvitedGuests({
    guests,
    winners,
    refetchCallback,
}: InvitedGuestsProps) {
    const [uninvitedMsg, setUninvitedMsg] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<FormDataType>({
        name: '',
        token: '',
    })
    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
    }

    async function uninvite(guestId: string, name: string) {
        await uninviteGuest(guestId)
            .then(() => {
                refetchCallback()
                setUninvitedMsg(`Guest ${name} has been uninvited.`)
            })
            .catch((error) => {
                console.error('Error uninviting guest:', error)
                setUninvitedMsg(`Failed to uninvite guest ${name}.`)
            })
    }

    async function invite() {
        setIsSubmitting(true)
        const formDataObj = new FormData()

        formDataObj.append('name', formData.name.trim())
        formDataObj.append('token', formData.token.trim())

        await inviteGuest(formDataObj)
            .then(() => {
                refetchCallback()
                setFormData({ name: '', token: '' })
            })
            .catch((error) => {
                console.error('Error inviting guest:', error)
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const handleFormUpdate = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <div className="flex flex-col gap-5 relative">
                <div>
                    <h2 className="lg:text-7xl text-5xl font-bold moontime mb-5 text-center">
                        Invited Guests
                    </h2>
                    <p className="text-center mb-8">
                        Review the invited guests and add more.
                    </p>
                </div>
                <div
                    className={`bg-(--background) border border-(--foreground)/20 rounded absolute top-0 right-20 ${uninvitedMsg ? 'opacity-100' : 'opacity-0'} transition-[opacity] duration-500`}
                >
                    <div className="flex justify-between text-xl text-rose-400 border border-rose-300/50 bg-rose-300/10 rounded px-2 py-1 transition-colors min-h-11 min-w-100 flex items-center">
                        {uninvitedMsg}
                        <button onClick={() => setUninvitedMsg('')}>X</button>
                    </div>
                </div>
                {guests.length > 0 ? (
                    <div className="overflow-x-auto border border-(--foreground)/20 rounded relative">
                        <table className="w-full text-left border-collapse ">
                            <thead>
                                <tr className="border-b border-(--foreground)/20">
                                    <th className="p-3"></th>
                                    <th className="p-3">Token</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Prize holder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest) => (
                                    <tr
                                        key={guest.id}
                                        className="border-b last:border-b-0 border-(--foreground)/10"
                                    >
                                        <td className="p-3 w-[10px] lg:w-20">
                                            <button
                                                className="hidden text-rose-400 border border-rose-300/50 bg-rose-300/10 rounded px-2 py-1 hover:bg-rose-400/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    winners.find(
                                                        (winner) =>
                                                            winner.guest_id ===
                                                            guest.id
                                                    )
                                                        ? true
                                                        : false
                                                }
                                                onClick={() =>
                                                    uninvite(
                                                        guest.id,
                                                        guest.name
                                                    )
                                                }
                                            >
                                                Uninvite
                                            </button>

                                            <button
                                                className="lg:hidden text-rose-400 border border-rose-300/50 bg-rose-300/10 rounded px-2 py-1 hover:bg-rose-400/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    winners.find(
                                                        (winner) =>
                                                            winner.guest_id ===
                                                            guest.id
                                                    )
                                                        ? true
                                                        : false
                                                }
                                                onClick={() =>
                                                    uninvite(
                                                        guest.id,
                                                        guest.name
                                                    )
                                                }
                                            >
                                                X
                                            </button>
                                        </td>
                                        <td
                                            className="p-3 cursor-pointer hover:underline w-8"
                                            onClick={() =>
                                                copyToClipboard(guest.token)
                                            }
                                        >
                                            {guest.token}
                                        </td>
                                        <td className="p-3">{guest.name}</td>
                                        <td className="p-3">
                                            {winners.find(
                                                (winner) =>
                                                    winner.guest_id === guest.id
                                            )?.prize_name ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td>
                                        <input
                                            className="p-3"
                                            placeholder="Token"
                                            type="text"
                                            id="token"
                                            name="token"
                                            onChange={(e) =>
                                                handleFormUpdate(
                                                    'token',
                                                    e.target.value
                                                )
                                            }
                                            value={formData.token}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="p-3"
                                            placeholder="Name"
                                            type="text"
                                            id="name"
                                            name="name"
                                            onChange={(e) =>
                                                handleFormUpdate(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            value={formData.name}
                                            required
                                        />
                                    </td>
                                    <td className="p-3">
                                        <button
                                            className="hidden text-amber-400 border border-amber-300/50 bg-amber-300/10 rounded px-2 py-1 hover:bg-amber-400/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={invite}
                                            disabled={
                                                formData.name.length === 0 ||
                                                formData.token.length === 0 ||
                                                isSubmitting
                                            }
                                        >
                                            Invite
                                        </button>
                                        <button
                                            className="lg:hidden text-amber-400 border border-amber-300/50 bg-amber-300/10 rounded px-2 py-1 hover:bg-amber-400/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={invite}
                                            disabled={
                                                formData.name.length === 0 ||
                                                formData.token.length === 0 ||
                                                isSubmitting
                                            }
                                        >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No invited guests recorded.</p>
                )}
            </div>
        </>
    )
}
