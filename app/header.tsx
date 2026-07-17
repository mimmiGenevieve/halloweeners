'use client'
import { useAdminStatusCache } from '@/lib/auth-cache'
import { ValidPages } from '@/lib/types/pages'
import Link from 'next/link'
import { useRef, useState } from 'react'

type HeaderProps = {
    activePage: ValidPages
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
                    You weren&apos;t supposed to find this. But since you did—
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

function TreeItem({
    href,
    label,
    active,
    last = false,
}: {
    href: string
    label: string
    active: boolean
    last?: boolean
}) {
    return (
        <li
            className={`relative pr-4 lg:pr-0 lg:pl-4 leading-6
                before:content-[''] before:absolute before:top-1/2 before:right-0 before:lg:right-auto before:lg:left-0
                before:w-4 before:h-px before:bg-neutral-400/40
                after:content-[''] after:absolute after:top-0 after:right-0 after:lg:right-auto after:lg:left-0
                after:bottom-0 after:w-px after:bg-neutral-400/40
                ${last ? 'after:h-3' : ''}`}
        >
            <Link
                href={href}
                className={`hover:text-neutral-200 transition-colors ${
                    active ? 'underline text-white' : ''
                }`}
            >
                {label}
            </Link>
        </li>
    )
}

export default function Header({
    activePage,
    isAuthenticated,
    isAdmin,
}: HeaderProps) {
    const [showEasterEgg, setShowEasterEgg] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [cachedIsAdmin] = useAdminStatusCache()
    const clickCount = useRef(0)
    const resetTimer = useRef<NodeJS.Timeout | null>(null)

    const activePageIsAdminPage =
        activePage === 'admin' ||
        activePage === 'rsvps' ||
        activePage === 'addWinners' ||
        activePage === 'prevWinners' ||
        activePage === 'invited'

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

    const adminTreeLinks = (
        <ul className="flex flex-col lg:items-start items-end mt-1 lg:pl-5 lg:pr-0 pr-5">
            <TreeItem
                href="/admin/invited"
                label="Invited"
                active={activePage === 'invited'}
            />
            <TreeItem
                href="/admin/rsvps"
                label="RSVPs"
                active={activePage === 'rsvps'}
            />
            <TreeItem
                href="/admin/winners/previous"
                label="Winners"
                active={
                    activePage === 'addWinners' || activePage === 'prevWinners'
                }
                last
            />

            <li
                className={`w-full flex flex-col mt-1 lg:pl-5 lg:pr-0 pr-5 lg:inline-block ${
                    activePage === 'addWinners' || activePage === 'prevWinners'
                        ? 'lg:visible inline-block'
                        : 'lg:invisible hidden'
                }`}
            >
                <ul className="flex flex-col lg:items-start items-end">
                    <TreeItem
                        href="/admin/winners/previous"
                        label="Previous Winners"
                        active={activePage === 'prevWinners'}
                    />
                    <TreeItem
                        href="/admin/winners/add"
                        label="Add Winners"
                        active={activePage === 'addWinners'}
                        last
                    />
                </ul>
            </li>
        </ul>
    )

    return (
        <>
            {showEasterEgg && (
                <EasterEggModal onClose={() => setShowEasterEgg(false)} />
            )}
            <div
                className="flex w-full flex-col items-center text-shadow-lg bg-(--background)/60 p-[50px] pb-5 select-none relative"
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
                            data-testid="rsvp-link"
                            href="/rsvp"
                            className={activePage === 'rsvp' ? 'underline' : ''}
                        >
                            RSVP
                        </Link>
                    </div>
                )}
                {effectiveIsAdmin && (
                    <>
                        <div className="hidden lg:inline-block absolute right-20 p-10 text-neutral-400 text-base min-w-70">
                            <Link
                                data-testid="admin-link"
                                href="/admin/rsvps"
                                className={
                                    activePageIsAdminPage ? 'underline' : ''
                                }
                            >
                                ADMIN
                            </Link>

                            {activePageIsAdminPage && adminTreeLinks}
                        </div>

                        <div className="lg:hidden absolute right-2 top-2 text-neutral-300 z-40 flex flex-col items-end">
                            <button
                                aria-label="Toggle admin menu"
                                aria-expanded={mobileMenuOpen}
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                className="flex flex-col gap-1 p-2 bg-(--background)/85 rounded"
                            >
                                ADMIN
                            </button>

                            {mobileMenuOpen && (
                                <div className="bg-(--background)/85 rounded p-2 text-right text-sm flex flex-col">
                                    {adminTreeLinks}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
