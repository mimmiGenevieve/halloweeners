'use client'

import { useState } from 'react'

export default function RsvpForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bringingCompanion: false,
        companionName: '',
        cipherAnswer: '',
    })

    const handleFormUpdate = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <form className="flex flex-col gap-4 w-full">
            <input
                className="border-(--foreground) border-2 py-2 px-4 rounded"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleFormUpdate('name', e.target.value)}
            />
            <input
                className="border-(--foreground) border-2 py-2 px-4 rounded"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleFormUpdate('email', e.target.value)}
            />
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
                    <span className="italic">
                        The spirits are intrigued by your choice to bring a
                        companion.
                    </span>

                    <input
                        className="border-(--foreground) border-2 py-2 px-4 rounded w-full"
                        placeholder=" Kindly share the name of your companion"
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
                    value={formData.cipherAnswer}
                    onChange={(e) =>
                        handleFormUpdate('cipherAnswer', e.target.value)
                    }
                />
            </label>

            <button
                type="submit"
                className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-4 w-max self-center cursor-pointer"
            >
                Submit
            </button>
        </form>
    )
}
