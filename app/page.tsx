'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
    const [activePage, setActivePage] = useState<'details' | 'rsvp'>('details')
    return (
        <div className="flex flex-col flex-1 items-center justify-center ">
            <main className="flex flex-1 w-full flex-col items-center py-20">
                <div className="flex w-full flex-col items-center text-shadow-lg bg-(--background)/60 p-[50px] pb-5">
                    <h1 className="text-9xl font-bold ">The Halloweeners</h1>
                    <p className="text-2xl mt-4">
                        An Invitation to the Eternal Night.
                    </p>

                    <div className="flex flex-row items-center justify-between mt-10 gap-10 text-2xl">
                        <button
                            onClick={() => setActivePage('details')}
                            className={`cursor-pointer
                                ${activePage === 'details' ? 'underline' : ''} 
                            `}
                        >
                            Details
                        </button>
                        |
                        <button
                            onClick={() => setActivePage('rsvp')}
                            className={`cursor-pointer
                                ${activePage === 'rsvp' ? 'underline' : ''} 
                            `}
                        >
                            RSVP
                        </button>
                    </div>
                </div>

                {activePage === 'details' && (
                    <div className="flex flex-col  bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200">
                        <p className="text-7xl mt-4 font-bold moontime mb-10 text-center">
                            Essential Details for the Night
                        </p>
                        <p>
                            <b>Bring your own elixir of choice</b>, though light
                            snacks will be provided.
                        </p>
                        <p>
                            Prizes will be bestowed in the following categories:
                            <b>Best Duo</b>, <b>Best Single</b>, <b>Scariest</b>
                            , and <b>Most Creative</b>.
                        </p>
                        <p>
                            The gathering begins promptly.{' '}
                            <b>Tardiness is not advised.</b> Upon your arrival,
                            call Twoday on the intercom to be granted entry.
                        </p>
                        <p className="italic mt-8 text-center">
                            The night awaits you; let the shadows guide your
                            way.
                        </p>
                    </div>
                )}
                {activePage === 'rsvp' && (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200">
                        <p className="text-7xl mt-4 font-bold moontime mb-5 text-center">
                            Registration to attend
                        </p>
                        <p className="italic text-center mb-8">
                            The spirits require your answer no later than
                            October 28th.
                        </p>
                        <form>
                            <input placeholder="Name" />
                            <input placeholder="Email" />
                            <div>
                                Will you be accompanied by another soul?
                                <i>
                                    You may bring a companion; be it a friend,
                                    partner, or even a particularly charming
                                    houseplant. But only one.
                                </i>
                                <label>
                                    <input type="radio" /> Yes
                                </label>
                                <label>
                                    <input type="radio" /> No
                                </label>
                            </div>
                            <label>
                                Kindly share the name of your companion
                            </label>
                            <input />

                            <label>
                                The spirits bid your answer to the cipher.
                                <i>
                                    If you have solved the cipher, now is the
                                    time to write the answer.
                                </i>
                                <input />
                            </label>
                        </form>
                    </div>
                )}
            </main>
        </div>
    )
}
