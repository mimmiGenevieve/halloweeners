import { NextRequest, NextResponse } from 'next/server'
import { fetchPartyInfoAndEmailDetails } from '@/lib/queries/party-details'
import { isValidGuestToken } from '@/lib/helpers'

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token')
    const guest = token ? await isValidGuestToken(token) : null

    if (!guest) {
        return new NextResponse('Not found', { status: 404 })
    }

    const partyDetails = await fetchPartyInfoAndEmailDetails()
    if (!partyDetails) {
        return new NextResponse('Event details not configured', { status: 500 })
    }

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Halloweeners//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${partyDetails.calendar_details.from}`,
        `DTEND:${partyDetails.calendar_details.to}`,
        `SUMMARY:${partyDetails.calendar_details.details}`,
        `LOCATION:${partyDetails.party_details.address}`,
        `DESCRIPTION:${partyDetails.calendar_details.details || ''}`,
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
