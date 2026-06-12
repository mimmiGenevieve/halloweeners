import Link from 'next/link'
import TokenAccessForm from './TokenAccessForm'
import { GuestLookupRow } from '@/lib/guest-auth'

type InvitationShellProps = {
    activePage: 'details' | 'rsvp'
    children: React.ReactNode
    isAuthenticated: boolean
    authError?: string
}

export default function InvitationShell({
    activePage,
    children,
    isAuthenticated,
    authError,
}: InvitationShellProps) {
    const pathPrefix = activePage === 'details' ? '' : 'rsvp'
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-linear-to-b from-mauve-900/10 to-mauve-950/90">
            <main className="flex flex-1 w-full flex-col items-center mt-10 lg:mt-15">
                <div className="flex w-full flex-col items-center text-shadow-lg bg-(--background)/60 p-[50px] pb-5">
                    <h1 className="lg:text-9xl text-6xl font-bold">
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
                                className={
                                    activePage === 'rsvp' ? 'underline' : ''
                                }
                            >
                                RSVP
                            </Link>
                        </div>
                    )}
                </div>
                {isAuthenticated ? (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-10 lg:mt-20 gap-2 text-xl w-full lg:w-200  overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-10 lg:mt-20 gap-2 text-xl w-full lg:w-200 lg:h-110 overflow-y-auto no-scrollbar">
                        <TokenAccessForm
                            nextPath={`/${pathPrefix}`}
                            authError={authError}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
