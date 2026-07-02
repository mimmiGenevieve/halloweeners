import { fetchPartyInfoAndEmailDetails } from '@/lib/queries/party-details'
import { NextResponse } from 'next/server'

export async function GET() {
    const partyDetails = await fetchPartyInfoAndEmailDetails()

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Halloweeners//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${partyDetails!.calendar_details.from}`,
        `DTEND:${partyDetails!.calendar_details.to}`,
        `SUMMARY:${partyDetails!.calendar_details.details}`,
        `LOCATION:${partyDetails!.party_details.address}`,
        `DESCRIPTION:${partyDetails!.calendar_details.details || ''}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n')

    return new NextResponse(icsContent, {
        headers: {
            'Content-Type': 'text/calendar;charset=utf-8',
            'Content-Disposition': 'attachment; filename="halloweeners.ics"',
        },
    })
}
