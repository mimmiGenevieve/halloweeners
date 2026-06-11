'use client'
import { useState } from 'react'
import InvitationShell from '../InvitationShell'

export default function RSVPPage() {
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
        <InvitationShell activePage="rsvp">
            <div className="flex flex-col bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200 h-170 overflow-y-auto no-scrollbar">
                <p className="text-7xl mt-4 font-bold moontime mb-5 text-center">
                    Registration to attend
                </p>
                <p className="italic text-center mb-8">
                    The spirits require your answer no later than October 28th.
                </p>
                <form className="flex flex-col gap-4 w-full">
                    <input
                        className="border-(--foreground) border-2 py-2 px-4 rounded"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) =>
                            handleFormUpdate('name', e.target.value)
                        }
                    />
                    <input
                        className="border-(--foreground) border-2 py-2 px-4 rounded"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            handleFormUpdate('email', e.target.value)
                        }
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            Will you be accompanied by another soul?{' '}
                            <label>
                                <input
                                    type="radio"
                                    checked={
                                        formData.bringingCompanion === true
                                    }
                                    onChange={() =>
                                        handleFormUpdate(
                                            'bringingCompanion',
                                            true
                                        )
                                    }
                                />{' '}
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={
                                        formData.bringingCompanion === false
                                    }
                                    onChange={() =>
                                        handleFormUpdate(
                                            'bringingCompanion',
                                            false
                                        )
                                    }
                                />{' '}
                                No
                            </label>
                        </div>

                        <p className="italic">
                            You may bring a companion; be it a friend, partner,
                            or even a particularly charming houseplant. But only
                            one.
                        </p>
                    </div>
                    {formData.bringingCompanion && (
                        <label>
                            <span className="italic">
                                The spirits are intrigued by your choice to
                                bring a companion.
                            </span>

                            <input
                                className="border-(--foreground) border-2 py-2 px-4 rounded w-full"
                                placeholder=" Kindly share the name of your companion"
                                value={formData.companionName}
                                onChange={(e) =>
                                    handleFormUpdate(
                                        'companionName',
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                    )}

                    <label>
                        If you have solved the cipher, now is the time to write
                        the answer.
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
                        className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-4 w-max self-center"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </InvitationShell>
    )
}
