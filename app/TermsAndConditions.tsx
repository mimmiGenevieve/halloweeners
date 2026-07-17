'use client'
import { useState } from 'react'

const DEFINITIONS: { term: string; body: string }[] = [
    {
        term: '"the Event"',
        body: 'refers to The Halloweeners, an annual gathering organized by the Host on or around October 31st (the "Effective Date"), regardless of the actual calendar date on which it is held.',
    },
    {
        term: '"the Host"',
        body: 'refers to Mimmi, and any individual she designates, at her sole discretion, as having organizing authority for the purposes of the Event.',
    },
    {
        term: '"Guest"',
        body: 'refers to any natural person, or Familiar as defined below, granted entry to the Event by way of a valid RSVP.',
    },
    {
        term: '"RSVP"',
        body: "refers to the Guest's formal, written confirmation of attendance, including the specific number and identity of any accompanying persons, submitted through the Site prior to the Event.",
    },
    {
        term: '"Punishment"',
        body: 'refers to any corrective measure, performance obligation, or consequence levied against a Guest at the sole and unreviewable discretion of the Host, in lieu of, or in addition to, denial of entry.',
    },
    {
        term: '"Familiar"',
        body: 'refers to any pet, animal companion, or otherwise summoned entity accompanying a Guest to the Event.',
    },
]

const RULES: { title: string; body: string }[] = [
    {
        title: 'Timeliness of Attendance',
        body: 'Arrival after the stated commencement time of the Event ("Late Arrival") may, at the Host\'s sole discretion, result in denial of entry or the imposition of a Punishment. Without limiting the generality of the foregoing, historical Punishments have included: delivery of a dramatic entrance monologue to the assembled Guests, assignment of the least desirable Halloween-related cleaning duty of the evening, or consumption of a beverage the composition of which the Host reserves the right not to disclose in advance.',
    },
    {
        title: 'Undisclosed Additional Guests',
        body: 'Any Guest who arrives accompanied by persons not specified on their RSVP, and who has not obtained prior authorization from the Host, acknowledges that such additional persons may be denied entry, and that the responsible Guest may be subject to a Punishment. For the avoidance of doubt, the Host does not recognize, honor, or accommodate undisclosed plus-ones under any circumstances.',
    },
    {
        title: 'Non-Attendance Without Notice',
        body: 'A Guest who fails to attend the Event without providing notice to the Host, whether in advance of or during the Event, shall be ineligible to receive an invitation to any subsequent Event for a minimum period of two (2) years from the date of the missed Event. This provision constitutes the single most severely enforced clause of this Agreement and is not subject to appeal.',
    },
    {
        title: 'Non-Attendance With Notice',
        body: "A Guest who provides notice of non-attendance, whether in advance of or during the Event, shall remain in good standing and eligible for future invitations. The Host reserves the right to discuss the Guest's absence in a critical or unflattering manner with other Guests during the Event, and the Guest hereby waives any claim arising therefrom.",
    },
    {
        title: 'Voluntary Assistance',
        body: "A Guest who materially assists with cleaning or tidying efforts during the course of the Event, as opposed to after its conclusion, shall be entitled to complimentary beverages for the remainder of the Event, in a quantity determined at the Host's discretion.",
    },
    {
        title: 'Guest Transportation',
        body: "Where the Host determines, in good faith, that a Guest is not fit to return home unassisted, the Host will arrange for third-party transportation on the Guest's behalf. All costs associated with such transportation shall be borne exclusively by the Guest. This provision is enacted in the interest of Guest safety and confers no financial obligation upon the Host.",
    },
    {
        title: 'Standard of Conduct',
        body: 'A Guest who engages in conduct that the Host, at its sole discretion, deems hostile, disrespectful, or otherwise unreasonable, shall be subject to immediate removal from the Event. This determination is final and not subject to further review.',
    },
    {
        title: 'Extreme Bodily Conduct',
        body: 'A Guest who engages in involuntary or voluntary elevation to overhead structures (including but not limited to ceilings) combined with the ejection of stomach contents onto other Guests shall be deemed to have triggered a supernatural incident. In such an event, the Host will engage the services of a licensed member of the clergy to perform a formal rite of exorcism upon the offending Guest. The Host confirms that such services have been arranged in advance and are available on short notice.',
    },
    {
        title: 'Prohibited Summonings',
        body: 'The summoning, invocation, or manifestation of any demonic entity, whether intentional, accidental, or ceremonial in nature, shall result in immediate removal from the Event, irrespective of the demeanor or apparent goodwill of the entity in question.',
    },
    {
        title: 'Communication with the Deceased',
        body: 'Any Guest electing to engage in necromantic or séance-based communication with deceased persons does so entirely at their own risk and warrants that they possess adequate skill and experience to do so safely. The Host disclaims all liability for any curses, hauntings, hexes, or unresolved disputes arising from such communications, and will not act as an intermediary in the event of a dispute between the Guest and the deceased party.',
    },
    {
        title: 'Familiars and Accompanying Entities',
        body: "Any Familiar brought to the Event is subject to the same disclosure requirements set forth in Section 2 above and shall be counted toward the Guest's declared RSVP total. This requirement applies without exception, including to Familiars of a feline or otherwise ambiguously sentient nature.",
    },
    {
        title: 'Costume Competition Integrity',
        body: 'Attempts to influence the outcome of the costume competition through the provision of gifts, favors, or other consideration to competition judges are discouraged. The Host notes, for the record, that successful attempts are viewed considerably more favorably than unsuccessful ones, and that the distinction between the two will be readily apparent to the Host.',
    },
]

function TermsModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-(--background) border border-red-300/50 rounded max-w-200 w-full max-h-[70vh] overflow-y-auto no-scrollbar text-left"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="lg:sticky top-0 bg-(--background) z-5 p-6">
                    <p className="moontime lg:text-6xl text-4xl font-bold text-center mb-2">
                        Terms & Conditions
                    </p>
                    <p className="text-center opacity-70 mb-1 text-sm">
                        Last updated: October 2026
                    </p>
                    <p className="text-center opacity-70  text-sm">
                        This Agreement governs a Guest&apos;s attendance at the
                        Event and is entered into between the Guest and the Host
                        upon submission of an RSVP.
                    </p>
                </div>

                <div className="p-6">
                    <p className="font-bold mb-2">1. Definitions</p>
                    <ul className="flex flex-col gap-2 mb-6">
                        {DEFINITIONS.map((definition) => (
                            <li key={definition.term} className="opacity-90">
                                <span className="font-bold not-italic">
                                    {definition.term}
                                </span>{' '}
                                {definition.body}
                            </li>
                        ))}
                    </ul>

                    <ol
                        className="flex flex-col gap-4 list-decimal list-inside"
                        start={2}
                    >
                        {RULES.map((rule) => (
                            <li key={rule.title}>
                                <span className="font-bold">{rule.title}.</span>{' '}
                                <span className="opacity-90">{rule.body}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="lg:sticky bottom-[-1px] bg-(--background) z-5 p-6">
                    <p className="text-center opacity-70 mt-6 text-sm">
                        By submitting an RSVP, the Guest acknowledges having
                        read, understood, and accepted the foregoing Terms &
                        Conditions in their entirety. Ignorance of this
                        Agreement shall not constitute a defense to its
                        enforcement.
                    </p>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onClose}
                            className="underline text-sm"
                            data-testid="terms-modal-close"
                        >
                            close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TermsAndConditions() {
    const [showTerms, setShowTerms] = useState(false)

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setShowTerms(true)
                }}
                className="underline"
                data-testid="terms-link"
            >
                Terms & Conditions
            </button>
            {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
        </>
    )
}
