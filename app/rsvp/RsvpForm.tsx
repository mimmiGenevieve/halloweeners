'use client'

import { GuestLookupRow, RsvpData } from '@/lib/guest-auth'
import { sendConfirmationEmail, submitRsvp } from './actions'
import { useState } from 'react'

type RsvpFormProps = {
    user: GuestLookupRow | null
    existingRsvp: RsvpData | null
    prize?: string
}

type FormDataType = {
    name: string
    email?: string
    bringingCompanion: boolean
    companionName?: string
    cipherAnswer?: string
}

export default function RsvpForm({ user, existingRsvp, prize }: RsvpFormProps) {
    const [formData, setFormData] = useState<FormDataType>({
        name: user?.name ?? '',
        email: existingRsvp?.email ?? '',
        bringingCompanion: existingRsvp?.bringing_plus_one ?? false,
        companionName: existingRsvp?.plus_one_name ?? '',
        cipherAnswer: existingRsvp?.cipher_answer ?? '',
    })
    const [hasEdited, setHasEdited] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleFormUpdate = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setHasEdited(true)
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSuccessMessage('')

        try {
            const formDataObj = new FormData()
            formData.email && formDataObj.append('email', formData.email)
            formDataObj.append(
                'bringingCompanion',
                String(formData.bringingCompanion)
            )
            formData.companionName &&
                formDataObj.append('companionName', formData.companionName)
            formData.cipherAnswer &&
                formDataObj.append('cipherAnswer', formData.cipherAnswer)

            await submitRsvp(formDataObj)

            formData.email &&
                sendConfirmationEmail(
                    formData.name,
                    formData.email,
                    formData.bringingCompanion
                        ? formData.companionName
                        : undefined,
                    prize
                )
            setSuccessMessage(
                `The spirits have received your answer${formData.email ? ', and they have whispered a confirmation to your inbox. If silence greets you, check your spam.' : '.'}`
            )
        } catch (error) {
            console.error('RSVP submission failed:', error)
            setSuccessMessage(
                'The spirits could not receive your answer. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {successMessage && (
                <p
                    className={`text-center ${
                        successMessage.includes('received')
                            ? 'text-green-300'
                            : 'text-red-300'
                    }`}
                >
                    {successMessage}
                </p>
            )}
            <input
                className="border-(--foreground) border-2 py-2 px-4 rounded"
                placeholder="Name"
                type="text"
                id="name"
                onChange={(e) => handleFormUpdate('name', e.target.value)}
                value={formData.name}
                required
            />
            <input
                className="border-(--foreground) border-2 py-2 px-4 rounded"
                placeholder="Email"
                type="email"
                id="email"
                maxLength={320}
                value={formData.email}
                onChange={(e) => handleFormUpdate('email', e.target.value)}
            />
            <span className="text-xs italic opacity-70 -mt-2">
                Used only to send your confirmation and/or any updates to the
                details of the party. If you prefer not to share your email, the
                spirits will accept your answer without it-they have other means
                of contacting you, anyway.
            </span>
            <div className="flex flex-col ">
                <div className="flex gap-2">
                    Will you be accompanied by another soul?{' '}
                    <label>
                        <input
                            type="radio"
                            checked={formData.bringingCompanion === true}
                            onChange={() =>
                                handleFormUpdate('bringingCompanion', true)
                            }
                        />{' '}
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={formData.bringingCompanion === false}
                            onChange={() =>
                                handleFormUpdate('bringingCompanion', false)
                            }
                        />{' '}
                        No
                    </label>
                </div>

                <p className="italic ">
                    You may bring a companion; be it a friend, partner, or even
                    a particularly charming houseplant. But only one.
                </p>
            </div>
            {formData.bringingCompanion && (
                <label>
                    The spirits are intrigued by your choice to bring a
                    companion.
                    <input
                        className="border-(--foreground) border-2 py-2 px-4 rounded w-full"
                        placeholder="Kindly share the name of your companion"
                        maxLength={120}
                        value={formData.companionName}
                        onChange={(e) =>
                            handleFormUpdate('companionName', e.target.value)
                        }
                    />
                </label>
            )}

            <label>
                If you have solved the cipher, now is the time to write the
                answer.
                <input
                    className="border-(--foreground) border-2 py-2 px-4 rounded w-full"
                    placeholder="The spirits bid your answer"
                    maxLength={250}
                    value={formData.cipherAnswer}
                    onChange={(e) =>
                        handleFormUpdate('cipherAnswer', e.target.value)
                    }
                />
            </label>

            <button
                type="submit"
                disabled={isSubmitting || !hasEdited}
                className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-4 w-max self-center disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    )
}
