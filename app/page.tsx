import InvitationShell from './InvitationShell'

export default function Home() {
    return (
        <InvitationShell activePage="details">
            <p className="text-7xl mt-4 font-bold moontime mb-10 text-center">
                Essential Details for the Night
            </p>

            <p>
                <div>Date: October 31st, 2026.</div>
                <div>Time: 6:00 PM to late</div>
                <div>
                    Location: Kungsportsavenyen 1, 411 36 Göteborg.{' '}
                    <a
                        href="https://maps.app.goo.gl/m4Aqvqb6J3yeMaKKA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Directions.
                    </a>
                </div>
                <i>
                    Upon your arrival, call <b>Twoday</b> on the intercom to be
                    granted entry.
                </i>
            </p>
            <p className="mt-7">
                <b>Bring your own elixir of choice</b>, though light snacks will
                be provided.
            </p>
            <p>
                Prizes will be bestowed in the following categories:{' '}
                <b>Best Duo</b>, <b>Best Single</b>, <b>Scariest</b>, and
                <b> Most Creative</b>.
            </p>

            <p>
                The gathering begins promptly.{' '}
                <b>Tardiness is not advised.</b>{' '}
            </p>
            <p className="italic mt-8 text-center">
                The night awaits you; let the shadows guide your way.
            </p>
        </InvitationShell>
    )
}
