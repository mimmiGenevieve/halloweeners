import TokenAccessForm from './TokenAccessForm'
import Header from './header'
import LoadingSkeleton from './LoadingSkeleton'

type InvitationShellProps = {
    activePage: 'details' | 'rsvp' | 'admin'
    children: React.ReactNode
    isAuthenticated: boolean
    isLoading?: boolean
    isAdmin?: boolean
    authError?: string
}

export default function InvitationShell({
    activePage,
    children,
    isAuthenticated,
    isLoading,
    isAdmin,
    authError,
}: InvitationShellProps) {
    const pathPrefix = activePage === 'details' ? '' : activePage

    return (
        <div
            className={`flex flex-col flex-1 items-center justify-center bg-linear-to-b ${isAuthenticated ? 'from-mauve-900/10 to-mauve-950/90' : 'from-zinc-900/10 to-zinc-950 via-zinc-900'} min-h-screen w-full`}
        >
            <main className="flex flex-1 w-full flex-col items-center mt-10 lg:mt-12">
                <Header
                    activePage={activePage}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                />
                {isAuthenticated ? (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-10 lg:mt-12 gap-2 w-full lg:w-200  overflow-y-auto no-scrollbar text-base">
                        {isLoading ? <LoadingSkeleton /> : children}
                    </div>
                ) : (
                    <div className="flex flex-col bg-(--background)/60 p-[50px] mt-10 lg:mt-12 gap-2 w-full lg:w-200 lg:h-110 overflow-y-auto no-scrollbar text-base">
                        <TokenAccessForm
                            nextPath={`/${pathPrefix}`}
                            authError={authError}
                        />
                    </div>
                )}
            </main>
            <footer className="text-sm text-center mt-12 mb-8 opacity-70 px-4">
                <p>
                    This site uses a single cookie to remember your invitation
                    token, so you don't have to re-enter it. Your name and email
                    are stored to manage your RSVP and send confirmation
                    details—nothing is shared with third parties.
                </p>
                <p className="mt-1">
                    Questions about your data, or want it removed?{' '}
                    <a
                        href="mailto:mimmisandgren+halloweeners@gmail.com"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        You know who to ask
                    </a>
                    .
                </p>
            </footer>
        </div>
    )
}
