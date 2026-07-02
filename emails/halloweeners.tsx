import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Link,
    Hr,
} from '@react-email/components'

import { PartyDetailsRow, CalendarDetailsRow } from '@/lib/types/details'

type ConfirmationEmailProps = {
    userToken: string
    name: string
    prize?: string
    companionName?: string
    details: {
        party_details: PartyDetailsRow
        calendar_details: CalendarDetailsRow
    }
}

function formatPartyDate(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date)
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()

    const suffix = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return s[(v - 20) % 10] || s[v] || s[0]
    }

    return `${month} ${day}${suffix(day)}, ${year}.`
}

function buildGoogleCalendarUrl(details: ConfirmationEmailProps['details']) {
    const url = new URL('https://calendar.google.com/calendar/render')
    url.searchParams.set('action', 'TEMPLATE')
    url.searchParams.set('text', 'The Halloweeners')
    url.searchParams.set(
        'dates',
        `${details.calendar_details.from}/${details.calendar_details.to}`
    )
    url.searchParams.set('location', details.party_details.address)
    url.searchParams.set('details', details.calendar_details.details || '')
    return url.toString()
}

export default function ConfirmationEmail({
    userToken,
    name,
    prize,
    companionName,
    details,
}: ConfirmationEmailProps) {
    const googleCalendarUrl = buildGoogleCalendarUrl(details)
    const dateLabel = formatPartyDate(details.party_details.date)
    const timeLabel = details.party_details.end
        ? `${details.party_details.start} — ${details.party_details.end}`
        : details.party_details.start

    return (
        <Html>
            <Head />
            <Preview>Your place among the gathering is secured.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={{ textAlign: 'center', paddingBottom: 32 }}>
                        <Text style={titleStyle}>The Halloweeners</Text>
                        <Text style={subtitleStyle}>{dateLabel}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={{ paddingBottom: 24 }}>
                        <Text style={paragraph}>{name},</Text>
                        <Text style={paragraph}>
                            Your answer has been received. The spirits have
                            recorded your{' '}
                            {companionName
                                ? `and your companion's name, ${companionName}`
                                : 'name'}
                            , and your place among the gathering is secured. We
                            shall expect your presence as the veil thins on the
                            night of {dateLabel}.
                        </Text>
                        <Text style={{ ...paragraph, marginBottom: 0 }}>
                            The hour and location are etched below. Do not lose
                            them.
                        </Text>
                    </Section>

                    <Section style={detailsBox}>
                        <Text style={label}>When</Text>
                        <Text style={value}>
                            {dateLabel} — {timeLabel}
                        </Text>
                        <Text style={label}>Where</Text>
                        <Text style={{ ...value, marginBottom: 0 }}>
                            {details.party_details.address}
                        </Text>
                    </Section>

                    <Section style={{ paddingTop: 24, paddingBottom: 24 }}>
                        <Text style={label}>Add to calendar</Text>
                        <Link href={googleCalendarUrl} style={linkStyle}>
                            Google
                        </Link>
                        <span style={{ color: '#444444' }}> | </span>
                        <Link
                            href="https://www.halloweeners.se/api/calendar"
                            style={{ ...linkStyle, marginLeft: 12 }}
                        >
                            Apple / Outlook
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    {prize && (
                        <Section style={winnerBox}>
                            <Text style={winnerTitle}>
                                A reminder from the shadows
                            </Text>
                            <Text style={winnerText}>
                                The spirits have not forgotten that you bear a
                                title — reigning master of {prize}. Your crown
                                is yours no longer to keep, but to pass on. Do
                                not arrive empty-handed. Bring forth the prize
                                you once claimed, that it may be transferred
                                with honor during the night's ceremony. The
                                cycle demands it.
                            </Text>
                        </Section>
                    )}

                    <Section style={{ paddingBottom: 32 }}>
                        <Text style={paragraph}>
                            Should your fate shift before October 28th, return
                            to the site to update your answer — whether you wish
                            to bring a companion or amend your details. If the
                            darkness conspires to keep you away entirely, the
                            spirits ask that you reach out to Mimmi or Sebastian
                            directly. You know how to find us.
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={{ textAlign: 'center' }}>
                        <Text style={footer}>
                            The spirits do not accept replies to this message.
                            <br />
                            If you must speak, you know where to find us.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

ConfirmationEmail.PreviewProps = {
    userToken: 'abc123',
    name: 'Mimmi',
    prize: 'Scariest',
    companionName: 'Sebastian',
    details: {
        party_details: {
            date: new Date('2026-10-31'),
            start: '18:00',
            end: '',
            address: 'Some Street 1, Gothenburg',
            address_extra: null,
        },
        calendar_details: {
            from: '20261031T180000',
            to: '20261101T020000',
            details: 'The spirits await your arrival.',
        },
    },
} as ConfirmationEmailProps

const main = {
    backgroundColor: '#0a0a0a',
    fontFamily: 'Georgia, serif',
    color: '#cccccc',
    padding: '40px 20px',
}
const container = { maxWidth: '600px', margin: '0 auto' }
const titleStyle = { margin: 0, fontSize: '48px', color: '#ffffff' }
const subtitleStyle = {
    margin: '8px 0 0 0',
    fontSize: '14px',
    letterSpacing: '3px',
    color: '#888888',
    textTransform: 'uppercase' as const,
}
const hr = { borderTop: '1px solid #333333', marginBottom: '32px' }
const paragraph = { margin: '0 0 16px 0', fontSize: '16px', lineHeight: '1.7' }
const detailsBox = {
    backgroundColor: '#111111',
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '20px',
}
const label = {
    margin: '0 0 6px 0',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: '#888888',
}
const value = { margin: '0 0 16px 0', fontSize: '16px', color: '#ffffff' }
const linkStyle = {
    display: 'inline-block',
    marginRight: '12px',
    color: '#cccccc',
    fontSize: '15px',
}
const winnerBox = {
    padding: '24px',
    border: '1px solid #4a0000',
    backgroundColor: '#1a0000',
    borderRadius: '4px',
    marginBottom: '24px',
}
const winnerTitle = {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff6666',
}
const winnerText = { margin: 0, color: '#cccccc', fontSize: '16px' }
const footer = {
    margin: 0,
    fontSize: '13px',
    color: '#555555',
    lineHeight: '1.7',
}
