import { NextResponse } from 'next/server'

export async function GET() {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Halloweeners//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'DTSTART:20261031T180000',
        'DTEND:20261101T020000',
        'SUMMARY:The Halloweeners',
        'LOCATION:Kungsportsavenyen 1, 411 36 Gothenburg',
        'DESCRIPTION:The spirits await your arrival.',
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