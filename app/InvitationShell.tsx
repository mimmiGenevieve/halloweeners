import Link from 'next/link'
import TokenAccessForm from './TokenAccessForm'

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
            <main className="flex flex-1 w-full flex-col items-center py-20">
                <div className="flex w-full flex-col items-center text-shadow-lg bg-(--background)/60 p-[50px] pb-5">
                    <h1 className="text-9xl font-bold ">The Halloweeners</h1>
                    <p className="text-2xl mt-4">
                        An Invitation to the Eternal Night.
                    </p>

                    {isAuthenticated && (
                        <div className="flex flex-row items-center justify-between mt-10 gap-10 text-2xl">
                            <Link
                                href="/"
                                className={`cursor-pointer ${
                                    activePage === 'details' ? 'underline' : ''
                                }`}
                            >
                                Details
                            </Link>
                            |
                            <Link
                                href="/rsvp"
                                className={`cursor-pointer ${
                                    activePage === 'rsvp' ? 'underline' : ''
                                }`}
                            >
                                RSVP
                            </Link>
                        </div>
                    )}
                </div>
                {isAuthenticated ? (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200 h-170 overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200 h-110 overflow-y-auto no-scrollbar">
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
