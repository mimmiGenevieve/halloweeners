'use client'
import { useAdminStatusCache } from '@/lib/auth-cache'
import Link from 'next/link'
import { useRef, useState } from 'react'

type HeaderProps = {
    activePage: 'details' | 'rsvp' | 'admin'
    isAuthenticated: boolean
    isAdmin?: boolean
}

function EasterEggModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="bg-(--background) border border-red-300/50 rounded p-6 max-w-200 text-center">
                <p className="moontime lg:text-8xl text-6xl font-bold">
                    A hidden door creaks open
                </p>
                <p className="mb-4">
                    You weren't supposed to find this. But since you did—
                    persistence has its own kind of magic. Tell Mimmi the words
                    below when arriving at the gathering, and a reward awaits.
                </p>
                <p className="text-2xl font-bold mb-4">alex is a bitch</p>
                <button onClick={onClose} className="underline text-sm">
                    close
                </button>
            </div>
        </div>
    )
}

export default function Header({
    activePage,
    isAuthenticated,
    isAdmin,
}: HeaderProps) {
    const [showEasterEgg, setShowEasterEgg] = useState(false)
    const [cachedIsAdmin] = useAdminStatusCache()
    const clickCount = useRef(0)
    const resetTimer = useRef<NodeJS.Timeout | null>(null)

    const effectiveIsAdmin = isAdmin ?? cachedIsAdmin

    const handleHeaderClick = () => {
        clickCount.current += 1

        if (resetTimer.current) clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => {
            clickCount.current = 0
        }, 1500) // resets if they pause too long

        if (clickCount.current >= 2) {
            setShowEasterEgg(true)
            clickCount.current = 0
        }
    }

    return (
        <>
            {showEasterEgg && (
                <EasterEggModal onClose={() => setShowEasterEgg(false)} />
            )}
            <div
                className="flex w-full flex-col items-center text-shadow-lg bg-(--background)/60 p-[50px] pb-5 select-none"
                onClick={handleHeaderClick}
            >
                <h1
                    className="lg:text-9xl text-6xl font-bold"
                    onClick={() =>
                        window.open(
                            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                            '_blank'
                        )
                    }
                >
                    The Halloweeners
                </h1>
                <p className="lg:text-2xl text-xl mt-4">
                    An Invitation to the Eternal Night.
                </p>

                {isAuthenticated && (
                    <div className="flex flex-row items-center justify-between mt-10 gap-10 lg:text-2xl text-xl">
                        <Link
                            href="/"
                            className={
                                activePage === 'details' ? 'underline' : ''
                            }
                        >
                            Details
                        </Link>
                        |
                        <Link
                            href="/rsvp"
                            className={activePage === 'rsvp' ? 'underline' : ''}
                        >
                            RSVP
                        </Link>
                    </div>
                )}
            </div>

            {effectiveIsAdmin && (
                <>
                    <Link
                        href="/admin"
                        className={`text-neutral-400 absolute right-0 p-3 lg:p-10 text-base ${activePage === 'admin' ? 'underline' : ''}`}
                    >
                        ADMIN
                    </Link>
                </>
            )}
        </>
    )
}
