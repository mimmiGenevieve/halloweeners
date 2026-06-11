import InvitationShell from './InvitationShell'

export default function Home() {
    return (
        <InvitationShell activePage="details">
            <div className="flex flex-col  bg-(--background)/60 p-[50px] mt-30 gap-2 text-xl w-200">
                <p className="text-7xl mt-4 font-bold moontime mb-10 text-center">
                    Essential Details for the Night
                </p>
                <p>
                    <b>Bring your own elixir of choice</b>, though light snacks
                    will be provided.
                </p>
                <p>
                    Prizes will be bestowed in the following categories:
                    <b>Best Duo</b>, <b>Best Single</b>, <b>Scariest</b>, and
                    <b> Most Creative</b>.
                </p>
                <p>
                    The gathering begins promptly.{' '}
                    <b>Tardiness is not advised.</b> Upon your arrival, call
                    Twoday on the intercom to be granted entry.
                </p>
                <p className="italic mt-8 text-center">
                    The night awaits you; let the shadows guide your way.
                </p>
            </div>
        </InvitationShell>
    )
}
